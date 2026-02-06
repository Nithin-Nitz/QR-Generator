import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as authService from "../utils/authService";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);
        try {
            // Wait for backend implementation, for now standard mock response or try call
            await authService.forgotPassword(email);
            setMessage("Check your email for instructions to reset your password.");
        } catch (err) {
            setError(err.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <div className="glass-card w-full max-w-md p-8 rounded-3xl relative z-10 animate-[fadeIn_0.5s_ease-out]">
                <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">
                    Reset Password
                </h2>
                <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8 text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-sm font-medium text-center">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-lg mb-6 text-sm font-medium text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-zinc-800 dark:text-gray-100"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm text-indigo-500 hover:text-indigo-400 font-semibold">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
