import { Outlet } from "react-router-dom";

import Sidebar from "./sidebar/Sidebar";
import TopBar from "./topBar/topBar";

import "./mainLayout.css";

function MainLayout() {
    return (
        <div className="main-layout">

            <Sidebar />

            <div className="main-content">

                <TopBar />

                <main className="page-content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}

export default MainLayout;