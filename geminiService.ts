
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, Language } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const quizSchema = {
    type: Type.OBJECT,
    properties: {
      quiz: {
        type: Type.ARRAY,
        description: "An array of 5 quiz questions.",
        items: {
          type: Type.OBJECT,
          properties: {
            question: { 
                type: Type.STRING, 
                description: "The quiz question." 
            },
            options: {
              type: Type.ARRAY,
              description: "An array of 4 possible answers (one correct, three incorrect).",
              items: { type: Type.STRING }
            },
            correctAnswer: { 
                type: Type.STRING, 
                description: "The exact string of the correct answer, which must be one of the provided options." 
            }
          },
          required: ["question", "options", "correctAnswer"]
        }
      }
    },
    required: ["quiz"]
};


export const generateQuiz = async (lessonContent: string, language: Language): Promise<QuizQuestion[]> => {
    const model = 'gemini-2.5-flash';

    const prompt = `You are an expert in creating fun and educational content for 4th-grade students. Based on the following text from a 'Bangladesh and Global Studies' lesson, generate exactly 5 multiple-choice questions. 
    
    Instructions:
    1.  The questions must be simple, clear, and directly related to the provided text.
    2.  Each question must have exactly 4 options.
    3.  One option must be the correct answer.
    4.  The language for the questions and options must be ${language}.
    5.  Ensure the 'correctAnswer' field in the JSON response exactly matches one of the strings in the 'options' array.
    
    Lesson Text:
    ---
    ${lessonContent}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && result.quiz && Array.isArray(result.quiz)) {
            // Validate that each question has the required fields
            return result.quiz.filter(q => q.question && q.options && q.correctAnswer && q.options.length === 4);
        }
        return [];

    } catch (error) {
        console.error("Error generating quiz from Gemini API:", error);
        throw new Error("Failed to generate the quiz. The AI might be busy, or the lesson content might be too short. Please try again.");
    }
};
