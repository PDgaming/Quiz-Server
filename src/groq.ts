import Groq from "groq-sdk";
import { Questions, QuizParams } from "./types";

export async function generateQuiz(c: any, quizParams: QuizParams) {
  const apiKey = c.env.GROQ_API_KEY;
  const groq = new Groq({ apiKey });

  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Generate a quiz with ${quizParams.number} questions on topic: ${quizParams.topic} with difficulty: ${quizParams.difficulty}.
          Always return only in json format.
          Always return in the following format: {['question', 'answer'], ['question', 'answer']}`,
      },
    ],
    model: "openai/gpt-oss-20b",
  });
  const content = response.choices[0].message.content;
  if (!content) {
    return {
      message: "There was an error generating the quiz",
    };
  }

  const cleanedContent = content.replaceAll("```", "");
  try {
    const parsedContent: Questions[] = JSON.parse(cleanedContent);
    return parsedContent;
  } catch (error) {
    return {
      message: "There was an error parsing the quiz",
    };
  }
}
