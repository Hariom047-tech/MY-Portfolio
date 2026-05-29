import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import { SettingsProvider } from "@/lib/SettingsContext";
import { LandingPage } from "@/pages/LandingPage";
import { AdminPage } from "@/pages/AdminPage";

function App() {
    return (
        <div
            data-testid="app-root"
            className="App"
            style={{
                backgroundColor: "#0C0C0C",
                overflowX: "clip",
                fontFamily: "'Kanit', sans-serif",
                color: "#D7E2EA",
            }}
        >
            <SettingsProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                </BrowserRouter>
            </SettingsProvider>
        </div>
    );
}

export default App;
