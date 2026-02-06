import React from "react";

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 opacity-70">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 text-4xl animate-pulse">
            📷
        </div>
        <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">No QR Codes Yet</h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xs text-center">
            Create your first QR code by clicking the "Add QR" button above.
        </p>
    </div>
);

export default EmptyState;
