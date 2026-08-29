import React, { useState } from 'react';
import { Sparkles, Download, Maximize2, RefreshCw, CheckCircle2, Eye, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface ImageGeneratorProps {
  referenceImageUrl?: string;
  generatedImageUrl?: string | null;
  isGenerating: boolean;
  onRegenerate?: () => void;
  error?: string | null;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  referenceImageUrl,
  generatedImageUrl,
  isGenerating,
  onRegenerate,
  error,
}) => {
  const [showFullZoom, setShowFullZoom] = useState(false);

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `AI_NTT_DESIGN_PRO_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isGenerating && !generatedImageUrl && !error) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
              KẾT QUẢ THỬ TẠO ẢNH AI TRỰC TIẾP (TEST RENDER 16:9)
            </h3>
            <p className="text-[11px] text-slate-400">Kiểm tra trực tiếp kết quả sinh ảnh dựa trên Prompt đã tối ưu</p>
          </div>
        </div>

        {generatedImageUrl && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFullZoom(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              title="Phóng to"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow hover:brightness-110 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Ảnh 8K</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isGenerating && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-amber-400 animate-ping opacity-25" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-200">Đang Khởi Tạo Bối Cảnh & Render Ánh Sáng 16:9...</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Áp dụng thuật toán PBR, Canon EOS R5 Mark II 50mm f/1.2L, volumetric lighting và khớp thần thái...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center justify-between">
          <span>Không thể tạo ảnh trực tiếp: {error}</span>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="px-3 py-1 bg-rose-500 text-white rounded-lg font-bold text-[11px]"
            >
              Thử Lại
            </button>
          )}
        </div>
      )}

      {/* Result Comparison Display */}
      {generatedImageUrl && !isGenerating && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reference image if available */}
          {referenceImageUrl && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                1. Ảnh Gốc Mẫu Bố Cục Tham Chiếu
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/9] relative group">
                <img
                  src={referenceImageUrl}
                  alt="Reference"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          {/* Generated AI Image */}
          <div className={`space-y-2 ${!referenceImageUrl ? 'md:col-span-2' : ''}`}>
            <span className="text-[11px] font-bold text-amber-400 block uppercase flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              2. Ảnh AI Mới Sinh Từ Prompt NTT PRO (Tỷ Lệ 16:9)
            </span>
            <div className="rounded-xl overflow-hidden border border-amber-500/40 bg-slate-950 aspect-[16/9] relative group shadow-lg shadow-amber-500/10">
              <img
                src={generatedImageUrl}
                alt="AI Generated"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                onClick={() => setShowFullZoom(true)}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowFullZoom(true)}
                  className="p-3 bg-slate-900/90 text-amber-300 rounded-full border border-amber-500/30 hover:scale-110 transition-transform"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-3 bg-amber-500 text-slate-950 rounded-full font-bold hover:scale-110 transition-transform"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {showFullZoom && generatedImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setShowFullZoom(false)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400 text-sm font-bold bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg"
            >
              ✕ Đóng
            </button>
            <img
              src={generatedImageUrl}
              alt="Full Preview"
              className="max-h-[80vh] w-auto object-contain rounded-2xl border border-amber-500/30 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 hover:brightness-110"
              >
                <Download className="w-4 h-4" /> Tải Ảnh Độ Phân Giải Cao
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
