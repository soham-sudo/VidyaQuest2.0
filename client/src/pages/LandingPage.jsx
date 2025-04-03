import React from 'react'
import Navbar from '../components/Navbar'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer'

const LandingPage = () => {
    
    const navigate = useNavigate();
   
  return (
    <div className=' bg-sky-300/15 '>
        <div className="h-screen w-screen flex justify-center items-center ">
            <div className="flex flex-col space-y-0.5 pr-10 border-r-[0.01rem] justify-center">
                <h1 className="lg:text-5xl text-4xl font-extrabold tracking-tight  border-b-1 " > Welcome to VidyaQuest</h1>
                <p className=" w-100 leading-7 text-xl [&:not(:first-child)]:mt-6 ">
                <b className='text-blue-500 text-2xl'>VidyaQuest</b> is a crowdsourced quiz platform for competitive exam preparation. Practice with user-generated quizzes, track your progress, and learn from the community. Whether for government, engineering, or medical exams, VidyaQuest makes learning interactive and effective. Join now and quiz your way to success!
                </p>
                <Button className="mt-7 bg-sky-500/100 text-white hover:cursor-pointer " variant="outline" onClick={() => navigate("/dashboard")}>
                    Get Started
                </Button>
            </div>
            <div className=' p-8'>
                <img src="home-illustration.svg" alt="Home Illustration" className='size-[40rem]' />
            </div>
        </div>
        
    </div>
  )
}

export default LandingPage
