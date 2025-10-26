import { GoogleGenerativeAI } from "@google/generative-ai";

// Basic shapes used by callers
export interface Recipe {
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
}

export interface VegRiskResult {
  isVegetarian: boolean;
  nonVegIngredients: string[];
  analysis: string;
  confidence: number; // 0-100
  reasoning?: string;
}

// Initialize provider selection
const provider = (import.meta.env.VITE_AI_PROVIDER || 'gemini').toLowerCase();

// Lazily instantiate Gemini client to avoid errors when key is missing in dev
let genAI: GoogleGenerativeAI | null = null;
function getGeminiModel(modelOverride?: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY');
  if (!genAI) genAI = new GoogleGenerativeAI(apiKey);
  const model = modelOverride || import.meta.env.VITE_GEMINI_MODEL || import.meta.env.VITE_RECIPE_MODEL || 'gemini-2.5-flash';
  return genAI.getGenerativeModel({ model });
}

// Helper: robust JSON parsing from LLM text
function extractJson<T = unknown>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (firstError: unknown) {
    try {
      // Try to extract JSON from text (remove markdown, extra text, etc.)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found in response');
      
      let jsonStr = jsonMatch[0];
      
      // Clean up common issues
      jsonStr = jsonStr
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
        .replace(/:\s*'([^']*)'/g, ': "$1"') // Convert single quotes to double
        .replace(/\n/g, ' ') // Remove newlines
        .trim();
      
      return JSON.parse(jsonStr) as T;
    } catch (secondError: unknown) {
      console.error('JSON parsing failed:', text);
      const errorMsg = firstError instanceof Error ? firstError.message : 'Unknown parsing error';
      throw new Error(`AI returned invalid JSON. Original error: ${errorMsg}`);
    }
  }
}

export async function generateRecipe(input: {
  ingredients: string[];
  dietaryPreferences: string[];
  mealType: string;
  cookingTime: string;
  difficulty: string;
}): Promise<Recipe> {
  if (provider !== 'gemini') {
    throw new Error('Current AI provider is not Gemini. Set VITE_AI_PROVIDER=gemini');
  }
  const model = getGeminiModel(import.meta.env.VITE_RECIPE_MODEL);
  const prompt = `You are an expert vegetarian chef. Create a delicious vegetarian recipe using the following available ingredients and preferences:

AVAILABLE INGREDIENTS: ${input.ingredients.join(', ')}
DIETARY PREFERENCES: ${input.dietaryPreferences.join(', ')}
MEAL TYPE: ${input.mealType}
COOKING TIME: ${input.cookingTime}
DIFFICULTY LEVEL: ${input.difficulty}

Rules:
- Strictly vegetarian (no meat, fish, seafood)
- Make good use of the provided ingredients, but you can add pantry basics
- Clear, step-by-step instructions

Return only JSON matching this schema:
{
  "name": "string",
  "description": "string",
  "prepTime": "string",
  "cookTime": "string",
  "servings": "string",
  "difficulty": "Easy|Medium|Hard",
  "ingredients": ["string"],
  "instructions": ["string"],
  "tips": ["string"]
}`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }]}],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9
      // Removed responseMimeType to let model respond naturally
    }
  });
  const text = result.response.text();
  return extractJson<Recipe>(text);
}

export async function cuisineSearch(query: string): Promise<string> {
  if (provider !== 'gemini') {
    throw new Error('Current AI provider is not Gemini. Set VITE_AI_PROVIDER=gemini');
  }
  const model = getGeminiModel(import.meta.env.VITE_SEARCH_MODEL);
  const prompt = `You are a vegetarian cuisine expert. The user is searching for: "${query}"

Provide:
1) Relevant vegetarian dishes from different countries
2) Brief descriptions and key ingredients
3) Cultural notes or interesting facts
4) Optional cooking tips

Keep it concise, friendly, and strictly vegetarian.`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }]}],
    generationConfig: { temperature: 0.7, topP: 0.9 }
  });
  return result.response.text();
}

// Optional: AI-assisted veg risk analysis; callers can still use heuristic scanner if desired
export async function analyzeVegRisk(text: string): Promise<VegRiskResult> {
  if (provider !== 'gemini') {
    throw new Error('Current AI provider is not Gemini. Set VITE_AI_PROVIDER=gemini');
  }
  const model = getGeminiModel();
  const prompt = `Analyze the following product info to determine VEGETARIAN suitability. Extract any non-vegetarian ingredients.
Return JSON with: isVegetarian (boolean), nonVegIngredients (string[]), analysis (string), confidence (0-100), reasoning (string).

TEXT:\n${text}`;
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }]}],
    generationConfig: { 
      temperature: 0.3
      // Removed responseMimeType to let model respond naturally
    }
  });
  const raw = result.response.text();
  return extractJson<VegRiskResult>(raw);
}
