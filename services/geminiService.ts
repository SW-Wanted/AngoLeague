
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getSmartMatchmakingAdvice = async (userProfile: any, localTeams: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise este perfil de jogador: ${JSON.stringify(userProfile)}. 
      E estas equipas disponíveis: ${JSON.stringify(localTeams)}.
      Dê 3 recomendações curtas de equipas ou ações para ele começar a jogar, em Português de Angola.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não conseguimos carregar as recomendações agora, mas explore o feed local!";
  }
};

export const generateLocalFeedPost = async (locality: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere uma notícia fictícia e motivadora sobre o futebol de rua em ${locality}, Angola. 
      Foque na união do bairro e novos talentos. Máximo 150 caracteres.`,
    });
    return response.text;
  } catch (error) {
    return `O futebol de rua em ${locality} está a ferver! Organize o seu jogo hoje.`;
  }
};
