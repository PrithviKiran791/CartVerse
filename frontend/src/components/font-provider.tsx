import { createContext, useContext, useEffect, useState } from "react";

export type Font = "Inter" | "Roboto" | "Arial" | "Times New Roman" | "Open Sans" | "JetBrains Mono";

type FontProviderProps = {
  children: React.ReactNode;
  defaultFont?: Font;
  storageKey?: string;
};

type FontProviderState = {
  font: Font;
  setFont: (font: Font) => void;
};

const initialState: FontProviderState = {
  font: "Inter",
  setFont: () => null,
};

const FontProviderContext = createContext<FontProviderState>(initialState);

const fontCSSMap: Record<Font, string> = {
  Inter: "'Inter', system-ui, sans-serif",
  Roboto: "'Roboto', sans-serif",
  "Open Sans": "'Open Sans', sans-serif",
  Arial: "Arial, Helvetica, sans-serif",
  "Times New Roman": "'Times New Roman', Times, serif",
  "JetBrains Mono": "'JetBrains Mono', monospace",
};

export function FontProvider({
  children,
  defaultFont = "Inter",
  storageKey = "app-font",
  ...props
}: FontProviderProps) {
  const [font, setFont] = useState<Font>(
    () => (localStorage.getItem(storageKey) as Font) || defaultFont
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const fontValue = fontCSSMap[font] || fontCSSMap.Inter;
    root.style.setProperty("--app-font-family", fontValue);
    root.style.fontFamily = fontValue;
    document.body.style.fontFamily = fontValue;
  }, [font]);

  const value = {
    font,
    setFont: (newFont: Font) => {
      localStorage.setItem(storageKey, newFont);
      setFont(newFont);
    },
  };

  return (
    <FontProviderContext.Provider {...props} value={value}>
      {children}
    </FontProviderContext.Provider>
  );
}

export const useFont = () => {
  const context = useContext(FontProviderContext);
  if (context === undefined)
    throw new Error("useFont must be used within a FontProvider");
  return context;
};
