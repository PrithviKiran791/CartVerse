import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { auth, googleProvider, signInWithPopup } from "../../config/firebase";
import { useAuthStore } from "../../store/useAuthStore";

export function Social() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await useAuthStore.getState().loginWithFirebase({
          email: res.user.email || '',
          name: res.user.displayName || 'Google Gamer',
          uid: res.user.uid,
        });
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        alert(err?.message || "Google Single Sign-On failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 mt-6 pt-6 border-t border-neutral-800">
      <div className="relative flex items-center justify-center mb-1">
        <span className="text-[11px] font-sans text-neutral-400 bg-[#121216] px-3 uppercase tracking-wider font-semibold">
          Or continue with
        </span>
      </div>
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-sm font-bold font-sans tracking-wide text-neutral-200 hover:text-white transition-all cursor-pointer shadow-sm group disabled:opacity-50"
      >
        <Icon icon="devicon:google" className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
        <span>{loading ? "Connecting..." : "Sign in with Google"}</span>
      </button>
      <button
        type="button"
        onClick={() => alert("Apple Single Sign-On is initialized for CartVerse.")}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-sm font-bold font-sans tracking-wide text-neutral-200 hover:text-white transition-all cursor-pointer shadow-sm group"
      >
        <Icon icon="ion:logo-apple" className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform text-neutral-200" />
        <span>Sign in with Apple</span>
      </button>
    </div>
  );
}

export default Social;
