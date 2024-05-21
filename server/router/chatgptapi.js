import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/setHashTag", (req, res) => {
  const hashtages = req.body.hashtages;
  const userInfo = req.body.userInfo;
  let testPrompt = "recommend me one song";

  openai
    .createCompletion({
      model: "gpt-3.5-turbo-0125",
      prompt: testPrompt,
      response_format: { artist: "song" },
      temperature: 0,
      max_tokens: 7,
    })
    .then((res) => {
      const { choices } = res.data;
      const [title, singer] = choices[0].text.split("by");
      console.log(res.data);
      //TODO - 노래들 spotify 플리에 추가하기
      //추가하기 전에 검색하고 젤 상단에 있는 노래 추가
      // app.get("/search? q=remaster%2520track%3ADoxy%2520artist%3AMiles%2520Davis", (req, res) => {})
    })
    .catch((error) => {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ error: "Failed to generate text from OpenAI API" });
    });
});

export default router;
