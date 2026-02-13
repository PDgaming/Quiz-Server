import { Hono } from "hono";
import { generateQuiz } from "./groq";
import { Questions } from "./types";

const app = new Hono();

app.get("/", async (c) => {
  return c.html(`<h1>Hi There! This is a simple quiz server.</h1>
    <p>Use the endoing /quiz with the following parameters to generate a quiz.</p>
      /quiz (POST)
      number
      topic
      difficulty
  `);
});

app.post("/quiz", async (c) => {
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
