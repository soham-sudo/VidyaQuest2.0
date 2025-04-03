
import { Button } from '@/components/ui/button'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';


// implement user check details and logout soon

const Navbar = () => {
    const {userid, username} = useSelector(state => state.user);
    const navigate = useNavigate();
  return (
    <>
        <div className=" flex w-screen md:px-[10rem] justify-between py-3 h-[6vh] border-b-[1px] border-gray-200 shadow-sm" >
            <img className="h-[2.8rem] hover:cursor-pointer transition-all duration-200 ease-in" onClick={() => navigate("/")} src="Vidyaquestlogo.svg" />
            
            {
                (userid !== undefined) && (
                    <div className='space-x-2 sm:block hidden'>
                        <Button className="bg-sky-500/100 text-white hover:cursor-pointer" variant="outline"  > {username} </Button>
                        <Button className="bg-sky-500/100 text-white hover:cursor-pointer" variant="outline" > Logout </Button>
                    </div>
                )
            }
            {
                (userid === undefined) && (
                    <div className='space-x-2 sm:block hidden'>
                        <Button className="bg-sky-500/100 text-white hover:cursor-pointer" variant="outline" onClick={() => navigate("/login")} > Login </Button>
                        <Button className="bg-sky-500/100 text-white hover:cursor-pointer" variant="outline" onClick={() => navigate("/signup")} > Signup </Button>
                    </div>
                )
            }
        </div>
    </>
  )
}

export default Navbar
