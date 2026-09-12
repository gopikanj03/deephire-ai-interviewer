"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
  
function Feedback({ params }) {
     
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    console.log("Params:", params);
    GetFeedback();
  }, []);
  

  const GetFeedback=async()=>{
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewid))  
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
  }

  const router = useRouter();

  return (
    
    <div className='p-20'>
      <h2 className='text-3xl font-bold text-green-500'>Congratulations</h2>
      <h2 className='font-bold text-2xl'>Interview Feedback</h2>
      <h2 className='text-primary text-lg my-3'>Overall Rating:<strong>_/10</strong></h2>
      <h2 className='text-sm text-gray-500'>Below are the questions and corresponding feedback</h2>
      {feedbackList && feedbackList.map((item,index) => (
        
        <Collapsible key={index} className='mt-7'>
          <CollapsibleTrigger className='p-2 flex justify-between bg-secondary rounded-lg my-2 text-left gap-9 w-full'>
            {item.question} <ChevronsUpDown className='h-5 w-5' />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='flex flex-col gap-3 border rounded-lg'>
              <h2 className='text-red-700 bg-secondary border rounded-lg p-2 '><strong>Rating:</strong>{item.rating}</h2>
              <h2 className='text-blue-900 p-2  border bg-blue-50 rounded-lg'><strong>Emotion Score:</strong>{item.Emotion}</h2>
           <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-950'><strong>Your Answer:</strong>{item.userAns}</h2>
           <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Feedback:</strong>{item.feedback}</h2>
           <h2 className='p-2 border rounded-lg bg-indigo-50 text-sm text-indigo-700'><strong>Fluency Check:</strong>{item.fluency}</h2>
       </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      <Button className="mt-7" onClick={() => router.replace('/dashboard')}>Home</Button>
    </div>
  );
}

export default Feedback;
