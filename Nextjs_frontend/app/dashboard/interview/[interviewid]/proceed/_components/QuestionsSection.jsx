import React, { useState, useEffect } from 'react';
import { LightbulbIcon } from 'lucide-react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex,onSpeechStateChange }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const texttospeech = (text) => {
    if (!text) return;
  
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
  
      const speech = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
  
      const maleVoice = voices.find((voice) =>
        voice.name.toLowerCase().includes('male') || voice.gender === 'male'
      );
  
      if (maleVoice) {
        speech.voice = maleVoice;
      }
  
      speech.onstart = () => {
        setIsSpeaking(true);
        onSpeechStateChange?.(true); // ✅ Notify parent
      };
  
      speech.onend = () => {
        setIsSpeaking(false);
        onSpeechStateChange?.(false); 
      };
  
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };
  

  const handleStartClick = () => {
    if (mockInterviewQuestion && mockInterviewQuestion[activeQuestionIndex]) {
      texttospeech(mockInterviewQuestion[activeQuestionIndex]?.question);
    }
  };
  useEffect(() => {
    if (mockInterviewQuestion && mockInterviewQuestion[activeQuestionIndex]) {
      texttospeech(mockInterviewQuestion[activeQuestionIndex]?.question);
    }
  }, [activeQuestionIndex]);
  
  return (
    mockInterviewQuestion && (
      <div
        className="p-5 border text-white py-2 rounded-lg shadow-lg z-10"
        style={{
          width: '150%',
          height: '70%',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'bg-secondary',
        }}
      >
        <div className="mt-0 my-0 flex">
          <button
            className="cursor-pointer border flex justify-center items-center text-center p-2 rounded-lg text-sm text-blue-950 bg-gray-400"
            onClick={handleStartClick}
            disabled={isSpeaking} // Disable button while speaking
          >
            {isSpeaking ? 'Speaking...' : 'START'}
          </button>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-black">
            {mockInterviewQuestion.map((_, index) => (
              <h2
                key={index}
                className={`bg-secondary rounded-lg text-xs text-center cursor-pointer ${
                  activeQuestionIndex === index && 'text-yellow-500 bg-red-700'
                }`}
              >
                Question #{index + 1}
              </h2>
            ))}
          </div>
          <h2 className="my-5 text-sm">{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
          <div
            className="border rounded-lg p-2 bg-yellow-50"
            style={{ height: '80px' }}
          >
            <h2 className="flex gap-1 items-center text-yellow-400">
              <LightbulbIcon />
              <strong>Note</strong>
            </h2>
            <h2 className="text-xs my-1 text-yellow-600">
              Navigate through each question by clicking on the question number. Click on the
              "START" button to hear the question again.
            </h2>
          </div>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
