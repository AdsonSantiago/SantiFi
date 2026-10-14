import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { FormEvent } from "react";

import type {
    Movimento,
    CreateMovementData,
} from "../../../services/movementService";

import {
    createMovement,
    updateMovement,
} from "../../../services/movementService";

import { getAccounts } from "../../../services/accountService";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { createMovementDraft } from "../../../services/movementAssistantService";
import { transcribeMovementAudio } from "../../../services/movementSpeechService";
import {
    createCategoria,
    getCategorias,
    type Categoria,
} from "../../../services/categoriaService";

import "./movimentoForm.css";

interface MovimentoFormProps {
    movimento?: Movimento | null;
    onSuccess: () => void;
    onCancel: () => void;
}

function getTodayDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function MovimentoForm({
  movimento,
  onSuccess,
  onCancel,
}: MovimentoFormProps) {
  const [conta, setConta] = useState("");
  const [tipo, setTipo] = useState<"REC" | "DES">("DES");
  const [categoria, setCategoria] = useState("");
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");
  const [textoAssistente, setTextoAssistente] = useState("");
  const [feedbackAssistente, setFeedbackAssistente] = useState("");
  const [ouvindo, setOuvindo] = useState(false);
  const [transcrevendo, setTranscrevendo] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataMovimento, setDataMovimento] = useState("");
  const [observacao, setObservacao] = useState("");

  const [contas, setContas] = useState<
    Awaited<ReturnType<typeof getAccounts>>["results"]
  >([]);

  const [categorias, setCategorias] = useState<
    Awaited<ReturnType<typeof getCategorias>>["results"]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [mostrarObservacao, setMostrarObservacao] =
    useState(false);
  const gravadorRef = useRef<MediaRecorder | null>(null);
  const streamMicrofoneRef = useRef<MediaStream | null>(null);
  const partesAudioRef = useRef<Blob[]>([]);
  const limiteGravacaoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const modoEdicao = Boolean(movimento);

  useEffect(() => () => {
    if (limiteGravacaoRef.current) clearTimeout(limiteGravacaoRef.current);
    if (gravadorRef.current) {
      gravadorRef.current.onstop = null;
      if (gravadorRef.current.state !== "inactive") gravadorRef.current.stop();
    }
    streamMicrofoneRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  async function handleGravarVoz() {
    if (ouvindo) {
      gravadorRef.current?.stop();
      return;
    }

    if (transcrevendo) return;

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setFeedbackAssistente("Este navegador não oferece gravação de áudio. Você ainda pode digitar a descrição.");
      return;
    }

    let stream: MediaStream;
    try {
      setFeedbackAssistente("Solicitando acesso ao microfone…");
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (microphoneError) {
      console.error("Não foi possível acessar o microfone:", microphoneError);
      setFeedbackAssistente("Não foi possível acessar o microfone. Confira a permissão do navegador e tente novamente.");
      return;
    }

    streamMicrofoneRef.current = stream;
    const formatos = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
    const formato = formatos.find((item) => MediaRecorder.isTypeSupported(item));
    const gravador = formato
      ? new MediaRecorder(stream, { mimeType: formato })
      : new MediaRecorder(stream);
    partesAudioRef.current = [];
    gravadorRef.current = gravador;
    gravador.ondataavailable = (event) => {
      if (event.data.size > 0) partesAudioRef.current.push(event.data);
    };
    gravador.onerror = () => {
      stream.getTracks().forEach((track) => track.stop());
      streamMicrofoneRef.current = null;
      gravadorRef.current = null;
      setOuvindo(false);
      setFeedbackAssistente("Ocorreu um erro durante a gravação. Tente novamente ou digite a descrição.");
    };
    gravador.onstop = () => {
      if (limiteGravacaoRef.current) clearTimeout(limiteGravacaoRef.current);
      stream.getTracks().forEach((track) => track.stop());
      streamMicrofoneRef.current = null;
      gravadorRef.current = null;
      setOuvindo(false);

      const audio = new Blob(partesAudioRef.current, { type: gravador.mimeType });
      partesAudioRef.current = [];
      if (audio.size === 0) {
        setFeedbackAssistente("Nenhum áudio foi capturado. Tente gravar novamente.");
        return;
      }

      setTranscrevendo(true);
      setFeedbackAssistente("Transcrevendo no dispositivo. Na primeira vez, o modelo Whisper será baixado…");
      void transcribeMovementAudio(audio, (percent) => {
        setFeedbackAssistente(percent === null
          ? "Carregando o modelo Whisper no dispositivo…"
          : `Baixando o modelo Whisper: ${Math.round(percent)}%`);
      })
        .then((transcricao) => {
          if (!transcricao) {
            setFeedbackAssistente("Não consegui reconhecer a fala. Tente novamente ou digite a descrição.");
            return;
          }
          setTextoAssistente((atual) => {
            const textoAtual = atual.trim();
            return textoAtual ? `${textoAtual} ${transcricao}` : transcricao;
          });
          setFeedbackAssistente("Transcrição concluída no dispositivo. Revise o texto antes de preencher com IA.");
        })
        .catch((transcriptionError: unknown) => {
          console.error("Erro ao transcrever áudio localmente:", transcriptionError);
          setFeedbackAssistente("Não foi possível carregar ou executar o Whisper. Confira sua conexão na primeira utilização e tente novamente.");
        })
        .finally(() => setTranscrevendo(false));
    };

    try {
      gravador.start();
      setOuvindo(true);
      setFeedbackAssistente("Gravando… fale o lançamento e toque em Parar quando terminar.");
      limiteGravacaoRef.current = setTimeout(() => {
        if (gravador.state === "recording") {
          setFeedbackAssistente("Limite de 60 segundos atingido. Processando a gravação…");
          gravador.stop();
        }
      }, 60_000);
    } catch {
      stream.getTracks().forEach((track) => track.stop());
      streamMicrofoneRef.current = null;
      gravadorRef.current = null;
      setOuvindo(false);
      setFeedbackAssistente("Não foi possível iniciar a gravação. Confira a permissão do microfone.");
    }
  }

  useEffect(() => {
      async function carregarDados() {
          try {
              setLoading(true);
              setError("");

              const [contasResponse, categoriasResponse] =
                  await Promise.all([
                      getAccounts(),
                    getCategorias(),
                  ]);

              const contasAtivas = contasResponse.results.filter(
                  (item) => item.ativo
              );

              const categoriasAtivas =
                  categoriasResponse.results.filter(
                      (item) => item.ativo
                  );

              setContas(contasAtivas);
              setCategorias(categoriasAtivas);

              if (movimento) {
                  setConta(String(movimento.conta));
                  setTipo(
                      movimento.tipo === "REC"
                          ? "REC"
                          : "DES"
                  );
                  setCategoria(
                      movimento.categoria
                          ? String(movimento.categoria)
                          : ""
                  );
                  setDescricao(movimento.descricao);
                  setValor(movimento.valor);
                  setDataMovimento(movimento.data_movimento);
                  setObservacao(
                      movimento.observacao ?? ""
                  );
                  setMostrarObservacao(
                      Boolean(movimento.observacao)
                  );
              } else {
                  setConta("");
                  setTipo("DES");
                  setCategoria("");
                  setDescricao("");
                  setValor("");
                  setObservacao("");
                  setMostrarObservacao(false);

                  setDataMovimento(getTodayDate());
              }
          } catch (error) {
              console.error(error);
              setError(
                  "Não foi possível carregar os dados do formulário."
              );
          } finally {
              setLoading(false);
          }
      }

      carregarDados();
  }, [movimento]);


  const categoriasFiltradas = useMemo(() => {
    return categorias.filter(
      (item) => item.tipo === tipo,
    );
  }, [categorias, tipo]);

  const categoriaSelecionada = categoriasFiltradas.find(
    (item) => String(item.id) === categoria,
  );

  useEffect(() => {
    const categoriaAtualExiste = categoriasFiltradas.some(
      (item) => String(item.id) === categoria,
    );

    if (!categoriaAtualExiste) {
      setCategoria("");
    }
  }, [categoriasFiltradas, categoria]);

  function handleTipoChange(nextTipo: "REC" | "DES") {
    setTipo(nextTipo);
    setCategoria("");
    setNovaCategoriaNome("");
    setError("");
  }

  async function handleCriarCategoria() {
    const nome = novaCategoriaNome.trim();
    if (nome.length < 2) {
      setError("Digite um nome com pelo menos 2 caracteres para a categoria.");
      return;
    }

    try {
      setSavingCategory(true);
      setError("");
      const novaCategoria: Categoria = await createCategoria({
        nome,
        tipo,
        descricao: null,
        ativo: true,
      });
      setCategorias((current) => [...current, novaCategoria]);
      setCategoria(String(novaCategoria.id));
      setNovaCategoriaNome("");
    } catch (createError) {
      console.error("Erro ao criar categoria pelo formulário de movimento:", createError);
      setError(getApiErrorMessage(
        createError,
        "Não foi possível criar essa categoria. Confira se já existe uma categoria com esse nome.",
      ));
    } finally {
      setSavingCategory(false);
    }
  }

  async function handlePreencherComIA() {
    const texto = textoAssistente.trim();
    if (texto.length < 3) {
      setError("Descreva o movimento com pelo menos 3 caracteres.");
      return;
    }

    try {
      setAiLoading(true);
      setError("");
      setFeedbackAssistente("");
      const draft = await createMovementDraft(texto);

      if (draft.tipo) setTipo(draft.tipo);
      setConta(draft.conta_id ? String(draft.conta_id) : "");
      setCategoria(draft.categoria_id ? String(draft.categoria_id) : "");
      setNovaCategoriaNome(
        draft.categoria_id ? "" : draft.categoria_nome_sugerida,
      );
      setValor(draft.valor ?? "");
      if (draft.data_movimento) {
        setDataMovimento(draft.data_movimento);
      }
      if (draft.descricao) setDescricao(draft.descricao);

      setFeedbackAssistente(
        draft.pergunta || "Rascunho preenchido. Revise os campos antes de salvar.",
      );
    } catch (draftError) {
      console.error("Erro ao preparar movimento com IA:", draftError);
      setError(getApiErrorMessage(
        draftError,
        "Não foi possível preparar o rascunho. Confira se o Ollama está ativo.",
      ));
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const numericValue = Number(valor);
    const numericAccount = Number(conta);
    const numericCategory = Number(categoria);

    if (!conta || !Number.isInteger(numericAccount)) {
      setError("Selecione uma conta válida.");
      return;
    }

    if (
      !categoria ||
      !Number.isInteger(numericCategory)
    ) {
      setError("Selecione uma categoria válida.");
      return;
    }

    if (
      !valor ||
      Number.isNaN(numericValue) ||
      numericValue <= 0
    ) {
      setError("Informe um valor maior que zero.");
      return;
    }

    if (!dataMovimento) {
      setError("Informe a data do movimento.");
      return;
    }

    const movimentoData: CreateMovementData = {
        conta: numericAccount,
        categoria: numericCategory,
        tipo,
        descricao: descricao.trim(),
        valor,
        data_movimento: dataMovimento,
        observacao: observacao.trim() || null,
    };

    try {
        setSaving(true);
        setError("");

        if (modoEdicao && movimento) {
            await updateMovement(
                movimento.id,
                movimentoData
            );
        } else {
          await createMovement(movimentoData);
        }

        onSuccess();
    } catch (error) {
        console.error("Erro ao salvar movimento:", error);
        setError(getApiErrorMessage(error, "Não foi possível salvar o movimento."));
    } finally {
        setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="movimento-form-state" role="status">
        <span className="movimento-form-spinner" />
        <p>Carregando formulário...</p>
      </div>
    );
  }

  return (
      <div className="movimento-form-container">
        <button
          type="button"
          className="movimento-form-backdrop"
          onClick={saving ? undefined : onCancel}
          aria-label="Fechar formulário"
          disabled={saving}
        />

        <form
          className="movimento-form"
          onSubmit={handleSubmit}
          role="dialog"
          aria-modal="true"
          aria-labelledby="movimento-form-title"
          noValidate
        >
        <header className="movimento-form-header">
          <div>

            <p className="movimento-form-eyebrow">
                {modoEdicao ? "EDIÇÃO DE LANÇAMENTO" : "NOVO LANÇAMENTO"}
            </p>

            <h2 id="movimento-form-title">
                {modoEdicao ? "Editar movimento" : "Novo movimento"}
            </h2>

            <p>
                {modoEdicao
                    ? "Atualize os dados do movimento."
                    : "Registre uma receita ou uma despesa."}
            </p>
          </div>

          <button
            type="button"
            className="movimento-form-close"
            onClick={onCancel}
            disabled={saving}
            aria-label="Fechar formulário"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {error && (
          <div
            className="movimento-form-error"
            role="alert"
          >
            <span aria-hidden="true">!</span>
            {error}
          </div>
        )}

        {!modoEdicao && (
          <section className="movement-ai-draft" aria-labelledby="movement-ai-title">
            <div className="movement-ai-heading">
              <div>
                <p className="movement-ai-eyebrow">PREENCHIMENTO ASSISTIDO</p>
                <h3 id="movement-ai-title">Descreva o lançamento</h3>
              </div>
              <span aria-hidden="true">✦</span>
            </div>
            <label htmlFor="movement-ai-text">
              Escreva como você contaria para alguém
            </label>
            <textarea
              id="movement-ai-text"
              value={textoAssistente}
              onChange={(event) => {
                setTextoAssistente(event.target.value);
                setFeedbackAssistente("");
              }}
              placeholder="Ex.: Paguei R$ 83,50 no mercado hoje usando minha conta corrente."
              maxLength={500}
              rows={2}
                disabled={aiLoading || saving || ouvindo || transcrevendo}
            />
            <div className="movement-ai-actions">
              <small>O áudio é transcrito no dispositivo e não é enviado ao app. Na primeira vez, o modelo é baixado; depois fica em cache.</small>
              <div className="movement-ai-buttons">
                <button
                  type="button"
                  className={ouvindo ? "is-listening" : ""}
                  onClick={handleGravarVoz}
                  disabled={aiLoading || saving || transcrevendo}
                  aria-pressed={ouvindo}
                >
                  {transcrevendo ? "Transcrevendo…" : ouvindo ? "Parar gravação" : "Gravar voz"}
                </button>
                <button
                  type="button"
                  onClick={handlePreencherComIA}
                  disabled={aiLoading || saving || ouvindo || transcrevendo || textoAssistente.trim().length < 3}
                >
                  {aiLoading ? "Preparando..." : "Preencher com IA"}
                </button>
              </div>
            </div>
            {feedbackAssistente && (
              <p className="movement-ai-feedback" role="status">
                {feedbackAssistente}
              </p>
            )}
          </section>
        )}

        <fieldset
          className="movimento-form-fields"
          disabled={saving || aiLoading || savingCategory}
        >
          <legend className="sr-only">
            Dados do movimento
          </legend>

          <div className="movimento-form-field">
            <span className="movimento-field-label">
              O que aconteceu?
              <span aria-hidden="true">*</span>
            </span>

            <div
              className="movimento-type-selector"
              role="group"
              aria-label="Tipo do movimento"
            >
              <button
                type="button"
                className={
                  tipo === "DES" ? "active expense" : ""
                }
                onClick={() => handleTipoChange("DES")}
                aria-pressed={tipo === "DES"}
              >
                <span aria-hidden="true">↘</span>
                Despesa
              </button>

              <button
                type="button"
                className={
                  tipo === "REC" ? "active income" : ""
                }
                onClick={() => handleTipoChange("REC")}
                aria-pressed={tipo === "REC"}
              >
                <span aria-hidden="true">↗</span>
                Receita
              </button>
            </div>
          </div>

          <div className="movimento-form-field movimento-form-value">
            <label htmlFor="valor">
              Valor
              <span aria-hidden="true">*</span>
            </label>

            <div className="value-input">
              <span aria-hidden="true">R$</span>

              <input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                min="0.01"
                value={valor}
                onChange={(event) => {
                  setValor(event.target.value);
                  setError("");
                }}
                placeholder="0,00"
                inputMode="decimal"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="movimento-form-grid">
            <div className="movimento-form-field">
              <label htmlFor="conta">
                Conta
                <span aria-hidden="true">*</span>
              </label>

              <select
                id="conta"
                name="conta"
                value={conta}
                onChange={(event) => {
                  setConta(event.target.value);
                  setError("");
                }}
                required
                aria-required="true"
              >
                {contas.length === 0 ? (
                  <option value="">
                    Nenhuma conta ativa disponível
                  </option>
                ) : (
                  <>
                    <option value="">
                      Selecione uma conta
                    </option>

                    {contas.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.nome}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="movimento-form-field">
              <label htmlFor="categoria">
                Categoria de {tipo === "REC" ? "receita" : "despesa"}
                <span aria-hidden="true">*</span>
              </label>

              <select
                id="categoria"
                name="categoria"
                value={categoria}
                onChange={(event) => {
                  setCategoria(event.target.value);
                  setError("");
                }}
                required
                aria-required="true"
              >
                <option value="">
                  Selecione uma categoria
                </option>

                {categoriasFiltradas.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nome}
                  </option>
                ))}
              </select>
              {categoriaSelecionada?.descricao && (
                <small className="movimento-category-description">
                  {categoriaSelecionada.descricao}
                </small>
              )}
              <div className="movimento-category-create">
                <label htmlFor="nova-categoria-nome">
                  Não encontrou? Crie uma categoria de {tipo === "REC" ? "receita" : "despesa"}
                </label>
                <div className="movimento-category-create-row">
                  <input
                    id="nova-categoria-nome"
                    type="text"
                    value={novaCategoriaNome}
                    onChange={(event) => {
                      setNovaCategoriaNome(event.target.value);
                      setError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void handleCriarCategoria();
                      }
                    }}
                    placeholder={tipo === "REC" ? "Ex.: Freelance" : "Ex.: Mercado"}
                    maxLength={80}
                    disabled={savingCategory}
                  />
                  <button
                    type="button"
                    onClick={handleCriarCategoria}
                    disabled={savingCategory || novaCategoriaNome.trim().length < 2}
                  >
                    {savingCategory ? "Criando..." : "Criar"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="movimento-form-grid">
            <div className="movimento-form-field">
              <label htmlFor="descricao">
                Descrição
                <span className="optional">Opcional</span>
              </label>

              <input
                id="descricao"
                name="descricao"
                type="text"
                value={descricao}
                onChange={(event) =>
                  setDescricao(event.target.value)
                }
                placeholder="Ex.: Compra do mês"
                maxLength={150}
              />
            </div>

            <div className="movimento-form-field">
              <label htmlFor="dataMovimento">
                Data
                <span aria-hidden="true">*</span>
              </label>

              <input
                id="dataMovimento"
                name="data_movimento"
                type="date"
                value={dataMovimento}
                onChange={(event) => {
                  setDataMovimento(event.target.value);
                  setError("");
                }}
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="movimento-form-details">
            <button
              type="button"
              className="movimento-details-toggle"
              onClick={() =>
                setMostrarObservacao(
                  (current) => !current,
                )
              }
              aria-expanded={mostrarObservacao}
              aria-controls="observacao-container"
            >
              <span aria-hidden="true">
                {mostrarObservacao ? "−" : "+"}
              </span>

              {mostrarObservacao
                ? "Remover observação"
                : "Adicionar observação"}
            </button>

            {mostrarObservacao && (
              <div
                id="observacao-container"
                className="movimento-form-field"
              >
                <label htmlFor="observacao">
                  Observação
                  <span className="optional">
                    Opcional
                  </span>
                </label>

                <textarea
                  id="observacao"
                  name="observacao"
                  value={observacao}
                  onChange={(event) =>
                    setObservacao(event.target.value)
                  }
                  placeholder="Adicione algum detalhe..."
                  rows={3}
                  maxLength={500}
                />
              </div>
            )}
          </div>
        </fieldset>

        <div className="movimento-form-actions">
          {onCancel && (
            <button
              type="button"
              className="movimento-form-cancel"
              onClick={onCancel}
              disabled={saving}
            >
              Cancelar
            </button>
          )}

          <button
            className="movimento-form-submit"
            type="submit"
            disabled={saving}
          >
            {saving ? (
                <>
                    <span
                        className="movimento-submit-spinner"
                        aria-hidden="true"
                    />
                    Salvando...
                </>
            ) : (
                modoEdicao
                    ? "Salvar alterações"
                    : "Salvar movimento"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MovimentoForm;
