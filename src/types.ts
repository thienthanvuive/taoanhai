export interface ImageAnalysisData {
  subject: {
    mainSubject: string;
    bustSize: string; // Kích thước vòng một
    gender: string;
    curvature: string; // Độ cong
    expression: string; // Biểu cảm
    standingPosition: string; // Vị trí đứng
    actionImpact: string; // Tác động / hành động
  };
  outfitAndMaterials: {
    top: string;
    skirtOrPants: string;
    shoes: string;
    sleevesOrCloak: string;
    primaryMaterial: string; // Lụa, ren, satin, da, kim loại, v.v.
    decorations: string;
  };
  accessories: string[]; // List: vòng cổ, trâm, cánh, đôi tai elf, v.v.
  background: {
    environmentType: string; // Thành phố, cung điện, studio, núi, v.v.
    elements: string; // Hoa, cây, nội thất, sương mù, v.v.
    lightingAndAtmosphere: string;
  };
  composition: {
    ruleOfThirds: string;
    goldenRatio: string;
    leadingLines: string;
    negativeSpace: string;
    foregroundMiddleBackground: string;
    depthAndPerspective: string;
  };
  cameraAndLens: {
    angle: string; // Eye-level, low angle, high angle, v.v.
    shotType: string; // Close-up, medium shot, wide shot, portrait, v.v.
    focalLength: string; // 85mm, 50mm, 35mm, 24mm, macro, telephoto, v.v.
  };
  lighting: {
    sourcesAndDirection: string;
    hardnessAndShadows: string;
    specialEffects: string; // Rim light, God rays, volumetric, bloom, global illumination
  };
  colorPalette: {
    primaryAndSecondary: string;
    accentsAndHighlights: string;
    contrastAndTemperature: string;
  };
  styleAndMaterials: {
    stylePreset: string; // Photorealistic, Tiên Hiệp, High Fashion, Octane, UE5, v.v.
    surfaceMaterials: string[]; // Skin, silk, gold, crystal, water, v.v.
  };
  effectsAndMood: {
    effects: string[]; // Grain, lens flare, bokeh, fog, depth of field, v.v.
    mood: string; // Luxury, epic, dreamy, magical, mysterious, v.v.
  };
  aspectRatio: string; // "16:9"
}

export interface FullPromptResult {
  analysisFormattedVi: string; // Structured analysis text in Vietnamese (PHẦN 1)
  masterPromptEnglish: string; // Complete structured AI prompt in English (PHẦN 2 + PHẦN 3 + PHẦN 5 + PHẦN 6)
  negativePrompt: string;      // CÂU HỎI TIÊU CỰC (PHẦN 7)
  parsedAnalysis?: ImageAnalysisData;
}

export interface PresetItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  tags: string[];
}

export interface SavedPromptItem {
  id: string;
  timestamp: string;
  title: string;
  referenceImageUrl?: string;
  faceImageUrl?: string;
  result: FullPromptResult;
  generatedImageUrl?: string;
}

export type ExportFormat = 'midjourney' | 'flux' | 'dalle' | 'imagen' | 'raw';
