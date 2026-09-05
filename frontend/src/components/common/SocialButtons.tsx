import React from "react";
import { Icon } from "@iconify/react";

export function Social() {
  return (
    <div className="flex w-full flex-col gap-3 mt-6 pt-6 border-t border-neutral-800">
      <div className="relative flex items-center justify-center mb-1">
        <span className="text-[11px] font-mono text-neutral-400 bg-[#121216] px-3 uppercase tracking-wider font-semibold">
          Or continue with
        </span>
      </div>
      <button
        type="button"
        onClick={() => alert("Google Single Sign-On is initialized for CartVerse.")}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-sm font-bold font-rajdhani tracking-wide text-neutral-200 hover:text-white transition-all cursor-pointer shadow-sm group"
      >
        <Icon icon="devicon:google" className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
        <span>Sign in with Google</span>
      </button>
      <button
        type="button"
        onClick={() => alert("Apple Single Sign-On is initialized for CartVerse.")}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-sm font-bold font-rajdhani tracking-wide text-neutral-200 hover:text-white transition-all cursor-pointer shadow-sm group"
      >
        <Icon icon="ion:logo-apple" className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform text-neutral-200" />
        <span>Sign in with Apple</span>
      </button>
    </div>
  );
}

export default Social;
