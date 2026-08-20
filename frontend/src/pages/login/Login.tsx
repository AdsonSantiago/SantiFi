import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setError("");

        try {
            const response = await api.post("/auth/login/", {
                email,
                password,
            });

            const { access, refresh } = response.data;

            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            console.log("Login realizado com sucesso!");

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            setError("E-mail ou senha inválidos.");
        }
    };

    return (
        <div>
            <h1>Financeiro</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">
                        E-mail
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Digite seu e-mail"
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Senha
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Digite sua senha"
                    />
                </div>

                {error && (
                    <p>{error}</p>
                )}

                <button type="submit">
                    Entrar
                </button>
            </form>
        </div>
    );
}

export default Login;