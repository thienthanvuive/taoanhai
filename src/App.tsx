/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { PromptOutput } from './components/PromptOutput';
import { ImageGenerator } from './components/ImageGenerator';
import { PromptHistory } from './components/PromptHistory';
import { GuideTab } from './components/GuideTab';
import { FullPromptResult, SavedPromptItem, PresetItem } from './types';
import { AlertCircle, CheckCircle2, Sparkles, Layers, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'history' | 'guide'>('analyzer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [currentResult, setCurrentResult] = useState<FullPromptResult | null>(null);
  const [currentRefImage, setCurrentRefImage] = useState<string | undefined>(undefined);
  const [currentFaceImage, setCurrentFaceImage] = useState<string | undefined>(undefined);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedPromptItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_ntt_prompt_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (item: SavedPromptItem) => {
    const updated = [item, ...history.filter((h) => h.id !== item.id)].slice(0, 50);
    setHistory(updated);
    try {
      localStorage.setItem('ai_ntt_prompt_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Main Handle Analyze Action
  const handleAnalyze = async (data: {
    mainImageBase64?: string;
    mainImageMime?: string;
    faceImageBase64?: string;
    additionalPrompt?: string;
    presetItem?: PresetItem;
  }) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setGeneratedImageUrl(null);
    setCurrentRefImage(data.mainImageBase64 || data.presetItem?.imageUrl);
    setCurrentFaceImage(data.faceImageBase64);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: data.mainImageBase64,
          mimeType: data.mainImageMime,
          textPrompt: data.additionalPrompt,
        }),
      });

      const resData = await response.json();

      if (!resData.success) {
        throw new Error(resData.error || 'Phân tích hình ảnh thất bại');
      }

      const result: FullPromptResult = {
        analysisFormattedVi: resData.analysisFormattedVi,
        masterPromptEnglish: resData.masterPromptEnglish,
        negativePrompt: resData.negativePrompt,
      };

      setCurrentResult(result);

      // Create history entry
      const newItem: SavedPromptItem = {
        id: `prompt_${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        title: data.presetItem?.title || data.additionalPrompt?.slice(0, 30) || 'Phân Tích Hình Mới',
        referenceImageUrl: data.mainImageBase64 || data.presetItem?.imageUrl,
        faceImageUrl: data.faceImageBase64,
        result: result,
      };

      saveToHistory(newItem);
      showToast('Phân tích bố cục & sinh Prompt AI 16:9 hoàn tất!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Đã xảy ra lỗi trong quá trình phân tích.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Direct Test AI Image Generation
  const handleGenerateTestImage = async (prompt: string, aspectRatio: string) => {
    setIsGeneratingImage(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          aspectRatio,
        }),
      });

      const resData = await response.json();

      if (!resData.success) {
        throw new Error(resData.error || 'Tạo ảnh thất bại');
      }

      setGeneratedImageUrl(resData.imageUrl);
      showToast('Đã khởi tạo ảnh AI thành công!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Lỗi tạo ảnh: ${err.message || 'Không thể tạo ảnh'}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Select item from history
  const handleSelectHistoryItem = (item: SavedPromptItem) => {
    setCurrentResult(item.result);
    setCurrentRefImage(item.referenceImageUrl);
    setCurrentFaceImage(item.faceImageUrl);
    setGeneratedImageUrl(item.generatedImageUrl || null);
    setActiveTab('analyzer');
    showToast('Đã tải lại bản phân tích!');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ai_ntt_prompt_history');
    showToast('Đã xóa toàn bộ lịch sử!');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('ai_ntt_prompt_history', JSON.stringify(updated));
    showToast('Đã xóa mẫu khỏi lịch sử!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={history.length}
      />

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <div className="flex-1">
              <span className="font-bold">Có Lỗi Xảy Ra: </span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* ANALYZER TAB */}
        {activeTab === 'analyzer' && (
          <div className="space-y-8">
            {/* Step 1: Image Uploader & Presets */}
            <ImageUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

            {/* Step 2: Output Display (If result available) */}
            {currentResult && (
              <div className="space-y-8 animate-fade-in pt-4 border-t border-slate-800">
                {/* Vietnamese Breakdown (PHẦN 1) */}
                <AnalysisDisplay analysisFormattedVi={currentResult.analysisFormattedVi} />

                {/* Master AI Prompt (PHẦN 2, 3, 5, 6, 7) */}
                <PromptOutput
                  masterPromptEnglish={currentResult.masterPromptEnglish}
                  negativePrompt={currentResult.negativePrompt}
                  hasFaceReference={!!currentFaceImage}
                  onGenerateTestImage={handleGenerateTestImage}
                  isGeneratingImage={isGeneratingImage}
                />

                {/* Direct AI Image Test Generator View */}
                <ImageGenerator
                  referenceImageUrl={currentRefImage}
                  generatedImageUrl={generatedImageUrl}
                  isGenerating={isGeneratingImage}
                  onRegenerate={() =>
                    handleGenerateTestImage(currentResult.masterPromptEnglish, '16:9')
                  }
                  error={errorMessage}
                />
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <PromptHistory
            history={history}
            onSelectPrompt={handleSelectHistoryItem}
            onClearHistory={handleClearHistory}
            onDeletePrompt={handleDeleteHistoryItem}
          />
        )}

        {/* GUIDE TAB */}
        {activeTab === 'guide' && <GuideTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 font-medium text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI NTT THIẾT KẾ ẢNH PRO — Chuyên Gia Phân Tích Bố Cục & Sinh Prompt AI 16:9</span>
          </p>
          <p className="text-slate-600">
            Tối ưu hóa cho Midjourney, Flux.1, DALL-E 3 & Gemini Imagen 3
          </p>
        </div>
      </footer>
    </div>
  );
}
