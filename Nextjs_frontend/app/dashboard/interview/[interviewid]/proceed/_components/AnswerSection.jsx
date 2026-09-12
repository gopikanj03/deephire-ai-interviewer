"use client";
import useSpeechToText from "react-hook-speech-to-text";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Mic, StopCircle } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { chatSession } from "@/utils/gemini";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

function AnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, onNextQuestion }) {
  const googleapikey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [cameraOn] = useState(true); 
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const { user } = useUser();

  const {
    isRecording,
    results,
    interimResults,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: false,
    crossBrowser: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
      lang: "en-US",
    },
  });

  useEffect(() => {
    results?.map((result) =>
      setUserAnswer(prevAns => prevAns + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 8) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  useEffect(() => {
    let interval;
    if (cameraOn) {
      interval = setInterval(captureEmotion, 1000);
    }
    return () => clearInterval(interval);
  }, [cameraOn, isRecording]);

  const captureEmotion = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const response = await fetch("/api/emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      });
      const data = await response.json();
      if (data.error) {
        console.error("Emotion detection error:", data.error);
        return;
      }
      setCurrentEmotion(data.dominant_emotion);
      drawEmotionText(data.dominant_emotion);

      if (isRecording) {
        setEmotionHistory((prev) => [...prev, data.dominant_emotion]);
      }
    } catch (err) {
      console.error("Error capturing emotion:", err);
    }
  };

  const drawEmotionText = (emotion) => {
    if (!canvasRef.current || !webcamRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = webcamRef.current.video;
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(emotion, 10, 30);
  };

  const calculateEmotionScore = () => {
    if (emotionHistory.length === 0) return 0;
    const emotionCounts = emotionHistory.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});
    let mostFrequentEmotion = null;
    let maxCount = 0;
    for (const [emotion, count] of Object.entries(emotionCounts)) {
      if (count > maxCount) {
        mostFrequentEmotion = emotion;
        maxCount = count;
      }
    }
    let score = 5;
    if (mostFrequentEmotion === "happy") {
      score = 10;
    } else if (mostFrequentEmotion === "neutral") {
      score = 7;
    } else if (mostFrequentEmotion === "sad") {
      score = 6;
    }
    console.log("\nEmotion Analysis Completed");
    console.log("Most Frequent Emotion:", mostFrequentEmotion);
    console.log("Emotion Counts:", emotionCounts);
    console.log("Overall Emotional Score:", score, "/ 10");
    return score;
  };

  // Call the fluency API endpoint to analyze the user's answer
  const analyzeFluency = async (text) => {
    try {
      const response = await fetch("/api/fluency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });
      const fluencyAnalysis = await response.json();
      console.log("Fluency Analysis:", fluencyAnalysis);
      return fluencyAnalysis;
    } catch (error) {
      console.error("Error analyzing fluency:", error);
      return {};
    }
  };

  const saveUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    setLoading(true);
    const emotionScore = calculateEmotionScore();

    // Analyze the fluency of the user's answer using the API
    const fluencyAnalysis = await analyzeFluency(userAnswer);

    console.log("Current Submitted Answer:", userAnswer);
    const feedbackPrompt = `Question: ${
      mockInterviewQuestion[activeQuestionIndex]?.question
    }, User Answer: ${userAnswer}.
Emotion Score: ${emotionScore}.
Generate a rating out of 10 and include the following performance indicators chart: 'Technical Skill, Honesty/Integrity, Problem Solving'.
Also provide feedback of 3-4 lines.
Give this in valid JSON format without comments with rating, feedback, performance, and emotion_score fields.`;

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = (result.response.text())
      .replace("```json", "")
      .replace("```", "")
      .trim();
    console.log(mockJsonResp);
      
    let JsonFeedbackResp;
    try {
      JsonFeedbackResp = JSON.parse(mockJsonResp);
    } catch (error) {
      console.error("Error parsing JSON:", error, mockJsonResp);
    }

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-yyyy"),
      Emotion: emotionScore,
     
      fluency: fluencyAnalysis
    });
    if (resp) {
      alert("Answer successfully submitted");
      setUserAnswer('');
      setEmotionHistory([]);
      setResults([]);
      // Automatically move to the next question
      onNextQuestion && onNextQuestion();
    }
    setResults([]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-end shadow-lg z-10 rounded-lg relative">
      {cameraOn && (
        <>
          <Webcam
            mirrored={true}
            style={{ height: 220, width: "100%" }}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="relative border rounded-lg"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
          />
        </>
      )}
      <Button
        disabled={loading}
        onClick={saveUserAnswer}
        className="mt-4 px-6 py-2 bg-red-700 text-white rounded-md shadow-md hover:bg-yellow-400 transition cursor-pointer flex items-center gap-2"
      >
        {isRecording ? (
          <>
            <StopCircle /> <span>Stop Recording</span>
          </>
        ) : (
          <>
            <Mic /> <span>Record</span>
          </>
        )}
      </Button>
    </div>
  );
}

export default AnswerSection;
