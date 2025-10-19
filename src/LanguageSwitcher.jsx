import React from "react";
import { useI18n } from "./i18n.jsx";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const btn = "px-2 py-1 rounded-lg border text-sm";
  const active = "bg-emerald-600 text-white border-emerald-600";
  const inactive = "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50";

  return (
    <div className="flex gap-1">
      {["de","en","ru"].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`${btn} ${lang === l ? active : inactive}`}
          aria-label={`language ${l}`}
          title={l.toUpperCase()}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
