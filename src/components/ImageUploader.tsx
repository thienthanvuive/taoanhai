import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, User, RefreshCw, Layers, CheckCircle2, Sliders, Wand2 } from 'lucide-react';
import { SHOWCASE_PRESETS } from '../data/presets';
import { PresetItem } from '../types';

interface ImageUploaderProps {
  onAnalyze: (data: {
    mainImageBase64?: string;
    mainImageMime?: string;
    faceImageBase64?: string;
    additionalPrompt?: string;
    presetItem?: PresetItem;
  }) => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalyze, isAnalyzing }) => {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [mainMime, setMainMime] = useState<string>('image/jpeg');
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [additionalText, setAdditionalText] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<PresetItem | null>(null);

  const mainInputRef = useRef<HTMLInputElement>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainMime(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = (event) => {
        setMainImage(event.target?.result as string);
        setSelectedPreset(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFaceImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setSelectedPreset(preset);
    setMainImage(preset.imageUrl);
  };

  const handleStartAnalysis = () => {
    if (!mainImage && !additionalText.trim()) {
      return;
    }

    onAnalyze({
      mainImageBase64: mainImage || undefined,
      mainImageMime: mainMime,
      faceImageBase64: faceImage || undefined,
      additionalPrompt: additionalText,
      presetItem: selectedPreset || undefined,
    });
  };

  const clearMainImage = () => {
    setMainImage(null);
    setSelectedPreset(null);
    if (mainInputRef.current) mainInputRef.current.value = '';
  };

  const clearFaceImage = () => {
    setFaceImage(null);
    if (faceInputRef.current) faceInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone & Face Lock Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Reference Image (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Ảnh Tham Chiếu Bố Cục & Phong Cách (Reference Image)</span>
              </h3>
            </div>
            {mainImage && (
              <button
                onClick={clearMainImage}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Tải ảnh khác
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Tải lên ảnh mẫu bạn muốn AI phân tích bố cục, góc máy 85mm/50mm, ánh sáng studio, trang phục & góc độ.
          </p>

          {mainImage ? (
            <div className="relative rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950 aspect-[16/9] flex items-center justify-center group">
              <img
                src={mainImage}
                alt="Reference"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
              {selectedPreset && (
                <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-amber-500/30 px-3 py-1.5 rounded-lg backdrop-blur-md">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Mẫu: {selectedPreset.title}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => mainInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-8 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all duration-300 group flex flex-col items-center justify-center min-h-[220px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                Kéo thả hoặc Nhấp để chọn Ảnh Tham Chiếu
              </p>
              <p className="text-xs text-slate-500 mt-1">Hỗ trợ JPG, PNG, WEBP (Khuyên dùng ảnh chất lượng cao 16:9)</p>
            </div>
          )}

          <input
            ref={mainInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleMainFileChange}
          />
        </div>

        {/* Secondary Face Lock Image & Additional Requirements (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Face Reference Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ảnh Khuôn Mặt Cá Nhân (Tùy Chọn)</span>
                </h4>
              </div>
              {faceImage && (
                <button
                  onClick={clearFaceImage}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Xóa
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Mã prompt sẽ tự động chèn <strong>STRICT FACE LOCK</strong> để áp khuôn mặt này vào bối cảnh.
            </p>

            {faceImage ? (
              <div className="relative rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950 h-32 flex items-center justify-center">
                <img
                  src={faceImage}
                  alt="Face Lock"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Khóa Mặt 100%
                </div>
              </div>
            ) : (
              <div
                onClick={() => faceInputRef.current?.click()}
                className="border border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-3 text-center cursor-pointer bg-slate-950/30 hover:bg-slate-950/60 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-slate-300">Tải Ảnh Khuôn Mặt Của Bạn</p>
                  <span className="text-[10px] text-slate-500">Giữ nguyên mắt, mũi, cằm, tông da</span>
                </div>
              </div>
            )}

            <input
              ref={faceInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFaceFileChange}
            />
          </div>

          {/* Additional Requirements */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <h4 className="text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Yêu Cầu Bổ Sung Hoặc Chi Tiết Thêm</span>
            </h4>
            <textarea
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)}
              placeholder="Ví dụ: Đổi màu áo sang tím dạ quang, thêm đôi cánh pha lê, thêm ánh sáng huyền ảo..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 resize-none h-20"
            />
          </div>
        </div>
      </div>

      {/* Preset Showcase Selection Gallery */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>Thư Viện Mẫu Mẫu Thiết Kế Nổi Bật (Preset Gallery)</span>
          </h3>
          <span className="text-[11px] text-slate-400">Chọn mẫu có sẵn để thử nghiệm phân tích nhanh</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SHOWCASE_PRESETS.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                  isSelected
                    ? 'border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'border-slate-800 hover:border-slate-600 hover:scale-[1.01]'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <img
                    src={preset.imageUrl}
                    alt={preset.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-2 bg-slate-950/90">
                  <p className="text-[11px] font-bold text-slate-200 truncate">{preset.title}</p>
                  <p className="text-[10px] text-amber-400/90">{preset.category}</p>
                </div>

                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 bg-amber-400 text-slate-950 rounded-full p-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleStartAnalysis}
          disabled={isAnalyzing || (!mainImage && !additionalText.trim())}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
            isAnalyzing || (!mainImage && !additionalText.trim())
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-500/25 active:scale-98'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Đang Phân Tích Bố Cục & Ánh Sáng AI PRO...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 animate-bounce" />
              <span>BẮT ĐẦU PHÂN TÍCH HÌNH & SINH PROMPT 16:9 CHUYÊN NGHIỆP</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
