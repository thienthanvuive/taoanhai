import React, { useState, useEffect } from 'react';
import { Copy, Check, Sparkles, Sliders, ShieldCheck, Download, Code2, AlertTriangle, Wand2, Terminal } from 'lucide-react';
import { ExportFormat } from '../types';

interface PromptOutputProps {
  masterPromptEnglish: string;
  negativePrompt: string;
  hasFaceReference?: boolean;
  onGenerateTestImage?: (prompt: string, aspectRatio: string) => void;
  isGeneratingImage?: boolean;
}

export const PromptOutput: React.FC<PromptOutputProps> = ({
  masterPromptEnglish,
  negativePrompt,
  hasFaceReference = false,
  onGenerateTestImage,
  isGeneratingImage = false,
}) => {
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [copiedCombined, setCopiedCombined] = useState(false);

  // Parameter Customizers
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [mjVersion, setMjVersion] = useState<string>('--v 6.1');
  const [stylize, setStylize] = useState<string>('--stylize 250');
  const [chaos, setChaos] = useState<string>('');
  const [quality, setQuality] = useState<string>('--q 2');
  const [modelPreset, setModelPreset] = useState<ExportFormat>('midjourney');
  const [customPrompt, setCustomPrompt] = useState<string>(masterPromptEnglish);

  useEffect(() => {
    setCustomPrompt(masterPromptEnglish);
  }, [masterPromptEnglish]);

  // Compute final parameter string
  const getFinalPrompt = () => {
    let text = customPrompt.trim();

    // Clean existing params if any
    text = text.replace(/--ar \d+:\d+/g, '');
    text = text.replace(/--v \d+\.\d+/g, '');
    text = text.replace(/--niji \d+/g, '');
    text = text.replace(/--stylize \d+/g, '');
    text = text.replace(/--chaos \d+/g, '');
    text = text.replace(/--q \d+/g, '');

    if (modelPreset === 'midjourney') {
      const params = [`--ar ${aspectRatio}`, mjVersion, stylize, quality, chaos].filter(Boolean).join(' ');
      return `${text} ${params}`.trim();
    } else if (modelPreset === 'flux') {
      return `[Flux.1 Prompt] Aspect Ratio: ${aspectRatio}\n${text}`;
    } else if (modelPreset === 'dalle') {
      return `[ChatGPT / DALL-E 3 Prompt - Aspect Ratio ${aspectRatio}]\n${text}\n\nNegative Constraints:\n${negativePrompt}`;
    } else {
      return `${text} Aspect Ratio: ${aspectRatio}`;
    }
  };

  const finalPrompt = getFinalPrompt();

  const handleCopyMaster = () => {
    navigator.clipboard.writeText(finalPrompt);
    setCopiedMaster(true);
    setTimeout(() => setCopiedMaster(false), 2000);
  };

  const handleCopyNegative = () => {
    navigator.clipboard.writeText(negativePrompt);
    setCopiedNegative(true);
    setTimeout(() => setCopiedNegative(false), 2000);
  };

  const handleCopyCombined = () => {
    const combined = `PROMPT AI (TIẾNG ANH - ${modelPreset.toUpperCase()}):\n${finalPrompt}\n\nCÂU HỎI TIÊU CỰC (NEGATIVE PROMPT):\n${negativePrompt}`;
    navigator.clipboard.writeText(combined);
    setCopiedCombined(true);
    setTimeout(() => setCopiedCombined(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Main Master Prompt Card */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-200">
                LỜI NHẮC AI HOÀN CHỈNH (ENGLISH MASTER AI PROMPT)
              </h3>
              <p className="text-xs text-slate-400">Đã tích hợp bối cảnh, chất liệu, góc máy, ánh sáng & khóa khuôn mặt</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyMaster}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              {copiedMaster ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã Sao Chép Prompt!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao Chép Prompt</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyCombined}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-amber-500/20 transition-all"
            >
              {copiedCombined ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5" />}
              <span>Chép Tất Cả (Full)</span>
            </button>
          </div>
        </div>

        {/* Model Target Selector & Parameters Bar */}
        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-300">Nền Tảng AI Target:</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['midjourney', 'flux', 'dalle', 'imagen', 'raw'] as ExportFormat[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setModelPreset(mode)}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${
                    modelPreset === mode
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Parameters row if Midjourney/Generic */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Tỷ Lệ Khung Hình (--ar)</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:border-amber-500 focus:outline-none"
              >
                <option value="16:9">16:9 (Chuẩn Điện Ảnh)</option>
                <option value="9:16">9:16 (Điện Thoại TikTok)</option>
                <option value="1:1">1:1 (Vuông)</option>
                <option value="4:3">4:3 (Nhiếp Ảnh)</option>
                <option value="21:9">21:9 (Ultrawide)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Phiên Bản (--v / --niji)</label>
              <select
                value={mjVersion}
                onChange={(e) => setMjVersion(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:border-amber-500 focus:outline-none"
              >
                <option value="--v 6.1">--v 6.1 (Mới Nhất)</option>
                <option value="--v 6.0">--v 6.0</option>
                <option value="--niji 6">--niji 6 (Anime/Cổ Phong)</option>
                <option value="--v 5.2">--v 5.2</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Độ Cách Điệu (--stylize)</label>
              <select
                value={stylize}
                onChange={(e) => setStylize(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:border-amber-500 focus:outline-none"
              >
                <option value="--stylize 250">250 (Tiêu chuẩn nghệ thuật)</option>
                <option value="--stylize 100">100 (Trung thực)</option>
                <option value="--stylize 750">750 (Rất nghệ thuật)</option>
                <option value="--stylize 1000">1000 (Tối đa)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Độ Bất Ngờ (--chaos)</label>
              <select
                value={chaos}
                onChange={(e) => setChaos(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:border-amber-500 focus:outline-none"
              >
                <option value="">0 (Ổn định 100%)</option>
                <option value="--chaos 10">10 (Biến thể nhẹ)</option>
                <option value="--chaos 25">25 (Sáng tạo)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Text Area Prompt Display */}
        <div className="mt-4 relative">
          <textarea
            value={finalPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={8}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-amber-100/90 leading-relaxed focus:outline-none focus:border-amber-500/60 custom-scrollbar selection:bg-amber-500/30"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg backdrop-blur-sm text-[10px] text-slate-400">
            <Terminal className="w-3 h-3 text-amber-400" />
            <span>{finalPrompt.length} ký tự</span>
          </div>
        </div>

        {/* Face Reference Lock Status Badge */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {hasFaceReference
                ? 'Đã Kích Hoạt Khóa Nhận Dạng Khuôn Mặt (100% Identity Lock từ ảnh cá nhân)'
                : 'Đã tích hợp điều khoản thay thế khuôn mặt (Sẵn sàng gắn khuôn mặt tham chiếu)'}
            </span>
          </div>

          {onGenerateTestImage && (
            <button
              onClick={() => onGenerateTestImage(finalPrompt, aspectRatio)}
              disabled={isGeneratingImage}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isGeneratingImage ? 'Đang Tạo Ảnh AI...' : 'Thử Tạo Ảnh Trực Tiếp Với AI'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Negative Prompt Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wide">
              CÂU HỎI TIÊU CỰC (NEGATIVE PROMPT - PHẦN 7)
            </h3>
          </div>

          <button
            onClick={handleCopyNegative}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold border border-rose-500/20 transition-all"
          >
            {copiedNegative ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã Chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Sao Chép Negative</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3 bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs text-rose-200/80 leading-relaxed">
          {negativePrompt}
        </div>
      </div>
    </div>
  );
};
