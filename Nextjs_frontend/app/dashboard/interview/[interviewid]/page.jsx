"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { LightbulbIcon, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam';

function Interview({params}) {
  const[interviewData,setinterviewData]=useState();
  const[webCamEnabled,setWebCamEnabled]=useState(false);

  useEffect(()=>{
    console.log(params.interviewid) 
    GetInterviewDetails();
  },[])
  //used to get interview details by mockid/interviewid

  const GetInterviewDetails=async()=>{
    const result=await db.select().from(MockInterview)
    .where(eq(MockInterview.mockId,params.interviewid))
   
    setinterviewData(result[0]);
   
 }
 

  
  return (
   <div className='m-5 mx-7'>
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <div className='flex flex-col gap-10 my-12 '>
      <div className='flex flex-col  p-5 rounded-lg border gap-5 bg-yellow-50'>
      <h2 className='text-lg '><strong>User:</strong>{interviewData?.createdBy}</h2> 
      <h2 className='text-lg '><strong>Job Role:</strong>{interviewData?.jobPosition}</h2>
      <h2 className='text-lg '><strong>Job Description:</strong>{interviewData?.jobDesc}</h2>
      <h2 className='text-lg '><strong>Experience:</strong>{interviewData?.jobEXP} years</h2>
      </div>
      <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-50'>
        <h2 className='flex gap-2 items-center text-yellow-500'><LightbulbIcon/><strong>Note</strong></h2>
        <h2 className='mt-3 text-red-800'>Enable web cam and microphone to start your mock interview also remember the avatar present in front of you isn't a real human.</h2>
      </div>
      </div>

      <div className='flex flex-col my-5 mx-6'>
      {webCamEnabled? <Webcam className='my-7'
      onUserMedia={()=>setWebCamEnabled(true)}
      onUserMediaError={()=>setWebCamEnabled(false)}
      mirrored={true}
      style={{position: 'absolute',
        height: '400px',
       width:'600px'}}/>
      :
      <>
      <WebcamIcon className='h-48 w-full p-20 my-7 bg-secondary rounded-lg border'/>
      <Button onClick={()=>setWebCamEnabled(true)}>Enable Cam and Microphone</Button>
      </>
      }
     </div>
    </div>
      
      <div className='flex justify-center  items-center'>
       <Link href={'/dashboard/interview/'+params.interviewid+'/proceed'}>
       <Button>Proceed</Button>
       </Link>
       
      </div>

 </div>
    
    

    
  )
}

export default Interview