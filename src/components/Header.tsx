import React, { useState } from 'react';
import { Camera, Sparkles, BookOpen, Layers, Zap, Info, ShieldCheck, Check } from 'lucide-react';

interface HeaderProps {
  activeTab: 'analyzer' | 'history' | 'guide';
  setActiveTab: (tab: 'analyzer' | 'history' | 'guide') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, savedCount }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <header className="bg-slate-950 border-b border-amber-500/20 sticky top-0 z-40 backdrop-blur-md bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('analyzer')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                AI NTT THIẾT KẾ ẢNH PRO
              </h1>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                PRO 16:9 8K
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Chuyên gia Phân Tích Bố Cục & Sinh Prompt AI Chân Thực 99%</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analyzer'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Phân Tích & Phối Cảnh</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Lịch Sử Prompts</span>
            {savedCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'history' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
              }`}>
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 transition-all"
            title="Quy chuẩn & Hướng dẫn"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">Quy Chuẩn</span>
          </button>
        </div>
      </div>

      {/* Info Modal / Rules standard documentation */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                <h3 className="text-lg font-bold text-amber-200">QUY CHUẨN NGUYÊN TẮC PHÂN TÍCH AI NTT PRO</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-amber-300">
                ✨ **Hệ Thống Phân Tích Độc Quyền**: Chuyển đổi mọi hình ảnh tham chiếu thành bản tả chi tiết 100% tiếng Việt (Bố cục, Ánh sáng, Trang phục, Thần thái) & Prompt tiếng Anh hoàn chỉnh 16:9.
              </div>

              <div>
                <h4 className="font-bold text-amber-400 mb-1.5 text-sm">1. Tiêu Chuẩn Phân Tích (PHẦN 1)</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>Chủ thể chính:</strong> Phân tích hình thể, đường cong, vóc dáng quyến rũ ấn tượng.</li>
                  <li><strong>Trang phục & Vật liệu:</strong> Chi tiết chất liệu lụa, ren, satin, da, kim loại, gấm, hoa văn.</li>
                  <li><strong>Lý lịch & Bố cục:</strong> Rule of thirds, Golden ratio, leading lines, negative space, depth.</li>
                  <li><strong>Góc máy & Ánh sáng:</strong> 85mm/50mm, volumetric lighting, god rays, rim light, HDR.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-amber-400 mb-1.5 text-sm">2. Khóa Nhận Dạng Khuôn Mặt (PHẦN 3 & 4)</h4>
                <p className="text-slate-400">
                  Mọi Prompt sinh ra tự động chứa mã <strong>STRICT FACE LOCK / IDENTITY LOCK</strong> cho phép bạn thay thế khuôn mặt từ ảnh cá nhân nhưng giữ nguyên 100% bối cảnh, ánh sáng, trang phục, bố cục xuất sắc từ ảnh gốc.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-amber-400 mb-1.5 text-sm">3. Thông Số Xuất Bản (PHẦN 5 & 6)</h4>
                <p className="text-slate-400">
                  Tự động tích hợp suffix Canon EOS R5 Mark II 50mm f/1.2L, 8K UHD, PBR, ray tracing và tham số <strong>--ar 16:9</strong> chuẩn điện ảnh.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs hover:brightness-110 transition-all"
              >
                Đã Hiểu & Bắt Đầu
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
