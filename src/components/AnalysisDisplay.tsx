import React, { useState } from 'react';
import { Camera, Sun, Palette, Sparkles, Layers, Box, Maximize2, UserCheck, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface AnalysisDisplayProps {
  analysisFormattedVi: string;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysisFormattedVi }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopyAnalysis = () => {
    navigator.clipboard.writeText(analysisFormattedVi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Process text lines to add visual styling
  const lines = analysisFormattedVi
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
              PHÂN TÍCH HÌNH ẢNH CHI TIẾT (PHẦN 1 - QUY CHUẨN NTT PRO)
            </h3>
            <p className="text-[11px] text-slate-400">Tự động trích xuất mọi chi tiết bố cục, trang phục, góc máy & ánh sáng</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã Chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Sao Chép</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Structured Content Body */}
      {isExpanded && (
        <div className="mt-4 space-y-3">
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 text-xs leading-relaxed text-slate-300 font-sans space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
            {lines.map((line, idx) => {
              const isHeading =
                line.match(/^\d+\./) ||
                line.includes('Chủ thể') ||
                line.includes('Trang phục') ||
                line.includes('Phụ kiện') ||
                line.includes('Lý lịch') ||
                line.includes('Bố cục') ||
                line.includes('Góc máy') ||
                line.includes('Ánh sáng') ||
                line.includes('Bảng màu') ||
                line.includes('Phong cách') ||
                line.includes('Tỷ lệ');

              if (isHeading) {
                return (
                  <div key={idx} className="pt-2 pb-1 border-b border-slate-800/60 font-bold text-amber-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                    <span>{line}</span>
                  </div>
                );
              }

              return (
                <p key={idx} className="pl-3 text-slate-300 border-l border-amber-500/20">
                  {line}
                </p>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400">
              ✓ Quy tắc 1/3 & Tỷ lệ vàng
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400">
              ✓ Tiêu cự 85mm/50mm Studio
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400">
              ✓ Volumetric Light & God Rays
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400">
              ✓ Tỷ Lệ Khung Hình 16:9
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
