"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import AnswerSection from "./_components/AnswerSection";
import { Leva } from "leva";
import Avatarsetup from "./_components/Avatarsetup";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewid));
    const jsonMockResp = JSON.parse(result[0].jsonmockresp);
    console.log(jsonMockResp);
    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]);
  };

  const handleSpeechStateChange = (speaking) => {
    setIsSpeaking(speaking);
  };

  // Callback to move to the next question
  const moveToNextQuestion = () => {
    setActiveQuestionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Avatarsetup isSpeaking={isSpeaking} />
        <div className="absolute inset-0 z-10"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-5 relative z-20">
        <div className="fixed bottom-5 left-5 w-full md:w-auto md:max-w-sm">
          <QuestionsSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            onSpeechStateChange={handleSpeechStateChange}
          />
        </div>
        <div className="fixed bottom-5 right-5 w-full md:w-auto md:max-w-sm">
          <Leva />
          <AnswerSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
            onNextQuestion={moveToNextQuestion}
          />
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex justify-center gap-6 z-30">
        {activeQuestionIndex > 0 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
            Previous
          </Button>
        )}
        {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
            Next
          </Button>
        )}
        {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
          <Link href={"/dashboard/interview/" + interviewData?.mockId + "/feedback"}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
