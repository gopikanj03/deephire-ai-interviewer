"use client" 
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import Interviewitemcard from './interviewitemcard';

function Interviewlist(){
const{user}=useUser();
const [Interviewlist,setInterviewList]=useState([]);

useEffect(() => {
    console.log("User:", user);
    user && GetInterviewList();
  }, [user]);
  


const GetInterviewList=async()=>{
    const result=await db.select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(MockInterview.id))
    console.log(result);
    setInterviewList(result);

}


    return (
        <div>
            <h2 className=" text-2xl font-bold text-primary">
                Previous Mock Interviews
            </h2>
            <h2 className=" text-md text-slate-500">History</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
                {Interviewlist&&Interviewlist.map((interview,index)=>(
                  <Interviewitemcard interview={interview} key={index}/>
                ))}
            </div>
        </div>
    );
};

export default Interviewlist;
