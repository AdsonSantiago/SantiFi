import { useState } from "react";

function MovimentoForm() {

    const [tipo, setTipo] = useState("DES");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [dataMovimento, setDataMovimento] = useState("");
    const [observacao, setObservacao] = useState("");

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        console.log({
            tipo,
            descricao,
            valor,
            dataMovimento,
            observacao,
        });
    }

    return (
        <form onSubmit={handleSubmit}>

            <div>
                <label htmlFor="tipo">
                    Tipo
                </label>

                <select
                    id="tipo"
                    value={tipo}
                    onChange={(event) =>
                        setTipo(event.target.value)
                    }
                >
                    <option value="REC">
                        Receita
                    </option>

                    <option value="DES">
                        Despesa
                    </option>

                    <option value="TRA">
                        Transferência
                    </option>
                </select>
            </div>


            <div>
                <label htmlFor="descricao">
                    Descrição
                </label>

                <input
                    id="descricao"
                    type="text"
                    value={descricao}
                    onChange={(event) =>
                        setDescricao(event.target.value)
                    }
                    placeholder="Ex.: Compra mercado"
                />
            </div>


            <div>
                <label htmlFor="valor">
                    Valor
                </label>

                <input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    value={valor}
                    onChange={(event) =>
                        setValor(event.target.value)
                    }
                    placeholder="0,00"
                />
            </div>


            <div>
                <label htmlFor="dataMovimento">
                    Data
                </label>

                <input
                    id="dataMovimento"
                    type="date"
                    value={dataMovimento}
                    onChange={(event) =>
                        setDataMovimento(event.target.value)
                    }
                />
            </div>


            <div>
                <label htmlFor="observacao">
                    Observação
                </label>

                <textarea
                    id="observacao"
                    value={observacao}
                    onChange={(event) =>
                        setObservacao(event.target.value)
                    }
                    placeholder="Observação opcional"
                />
            </div>


            <button type="submit">
                Salvar movimento
            </button>

        </form>
    );
}

export default MovimentoForm;