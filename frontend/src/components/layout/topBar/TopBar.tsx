import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getCurrentUser,
    logout,
} from "../../../services/authService";

import type {
    CurrentUser,
} from "../../../services/authService";

import "./topBar.css";


function TopBar() {

    const navigate = useNavigate();

    const [user, setUser] =
        useState<CurrentUser | null>(null);


    useEffect(() => {

        async function carregarUsuario() {

            try {

                const data = await getCurrentUser();

                setUser(data);

            } catch (error) {

                console.error(
                    "Erro ao carregar usuário:",
                    error
                );

            }

        }

        carregarUsuario();

    }, []);


    function handleLogout() {

        logout();

        navigate("/login");

    }


    return (
        <header className="top-bar">

            <div className="top-bar-search">

                <input
                    type="text"
                    placeholder="Buscar..."
                />

            </div>


            <div className="top-bar-period">

                <select defaultValue="month">

                    <option value="month">
                        Este mês
                    </option>

                    <option value="previous">
                        Mês anterior
                    </option>

                </select>

            </div>


            <div className="top-bar-user">

                <span>
                    {user
                        ? `${user.nome} ${user.sobrenome}`
                        : "Carregando..."
                    }
                </span>

                <button
                    type="button"
                    onClick={handleLogout}
                >
                    Sair
                </button>

            </div>

        </header>
    );
}

export default TopBar;