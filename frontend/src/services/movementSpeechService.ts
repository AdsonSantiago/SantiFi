type VoiceProgress = (percent: number | null) => void;

interface WorkerResponse {
  type: "progress" | "result" | "error";
  id?: number;
  progress?: number | null;
  text?: string;
  message?: string;
}

interface PendingTranscription {
  resolve: (text: string) => void;
  reject: (error: Error) => void;
  onProgress: VoiceProgress;
}

const SAMPLE_RATE = 16_000;
let worker: Worker | null = null;
let nextRequestId = 1;
const pendingRequests = new Map<number, PendingTranscription>();

function getWorker(): Worker {
  if (worker) return worker;

  worker = new Worker(
    new URL("../workers/movementSpeech.worker.ts", import.meta.url),
    { type: "module" },
  );
  worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
    const response = event.data;
    if (response.type === "progress") {
      pendingRequests.forEach((request) => request.onProgress(response.progress ?? null));
      return;
    }

    if (response.id === undefined) return;
    const request = pendingRequests.get(response.id);
    if (!request) return;
    pendingRequests.delete(response.id);

    if (response.type === "result") {
      request.resolve(response.text ?? "");
    } else {
      request.reject(new Error(response.message || "Não foi possível transcrever o áudio."));
    }
  });
  worker.addEventListener("error", () => {
    const error = new Error("O mecanismo de voz não conseguiu iniciar no navegador.");
    pendingRequests.forEach((request) => request.reject(error));
    pendingRequests.clear();
    worker?.terminate();
    worker = null;
  });

  return worker;
}

async function decodeToWhisperAudio(recording: Blob): Promise<Float32Array> {
  const audioContext = new AudioContext();

  try {
    const decoded = await audioContext.decodeAudioData(await recording.arrayBuffer());
    const outputLength = Math.ceil(decoded.duration * SAMPLE_RATE);
    if (outputLength === 0) throw new Error("A gravação não contém áudio.");

    const offlineContext = new OfflineAudioContext(1, outputLength, SAMPLE_RATE);
    const source = offlineContext.createBufferSource();
    source.buffer = decoded;
    source.connect(offlineContext.destination);
    source.start();

    const resampled = await offlineContext.startRendering();
    return resampled.getChannelData(0).slice();
  } finally {
    await audioContext.close();
  }
}

export async function transcribeMovementAudio(
  recording: Blob,
  onProgress: VoiceProgress,
): Promise<string> {
  const audio = await decodeToWhisperAudio(recording);
  const requestId = nextRequestId++;
  const activeWorker = getWorker();

  return new Promise((resolve, reject) => {
    pendingRequests.set(requestId, { resolve, reject, onProgress });
    activeWorker.postMessage({ id: requestId, audio }, [audio.buffer]);
  });
}
