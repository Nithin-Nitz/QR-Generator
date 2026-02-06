import React, { useState } from "react";
import QRCodeWithLogo from "qrcode-with-logos";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const QRModal = ({ onClose, onGenerate }) => {

    const [value, setValue] = useState("");
    const [logo, setLogo] = useState(null);
    const [error, setError] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const { user } = useAuth();

    const generate = async () => {
        if (!value.trim()) {
            setError("Please enter text or URL");
            return;
        }

        setIsGenerating(true);

        try {
            const qrOptions = {
                content: value,
                width: 1000,
                logo: logo ? {
                    src: logo,
                    logoSize: 0.2,
                    borderRadius: 8
                } : undefined
            };

            const qr = new QRCodeWithLogo(qrOptions);

            const canvas = await qr.getCanvas();
            const dataUrl = canvas.toDataURL("image/png");

            onGenerate({
                id: Date.now(),
                content: value,
                image: dataUrl,
                logo: logo // Save raw logo for future regenerations
            });

            onClose();
        } catch (e) {
            console.error(e);
            setError("Failed to generate QR");
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl transform transition-all animate-[fadeIn_0.3s_ease-out]">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        Create QR Code
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        Enter your link or text below to generate a high-quality QR code.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <input
                            autoFocus
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setError("");
                            }}
                            placeholder="https://example.com"
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                        />
                    </div>

                    {/* Logo Upload Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Add Logo <span className="text-xs text-zinc-400 font-normal">(Optional)</span>
                            </label>

                            {!user && (
                                <Link to="/login" className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">
                                    Login to unlock 🔒
                                </Link>
                            )}
                        </div>

                        <div className={`flex items-center gap-4 transition-all ${!user ? 'opacity-50 grayscale pointer-events-none select-none' : ''}`}>
                            <label className={`flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg cursor-pointer transition text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 ${!user ? 'cursor-not-allowed' : ''}`}>
                                <span>📤 Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={!user}
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                                setLogo(ev.target.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>

                            {logo && (
                                <div className="relative group">
                                    <img
                                        src={logo}
                                        alt="Logo preview"
                                        className="w-10 h-10 rounded-md object-cover border border-zinc-200 dark:border-zinc-700"
                                    />
                                    <button
                                        onClick={() => setLogo(null)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                        {!user && (
                            <p className="text-xs text-zinc-500 mt-1">Sign in to add custom logos to your QR codes.</p>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1 font-medium animate-pulse">
                            <span>!</span> {error}
                        </p>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={generate}
                            disabled={isGenerating}
                            className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? "Generating..." : "Generate QR"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRModal;
