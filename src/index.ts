import { Hono } from "hono";
import { generateQuiz } from "./groq";
import dotenv from "dotenv";
import { serveStatic } from "hono/cloudflare-workers";

const app = new Hono();
dotenv.config();

app.get("/", serveStatic({ path: "./index.html" }));

app.get("/quiz", serveStatic({ path: "./quiz.html" }));

app.post("/api/quiz", async (c) => {
  const body = await c.req.json();
  if (!body) {
    return c.json({ message: "Body is empty" });
  }

  const number = body.number;
  const topic = body.topic;
  const difficulty = body.difficulty;

  if (!number || !topic || !difficulty) {
    return c.json({ message: "Missing parameters" });
  }

  const questions = await generateQuiz(c, {
    number,
    topic,
    difficulty,
  });
  // console.log("Generated Questions:", questions);
  return c.json(questions);
});

export default app;
