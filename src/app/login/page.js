"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleLogin = async (provider) => {
    setLoadingProvider(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* LOGO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-red-600">ANIMELIX</h1>
          <p className="text-gray-400 text-sm mt-2">Masuk untuk melanjutkan</p>
        </div>

        {/* CARD */}
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            Pilih metode login
          </h2>

          <div className="flex flex-col gap-3">
            {/* GOOGLE */}
            <button
              onClick={() => handleLogin("google")}
              disabled={loadingProvider !== null}
              className="flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-medium px-4 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingProvider === "google" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FaGoogle size={18} className="text-blue-400" />
              )}
              Lanjutkan dengan Google
            </button>

            {/* GITHUB */}
            <button
              onClick={() => handleLogin("github")}
              disabled={loadingProvider !== null}
              className="flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-medium px-4 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingProvider === "github" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FaGithub size={18} className="text-gray-400" />
              )}
              Lanjutkan dengan GitHub
            </button>
          </div>

          <p className="text-gray-600 text-xs text-center mt-6 leading-relaxed">
            Dengan masuk, kamu menyetujui syarat & ketentuan yang berlaku.
          </p>
        </div>
      </div>
    </div>
  );
}
