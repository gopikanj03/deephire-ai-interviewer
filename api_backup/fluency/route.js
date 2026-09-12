// File: /pages/api/fluency.js
import { spawn } from "child_process";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  let result = "";
  const process = spawn("python", ["D:/demo ai/python-backend/fluency_analysis.py"]);

  process.stdin.write(JSON.stringify({ text }));
  process.stdin.end();

  process.stdout.on("data", (data) => {
    result += data.toString();
  });

  process.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  process.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Python script failed" });
    }
    try {
      const jsonResult = JSON.parse(result);
      return res.status(200).json(jsonResult);
    } catch (e) {
      return res.status(500).json({ error: "Invalid JSON output from Python script" });
    }
  });
}