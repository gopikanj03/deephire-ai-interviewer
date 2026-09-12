"use client"
import { UserButton } from "@clerk/nextjs";
import React from "react";
import Addnewinter from "./_components/Addnewinter";
import Interviewlist from "./_components/interviewlist";
function Dashboard() {
  return (
  <div className='p-10'>

    <h2 className='font-bold text-2xl text-primary'>Dashboard</h2>
    <h2 className='text-gray-500'>Start Your Interview</h2> 
     <div className="grid grid-cols-1 md:grid-cols-3 my-5">
      <Addnewinter/>
     </div>
     <Interviewlist/>
 </div>
  )
}


export default Dashboard;   