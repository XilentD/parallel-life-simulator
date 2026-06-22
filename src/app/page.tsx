"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useGenerate } from "@/hooks/useGenerate";
import InputSection from "@/components/InputSection";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ResultDisplay from "@/components/ResultDisplay";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const { loading, error, result, generate, reset } = useGenerate();

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim() || loading) return;
    await generate(inputText.trim(), gender);
  }, [inputText, loading, gender, generate]);

  const handlePreset = useCallback((text: string) => {
    setInputText(text);
  }, []);

  const handleReset = useCallback(() => {
    reset();
    setInputText("");
    setGender(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reset]);

  // SSR shell
  if (!mounted) {
    return (
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            平行人生模拟器
          </h1>
          <p className="text-lg text-white/50">
            如果当初做出不同的选择，现在的你会在哪里？
          </p>
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mt-6" />
        </div>
      </main>
    );
  }

  const isInitial = !result && !loading && !error;

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center px-4 pt-20 sm:pt-28 pb-16">
      {/* Render InputSection once — only pass loading state, avoid remounting */}
      {!result && (
        <InputSection
          value={inputText}
          onChange={setInputText}
          onGenerate={handleGenerate}
          onPreset={handlePreset}
          loading={loading}
          gender={gender}
          onGenderChange={setGender}
        />
      )}

      {loading && <LoadingState />}

      {error && !loading && <ErrorState message={error} onRetry={handleGenerate} />}

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

          <div ref={resultRef} aria-live="polite">
            <ResultDisplay
              data={result}
              onReset={handleReset}
              inputText={inputText}
            />
          </div>
        </>
      )}

      {isInitial && (
        <footer className="mt-20 text-center text-xs text-white/15">
          <p>这不是预言，这是一场思想实验。</p>
        </footer>
      )}
    </main>
  );
}
