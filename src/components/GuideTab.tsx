import React from 'react';
import { BookOpen, Sparkles, ShieldCheck, CheckCircle2, Sliders, Wand2, Layers, Cpu } from 'lucide-react';

export const GuideTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 rounded-2xl p-6 shadow-xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-lg font-bold text-amber-200">
          HƯỚNG DẪN SỬ DỤNG HỆ THỐNG PROMPT AI NTT THIẾT KẾ ẢNH PRO
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Được thiết kế chuẩn mực theo nguyên tắc phân tích điện ảnh & studio chuyên nghiệp, chuyển đổi ảnh tham chiếu thành bản tả chi tiết 100% tiếng Việt & Prompt tiếng Anh hoàn chỉnh 16:9 với tính năng Khóa Nhận Dạng Khuôn Mặt.
        </p>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">1</span>
            <span>Tải Ảnh Tham Chiếu & Ảnh Khuôn Mặt</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Chọn một bức ảnh mẫu bất kỳ (thời trang, tiên hiệp, studio, điện ảnh, bãi biển). Nếu muốn giữ khuôn mặt của bạn hoặc khách hàng, hãy tải thêm ảnh khuôn mặt vào ô <strong>Ảnh Khuôn Mặt Cá Nhân</strong>.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">2</span>
            <span>Phân Tích Bố Cục & Sinh Prompt (PHẦN 1 - 7)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hệ thống tự động chạy quy trình phân tích chi tiết: Chủ thể, vóc dáng, trang phục lụa/satin, phụ kiện, bối cảnh, quy tắc 1/3, tiêu cự 85mm/50mm, ánh sáng volumetric, God rays và tham số <strong>--ar 16:9</strong>.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">3</span>
            <span>Khóa Nhận Dạng Khuôn Mặt (Strict Face Lock)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Prompt được gắn sẵn điều khoản khóa nhận dạng khuôn mặt 100% (mắt, mũi, cằm, tông da, đường viền hàm) giúp giữ chính xác danh tính nhân vật khi render trên Midjourney, Flux, hay DALL-E.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">4</span>
            <span>Thử Tạo Ảnh AI Trực Tiếp</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bấm nút <strong>"Thử Tạo Ảnh Trực Tiếp Với AI"</strong> ngay trong ứng dụng để kiểm tra tức thì tác phẩm sinh ra, so sánh song song với ảnh gốc và tải về ảnh độ phân giải cao 16:9.
          </p>
        </div>
      </div>

      {/* Target Platforms Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>Mẹo Sử Dụng Cho Các Công Cụ Sinh Ảnh Phổ Biến</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-amber-300">Midjourney / Niji 6</h4>
            <p className="text-slate-400">
              Dán prompt đã sao chép vào lệnh <code>/imagine</code>. Thêm link ảnh tham chiếu mặt cá nhân ở đầu prompt để Midjourney dùng làm Face Swap.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-amber-300">Flux.1 / Stable Diffusion</h4>
            <p className="text-slate-400">
              Dán Master Prompt vào ô Positive Prompt và dán CÂU HỎI TIÊU CỰC vào ô Negative Prompt. Đặt Tỷ lệ 16:9 (1344x768 hoặc 1920x1080).
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-amber-300">DALL-E 3 / ChatGPT</h4>
            <p className="text-slate-400">
              Chọn tab DALL-E trong ứng dụng để lấy prompt tối ưu định dạng hội thoại, kết hợp cùng ảnh đính kèm trong chat GPT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
