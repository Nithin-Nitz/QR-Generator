import React, { useState } from "react";
import QRCodeWithLogo from "qrcode-with-logos";

const QRCard = ({ data, onDelete }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadConfig, setDownloadConfig] = useState({
        format: "png",
        quality: "high"
    });

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const width = downloadConfig.quality === "high" ? 2000 : 500;
            const qrOptions = {
                content: data.content,
                width: width,
                logo: data.logo ? {
                    src: data.logo,
                    logoSize: 0.2,
                    borderRadius: 8
                } : undefined
            };

            const qr = new QRCodeWithLogo(qrOptions);
            const canvas = await qr.getCanvas();

            let dataUrl;
            let filename = `qr-${Date.now()}`;

            if (downloadConfig.format === "svg") {
                // Placeholder: Fallback to PNG for now as reliable vector generation from canvas is not key-ready without extra heavy libs.
                // We will deliver a high-quality PNG labeled as such for now to prevent broken files.
                dataUrl = canvas.toDataURL("image/png");
                filename += ".png";
            } else {
                const type = downloadConfig.format === "jpeg" ? "image/jpeg" : "image/png";
                dataUrl = canvas.toDataURL(type, 1.0);
                filename += `.${downloadConfig.format}`;
            }

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setShowDownloadModal(false);
        } catch (e) {
            console.error("Download failed", e);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div className="glass-card group relative p-5 rounded-3xl overflow-hidden border border-white/20 dark:border-white/5">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-10 transition duration-500 blur-xl"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-white p-3 rounded-xl shadow-inner mb-4">
                        <img
                            src={data.image}
                            alt="QR Code"
                            className="w-40 h-40 object-contain"
                        />
                    </div>

                    <p className="text-zinc-600 dark:text-zinc-300 font-medium text-center truncate w-full mb-6 font-['Outfit']">
                        {data.content?.startsWith('http') ? (
                            <a
                                href={data.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-indigo-500 transition-colors"
                            >
                                {data.content}
                            </a>
                        ) : (
                            data.content
                        )}
                    </p>

                    <div className="flex gap-2 w-full">
                        <button
                            onClick={() => setShowDownloadModal(true)}
                            className="flex-1 py-2 text-center text-sm font-semibold rounded-lg bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-zinc-700 transition"
                        >
                            Download
                        </button>
                        <button
                            onClick={() => onDelete(data.id)}
                            className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition text-sm font-semibold"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* Download Modal */}
            {showDownloadModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDownloadModal(false)}></div>
                    <div className="relative bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-[fadeIn_0.2s_ease-out]">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Download Options</h3>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Format</label>
                                <div className="flex gap-2">
                                    {['png', 'jpeg', 'svg'].map(fmt => (
                                        <button
                                            key={fmt}
                                            onClick={() => setDownloadConfig(c => ({ ...c, format: fmt }))}
                                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border ${downloadConfig.format === fmt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                                        >
                                            {fmt.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Quality</label>
                                <div className="flex gap-2">
                                    {['low', 'high'].map(q => (
                                        <button
                                            key={q}
                                            onClick={() => setDownloadConfig(c => ({ ...c, quality: q }))}
                                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border ${downloadConfig.quality === q ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                                        >
                                            {q.charAt(0).toUpperCase() + q.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition"
                        >
                            {isDownloading ? "Processing..." : "Download File"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default QRCard;