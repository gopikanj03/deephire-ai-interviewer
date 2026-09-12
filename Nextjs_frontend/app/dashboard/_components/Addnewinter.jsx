"use client";
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/gemini'
import { LoaderPinwheel } from 'lucide-react'
import { db } from '@/utils/db'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { MockInterview } from '@/utils/schema'
import { useRouter } from 'next/navigation'

function Addnewinter() {
  const [opendialog, setopendialog] = useState();
  // You might still want to collect the user's name for display, but for createdBy we use the email.
  const [name, setname] = useState();
  const [jobposition, setjobposition] = useState();
  const [jobdescription, setjobdescription] = useState();
  const [jobexperience, setjobexperience] = useState();
  const [loading, setloading] = useState(false);
  const [jsonresponse, setjsonresponse] = useState([]);
  const router = useRouter();
  
  // Get the current user from Clerk
  const { user } = useUser();

  const onSubmit = async (e) => {
    setloading(true);
    e.preventDefault();
    const inputprompt = "name:" + name +
      ",Job position:" + jobposition +
      ",Job Description:" + jobdescription +
      ",Years of experience:" + jobexperience +
      ",Based on Job position,Job Description and Years of experience given generate 7 interview question along with answers" +
      " also start first question by a greeting like 'hi' or 'hello' followed by name" +
      ",Give Question and Answer as json fields";
      
    const result = await chatSession.sendMessage(inputprompt);
    const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
    console.log(JSON.parse(MockJsonResp));
    setjsonresponse(MockJsonResp);
    if (MockJsonResp) {
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonmockresp: MockJsonResp,
        jobPosition: jobposition,
        jobDesc: jobdescription,
        jobEXP: jobexperience,
        // Save the email address from Clerk's user object:
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      }).returning({ mockId: MockInterview.mockId });
      console.log("inserted", resp);

      if (resp) {
        setopendialog(false);
        router.push('/dashboard/interview/' + resp[0]?.mockId);
      }
    } else {
      console.log("error");
    }

    setloading(false);
  };

  return (
    <div className='m-3'>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => setopendialog(true)}>
        <h2 className='font-bold text-lg text-center'>+Add</h2>
      </div>
      <Dialog open={opendialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Select the role you are applying to</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className='mt-7 my-3'>
                  <label>Full Name</label>
                  <Input required onChange={(event) => setname(event.target.value)} />
                </div>
                <div className='my-3'>
                  <label>Job/Role Selection</label>
                  <Input placeholder='Ex:Full Stack Developer' required onChange={(event) => setjobposition(event.target.value)} />
                </div>
                <div className='my-3'>
                  <label>Job Description</label>
                  <Textarea placeholder='Ex:React, Angular, NodeJs, MySql' required onChange={(event) => setjobdescription(event.target.value)} />
                </div>
                <div className='my-3'>
                  <label>Years of experience</label>
                  <Input placeholder='Ex:5' max='50' type='number' onChange={(event) => setjobexperience(event.target.value)} />
                </div>
                <div className='flex gap-5 justify-end'>
                  <Button variant='ghost' onClick={() => setopendialog(false)}>Cancel</Button>
                  <Button type='submit'>
                    {loading ? (
                      <>
                        <LoaderPinwheel className='animate-spin' /> 'Generating'
                      </>
                    ) : (
                      'Start Interview'
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Addnewinter;
