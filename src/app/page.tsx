"use client";

import { useState, useRef, useEffect } from "react";
import { useGenerate } from "@/hooks/useGenerate";
import InputSection from "@/components/InputSection";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ResultDisplay from "@/components/ResultDisplay";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const { loading, error, result, generate, reset } = useGenerate();

  const resultRef = useRef<HTMLDivElement>(null);

  // Scroll to result when it appears
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const handleGenerate = async () => {
    if (!inputText.trim() || loading) return;
    await generate(inputText.trim(), gender);
  };

  const handlePreset = (text: string) => {
    setInputText(text);
  };

  const handleReset = () => {
    reset();
    setInputText("");
    setGender(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center px-4 pt-20 sm:pt-28 pb-16">
      {/* Input phase — always visible when no result */}
      {!result && !loading && (
        <InputSection
          value={inputText}
          onChange={setInputText}
          onGenerate={handleGenerate}
          onPreset={handlePreset}
          loading={false}
          gender={gender}
          onGenderChange={setGender}
        />
      )}

      {/* Loading phase */}
      {loading && (
        <>
          <InputSection
            value={inputText}
            onChange={setInputText}
            onGenerate={handleGenerate}
            onPreset={handlePreset}
            loading={true}
            gender={gender}
            onGenderChange={setGender}
          />
          <LoadingState />
        </>
      )}

      {/* Error phase */}
      {error && !loading && (
        <>
          <InputSection
            value={inputText}
            onChange={setInputText}
            onGenerate={handleGenerate}
            onPreset={handlePreset}
            loading={false}
            gender={gender}
            onGenderChange={setGender}
          />
          <ErrorState message={error} onRetry={handleGenerate} />
        </>
      )}

      {/* Result phase */}
      {result && (
        <>
          <div className="w-full max-w-xl mx-auto mb-6 text-center">
            <button
              onClick={handleReset}
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              ← 回到首页
            </button>
          </div>

          <div ref={resultRef}>
            <ResultDisplay
              data={result}
              onReset={handleReset}
              inputText={inputText}
            />
          </div>
        </>
      )}

      {/* Footer — only on initial state */}
      {!result && !loading && !error && (
        <footer className="mt-20 text-center text-xs text-white/15">
          <p>这不是预言，这是一场思想实验。</p>
        </footer>
      )}
    </main>
  );
}
