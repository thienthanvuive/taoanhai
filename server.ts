import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", appName: "AI NTT THIẾT KẾ ẢNH PRO" });
});

// SYSTEM PROMPT FOR IMAGE ANALYSIS AND PROMPT GENERATION
const SYSTEM_PROMPT_ANALYZE = `
Bạn là AI NTT THIẾT KẾ ẢNH PRO - Chuyên gia hàng đầu thế giới về:
- Thiết kế hình ảnh AI, phân tích bố cục điện thoại & máy ảnh
- Phong cách Tiên hiệp, Cổ phong, High Fashion Editorial, Studio lighting, CGI, Unreal Engine 5, Octane Render.

NHIỆM VỤ:
Khi phân tích hình ảnh (hoặc mô tả) do người dùng cung cấp, hãy phân tích cực kỳ chi tiết mọi yếu tố và chuyển toàn bộ dữ liệu thành một Lời nhắc AI (English AI Prompt) hoàn chỉnh để tái tạo hình ảnh đạt độ chính xác gần 99%.

QUY TRÌNH XUẤT ĐẦU RA PHẢI THEO ĐÚNG MẪU ĐỊNH DẠNG SAU:

PHÂN TÍCH HÌNH
(Mô tả bằng tiếng Việt cực kỳ chi tiết theo đúng thứ tự sau):
1. Chủ thể chính: Giới tính, vóc dáng, đường cong cơ thể (đối với nhân vật nữ: tạo hình có số đo vòng một / cúp ngực ấn tượng, căng đặn, tôn vinh vóc dáng quyến rũ trong giới hạn nghệ thuật thẩm mỹ an toàn), biểu cảm khuôn mặt, tư thế, vị trí đứng/ngồi, tác động.
2. Trang phục & Vật liệu: Mô tả chi tiết kiểu dáng áo, váy/quần, giày, áo choàng, tay áo, chất liệu (lụa, ren, vải satin, da, kim loại, gấm, pha lê, v.v.), hoa văn trang trí.
3. Phụ kiện: Liệt kê đầy đủ (hoa cài tóc, vòng cổ, nhẫn, trâm cài, kiếm, quyền bối, pha lê, cánh, tai elf, vương miện, đuôi, v.v.).
4. Lý lịch (Background): Mô tả chi tiết bối cảnh (thành phố, cung điện cổ kính, studio chuyên nghiệp, rừng hoa, bờ biển, núi non, ánh sáng, sương mù, nội thất).
5. Bố cục: Quy tắc 1/3, Tỷ lệ vàng, Các đường dẫn hướng (leading lines), Không gian âm (negative space), Tiền cảnh - Trung cảnh - Hậu cảnh, Độ sâu trường ảnh.
6. Góc máy & Ống kính: Tầm mắt (eye-level), Góc thấp (low angle), Góc cao, Cận cảnh (close-up), Cảnh trung (medium shot), Toàn cảnh, Tiêu cự ống kính (85mm, 50mm, 35mm, 24mm, Macro).
7. Ánh sáng: Nguồn sáng, Hướng sáng, Độ cứng/mềm của bóng, Rim light (ánh sáng viền), Volumetric lighting (ánh sáng thể tích), God rays, Ambient, Global Illumination, HDR, Bloom.
8. Bảng màu: Màu chủ đạo, Màu phụ, Màu nhấn (accent), Highlights, Shadows, Nhiệt độ màu (ấm/lạnh), Độ tương phản & Độ bão hòa.
9. Phong cách & Chất liệu bề mặt: Photorealistic, Hyper-real, High Fashion Editorial, Tiên Hiệp, CGI, Octane Render, Unreal Engine 5, Cinema4D, v.v. Bề mặt da mịn màng tự nhiên, lụa, kim loại, pha lê, nước.
10. Hiệu ứng & Tâm trạng: Lens flare, bokeh, sương mù, hạt bụi lấp lánh, depth of field. Tâm trạng: Sang trọng, Thanh lịch, Sử thi, Mộng mơ, Kỳ diệu, Huyền bí, Hoàng gia.
11. Tỷ lệ khung hình: 16:9

---

Lời nhắc AI (tiếng Anh)
(Viết một prompt tiếng Anh dài, cực kỳ rõ ràng, logic, có cấu trúc theo thứ tự):
[Subject & Facial Features] [Hair & Body Posture] [Fashion Outfit & Detailed Materials] [Exquisite Accessories] [Environment & Detailed Background] [Cinematic Composition & Camera Angle] [Specific Lens & Focal Length] [Lighting & Color Palette] [Visual Effects & Atmosphere] [Render Engine & Surface Textures]

BẮT CỦA ĐOẠN CUỐI PROMPT (PHẦN THAY THẾ KHUÔN MẶT & KHÓA NHẬN DẠNG):
STRICTLY USE FACE FROM THE PROVIDED REFERENCE IMAGE AS THE ONLY FACE REFERENCE. STRICT FACE LOCK. STRICT IDENTITY LOCK. Preserve 100% facial identity. Keep exactly as original: face shape, eyes, eyebrows, eyelashes, nose, lips, ears, skin tone, skin texture, facial proportions, jawline, forehead, cheekbones. Do not alter identity, do not stylize face, do not embellish, do not age, do not rejuvenate, do not blend identity. Swap and apply face while strictly preserving all other analyzed elements from the reference scene.

BẮT CỦA ĐOẠN SUFFIX CHẤT LƯỢNG (MÃ SƯU TẬP CAO CẤP):
Hyper-photorealistic, 8K UHD resolution, extremely meticulous detail, HDR, global illumination, volumetric lighting, ray tracing, physically-based rendering (PBR), ultra-high texture detail, hyperrealistic skin with natural skin pores, professional color grading, cinematic composition, award-winning photography, sharp focus, depth of field, professional photography, shot on Canon EOS R5 Mark II, Canon RF 50mm f/1.2L USM lens, f/5.6, ISO100, natural color science, studio quality, masterpiece, best quality. --ar 16:9

---

CÂU HỎI TIÊU CỰC
low quality, low resolution, blurry, cropped, cloned, extra limbs, extra fingers, poor anatomy, bad hands, bad eyes, disproportioned, watermark, logo, text, noise, JPEG artifacts, oversaturated, underexposed, overexposed, cartoon skin, plastic skin, deformed face, mutated body, wrong perspective
`;

// Endpoint 1: Analyze image base64 or text description
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { imageBase64, mimeType, textPrompt, options } = req.body;
    const ai = getGeminiClient();

    let contents: any;

    if (imageBase64) {
      // Clean base64 string if it contains data prefix
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: textPrompt
              ? `Phân tích chi tiết hình ảnh này kết hợp với yêu cầu bổ sung: "${textPrompt}". Hãy xuất ra đầy đủ 3 phần (PHÂN TÍCH HÌNH, Lời nhắc AI (tiếng Anh), CÂU HỎI TIÊU CỰC) theo đúng hướng dẫn hệ thống.`
              : `Phân tích cực kỳ chi tiết hình ảnh này và xuất ra đầy đủ 3 phần (PHÂN TÍCH HÌNH, Lời nhắc AI (tiếng Anh), CÂU HỎI TIÊU CỰC) theo đúng hướng dẫn hệ thống.`,
          },
        ],
      };
    } else {
      contents = `Phân tích ý tưởng hình ảnh dựa trên mô tả sau: "${textPrompt || 'Chân dung nữ thần tiên hiệp lộng lẫy phong cách studio 8K'}". Hãy tạo ra bản phân tích chi tiết tiếng Việt và Prompt AI tiếng Anh hoàn chỉnh 16:9 theo đúng quy chuẩn AI NTT THIẾT KẾ ẢNH PRO.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT_ANALYZE,
        temperature: 0.7,
      },
    });

    const fullText = response.text || "";

    // Parse the 3 parts from output text
    let analysisVi = "";
    let promptEn = "";
    let negativePrompt = "low quality, low resolution, blurry, cropped, cloned, extra limbs, extra fingers, poor anatomy, bad hands, bad eyes, disproportioned, watermark, logo, text, noise, JPEG artifacts, oversaturated, underexposed, overexposed, cartoon skin, plastic skin, deformed face, mutated body, wrong perspective";

    if (fullText.includes("PHÂN TÍCH HÌNH")) {
      const parts = fullText.split("Lời nhắc AI (tiếng Anh)");
      analysisVi = parts[0].replace("PHÂN TÍCH HÌNH", "").trim();

      if (parts[1]) {
        const subParts = parts[1].split("CÂU HỎI TIÊU CỰC");
        promptEn = subParts[0].trim();
        if (subParts[1]) {
          negativePrompt = subParts[1].trim();
        }
      }
    } else {
      analysisVi = fullText;
      promptEn = fullText;
    }

    res.json({
      success: true,
      analysisFormattedVi: analysisVi,
      masterPromptEnglish: promptEn,
      negativePrompt: negativePrompt,
      rawOutput: fullText,
    });
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze image",
    });
  }
});

// Endpoint 2: Generate AI image preview directly from prompt
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "16:9" } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    // Clean up prompt for image generator (remove Midjourney tags if necessary or pass as text)
    const cleanedPrompt = prompt.replace(/--ar \d+:\d+/g, "").trim();

    // Map 16:9 to valid Gemini aspect ratio
    const validAspectRatio = aspectRatio === "16:9" ? "16:9" : "1:1";

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: cleanedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: validAspectRatio,
        },
      },
    });

    let imageUrl = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data returned from AI model");
    }

    res.json({
      success: true,
      imageUrl,
    });
  } catch (error: any) {
    console.error("Error generating image:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate image",
    });
  }
});

// Serve frontend with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI NTT THIẾT KẾ ẢNH PRO Server listening on http://localhost:${PORT}`);
  });
}

startServer();
