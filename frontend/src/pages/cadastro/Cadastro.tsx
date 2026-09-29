import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    createUsuario,
} from "../../services/usuarioService";

import "./cadastro.css";

function Cadastro() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [timezone, setTimezone] = useState(
        "America/Sao_Paulo"
    );

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setErro("");
        setSucesso("");

        if (senha !== confirmarSenha) {
            setErro("As senhas não conferem.");
            return;
        }

        try {
            setCarregando(true);

            await createUsuario({
                nome,
                sobrenome,
                email,
                senha,
                confirmar_senha: confirmarSenha,
                timezone,
            });

            setSucesso(
                "Usuário criado com sucesso! Você já pode fazer login."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error(
                "Erro ao criar usuário:",
                error
            );

            setErro(
                "Não foi possível criar o usuário."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="cadastro-page">
            <section className="cadastro-card">

                <div className="cadastro-header">
                    <span className="cadastro-eyebrow">
                        SANTIFI
                    </span>

                    <h1>
                        Criar sua conta
                    </h1>

                    <p>
                        Cadastre-se para começar a
                        organizar sua vida financeira.
                    </p>
                </div>

                <form
                    className="cadastro-form"
                    onSubmit={handleSubmit}
                >
                    <div className="cadastro-row">

                        <div className="cadastro-field">
                            <label htmlFor="nome">
                                Nome
                            </label>

                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(event) =>
                                    setNome(
                                        event.target.value
                                    )
                                }
                                placeholder="Seu nome"
                                required
                            />
                        </div>

                        <div className="cadastro-field">
                            <label htmlFor="sobrenome">
                                Sobrenome
                            </label>

                            <input
                                id="sobrenome"
                                type="text"
                                value={sobrenome}
                                onChange={(event) =>
                                    setSobrenome(
                                        event.target.value
                                    )
                                }
                                placeholder="Seu sobrenome"
                                required
                            />
                        </div>

                    </div>

                    <div className="cadastro-field">
                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="seu@email.com"
                            required
                        />
                    </div>

                    <div className="cadastro-row">

                        <div className="cadastro-field">
                            <label htmlFor="senha">
                                Senha
                            </label>

                            <input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={(event) =>
                                    setSenha(
                                        event.target.value
                                    )
                                }
                                placeholder="Mínimo 8 caracteres"
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="cadastro-field">
                            <label htmlFor="confirmar-senha">
                                Confirmar senha
                            </label>

                            <input
                                id="confirmar-senha"
                                type="password"
                                value={confirmarSenha}
                                onChange={(event) =>
                                    setConfirmarSenha(
                                        event.target.value
                                    )
                                }
                                placeholder="Repita sua senha"
                                minLength={8}
                                required
                            />
                        </div>

                    </div>

                    <div className="cadastro-field">
                        <label htmlFor="timezone">
                            Fuso horário
                        </label>

                        <select
                            id="timezone"
                            value={timezone}
                            onChange={(event) =>
                                setTimezone(
                                    event.target.value
                                )
                            }
                        >
                            <option value="America/Sao_Paulo">
                                São Paulo
                            </option>

                            <option value="America/Manaus">
                                Manaus
                            </option>

                            <option value="America/Belem">
                                Belém
                            </option>

                            <option value="America/Fortaleza">
                                Fortaleza
                            </option>

                            <option value="America/Recife">
                                Recife
                            </option>
                        </select>
                    </div>

                    {erro && (
                        <div
                            className="cadastro-message cadastro-error"
                            role="alert"
                        >
                            {erro}
                        </div>
                    )}

                    {sucesso && (
                        <div
                            className="cadastro-message cadastro-success"
                            role="status"
                        >
                            {sucesso}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="cadastro-submit"
                        disabled={carregando}
                    >
                        {carregando
                            ? "Criando conta..."
                            : "Criar conta"}
                    </button>
                </form>

                <div className="cadastro-footer">
                    <span>
                        Já possui uma conta?
                    </span>

                    <Link to="/login">
                        Entrar
                    </Link>
                </div>

            </section>
        </main>
    );
}

export default Cadastro;