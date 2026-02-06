import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import QRModal from "../components/QRModal";
import QRGrid from "../components/QRGrid";
import EmptyState from "../components/EmptyState";
import { getQRs, saveQRs } from "../utils/storage";
import * as qrService from "../utils/qrService";

const QRGenerator = () => {
    const [qrList, setQrList] = useState([]);
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();


    // Fetch QRs
    useEffect(() => {
        const fetchQRs = async () => {
            if (user) {
                try {
                    const token = localStorage.getItem("token");
                    const data = await qrService.getQRs(token);
                    setQrList(data);
                } catch (error) {
                    console.error("Failed to load QRs from backend", error);
                }
            } else {
                setQrList(getQRs());
            }
        };
        fetchQRs();
    }, [user]);

    const addQR = async (qr) => {
        if (user) {
            try {
                const token = localStorage.getItem("token");
                const newQR = await qrService.createQR({
                    content: qr.content,
                    image: qr.image,
                    logo: qr.logo
                }, token);
                setQrList(prev => [newQR, ...prev]);
            } catch (error) {
                console.error("Failed to save QR to backend", error);
            }
        } else {
            const updated = [...qrList, qr];
            setQrList(updated);
            saveQRs(updated);
        }
    };

    const deleteQR = async (id) => {
        if (user) {
            try {
                const token = localStorage.getItem("token");
                await qrService.deleteQR(id, token);
                setQrList(prev => prev.filter(q => q._id !== id));
            } catch (error) {
                console.error("Failed to delete QR from backend", error);
            }
        } else {
            const updated = qrList.filter((q) => q.id !== id);
            setQrList(updated);
            saveQRs(updated);
        }
    };

    const setTheme = (theme) => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(systemDark ? "dark" : "light");
        }
    }, []);


    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black transition-colors duration-500">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
                <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
                            <span className="text-gradient">QR Generator</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                            Create stunning QR codes instantly.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                const isDark = document.documentElement.classList.contains("dark");
                                setTheme(isDark ? "light" : "dark");
                            }}
                            className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title="Toggle Theme"
                        >
                            {document.documentElement.classList.contains("dark") ? "🌙" : "☀️"}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/20 transition"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-sm hover:shadow-md transition">
                                Login
                            </Link>
                        )}

                        <button
                            onClick={() => setOpen(true)}
                            className="px-6 py-3 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold shadow-lg shadow-zinc-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
                        >
                            <span>Create New</span>
                            <span className="group-hover:rotate-90 transition-transform duration-300">＋</span>
                        </button>
                    </div>
                </header>

                <main>
                    {qrList.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="animate-[fadeIn_0.5s_ease-out]">
                            <QRGrid list={qrList} onDelete={deleteQR} />
                        </div>

                    )}
                </main>

                {open && <QRModal onClose={() => setOpen(false)} onGenerate={addQR} />}
            </div>
        </div>
    );
};

export default QRGenerator;
