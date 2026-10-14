import { pipeline } from "@huggingface/transformers";

interface TranscribeMessage {
  id: number;
  audio: Float32Array;
}

interface Transcriber {
  (
    audio: Float32Array,
    options: { language: string; task: "transcribe" },
  ): Promise<{ text: string }>;
}

const workerScope = self as unknown as {
  postMessage(message: unknown): void;
  addEventListener(
    type: "message",
    listener: (event: MessageEvent<TranscribeMessage>) => void,
  ): void;
};
let transcriberPromise: Promise<Transcriber> | null = null;

function getTranscriber(): Promise<Transcriber> {
  if (!transcriberPromise) {
    transcriberPromise = pipeline(
      "automatic-speech-recognition",
      "onnx-community/whisper-tiny",
      {
        dtype: "q8",
        progress_callback: (progress) => {
          workerScope.postMessage({
            type: "progress",
            progress: progress.status === "progress_total" ? progress.progress : null,
          });
        },
      },
    ) as unknown as Promise<Transcriber>;
  }

  return transcriberPromise;
}

workerScope.addEventListener("message", async (event: MessageEvent<TranscribeMessage>) => {
  const { id, audio } = event.data;

  try {
    const transcriber = await getTranscriber();
    const result = await transcriber(audio, {
      language: "portuguese",
      task: "transcribe",
    });
    workerScope.postMessage({ type: "result", id, text: result.text.trim() });
  } catch (error) {
    transcriberPromise = null;
    workerScope.postMessage({
      type: "error",
      id,
      message: error instanceof Error ? error.message : "Falha ao carregar ou executar o Whisper.",
    });
  }
});
