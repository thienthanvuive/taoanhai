import React, { useState } from 'react';
import { SavedPromptItem } from '../types';
import { Copy, Trash2, Download, ExternalLink, Calendar, Sparkles, Check, FileText } from 'lucide-react';

interface PromptHistoryProps {
  history: SavedPromptItem[];
  onSelectPrompt: (item: SavedPromptItem) => void;
  onClearHistory: () => void;
  onDeletePrompt: (id: string) => void;
}

export const PromptHistory: React.FC<PromptHistoryProps> = ({
  history,
  onSelectPrompt,
  onClearHistory,
  onDeletePrompt,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AI_NTT_PROMPTS_EXPORT_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (history.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-300">Chưa Có Lịch Sử Prompts Đã Phân Tích</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Các bản phân tích hình ảnh và prompt AI được tạo ra sẽ tự động lưu giữ tại đây để bạn dễ dàng tra cứu và tải về.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h3 className="text-sm font-bold text-slate-200">
            LỊCH SỬ DỮ LIỆU PROMPTS ĐÃ PHÂN TÍCH ({history.length})
          </h3>
          <p className="text-xs text-slate-400">Danh sách các mẫu prompt AI 16:9 đã tối ưu</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Xuất File JSON
          </button>
          <button
            onClick={onClearHistory}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/20 transition-all"
            title="Xóa lịch sử"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 shadow-xl transition-all duration-300 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectPrompt(item)}
                  className="flex items-center gap-1 text-xs text-amber-300 hover:underline font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Xem Lại Bản Phân Tích
                </button>
                <button
                  onClick={() => onDeletePrompt(item.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {item.referenceImageUrl && (
                <div className="md:col-span-3 aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={item.referenceImageUrl}
                    alt="Ref"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className={`${item.referenceImageUrl ? 'md:col-span-9' : 'md:col-span-12'} space-y-2`}>
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-amber-100/80 line-clamp-3">
                  {item.result.masterPromptEnglish}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 text-[11px]">Dung lượng prompt: {item.result.masterPromptEnglish.length} chars</span>
                  <button
                    onClick={() => handleCopyPrompt(item.id, item.result.masterPromptEnglish)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px]"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === item.id ? 'Đã Chép' : 'Sao Chép Prompt'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
