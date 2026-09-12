"use client"
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';

function Header() {

  const path=usePathname();

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm  ' style={{height:80}}>
        <Image src={'/deep.svg'} width={200} height={200}  alt='logo'/>
        <ul className='hidden md:flex gap-6'>
           <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
            ${path=='/dashboard'&&'text-primary font-bold'}`}>Dashboard</li>
           <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
            ${path=='/dashboard/questions'&&'text-primary font-bold'}`}>Questions</li>
           <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
            ${path=='/dashboard/how'&&'text-primary font-bold'}`}>How It Works?</li>
            <li> <UserButton/></li>
        </ul>
       
    </div>
  )
}

export default Header