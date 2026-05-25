import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from "../assets/logo.png"
import userLogo from "../assets/user.jpg"
import { Input } from './ui/input'
import ResponsiveMenu from './ResponsiveMenu'  // ← added the 's'
import { Button } from './ui/button'
import {
    ChartColumnBig,
    LogOut,
    Search,
    User,
} from "lucide-react"
import { FaMoon, FaSun, FaRegEdit } from 'react-icons/fa';  // ✅ Added FaRegEdit
import { LiaCommentSolid } from 'react-icons/lia';           // ✅ Added LiaCommentSolid
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '@/redux/themeSlice'
import axios from 'axios'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HiMenuAlt1, HiMenuAlt3 } from "react-icons/hi"

const Navbar = () => {
    const { user } = useSelector(store => store.auth)
    const { theme } = useSelector(store => store.theme)
    const [searchTerm, setSearchTerm] = useState("")
    const [openNav, setOpenNav] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const toggleNav=() => {
        setOpenNav(!openNav)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchTerm.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
            setSearchTerm("")
        }
    }

    const logoutHandler = async (e) => {
        try {
            const res = await axios.get(`https://blogging-application-ox2h.onrender.com/user/logout`, { withCredentials: true })
            if (res.data.success) {
                navigate('/')
                dispatch(setUser(null))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    useEffect(() => {
        const root = document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
    }, [theme])

    return (
        <div className="py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
                {/* logo section */}
                <div className='flex gap-7 items-center'>
                    <Link to={'/'}>
                        <div className="flex gap-2 items-center">
                            <img src={Logo} alt="" className='w-7 h-7 md:w-10 md:h-10 dark:invert' />
                            <h1 className='font-bold text-3xl md:text-4xl'>Logo</h1>
                        </div>
                    </Link>
                    <div className='relative hidden md:block'>
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px] hidden md:block"
                        />
                        <Button onClick={handleSearch} className="absolute right-0 top-0"><Search /></Button>
                    </div>
                </div>
                {/* nav section */}
                <nav className='flex md:gap-7 gap-4 items-center'>
                    <ul className='hidden md:flex gap-7 items-center text-xl font-semibold'>
                        <Link to={'/'}><li>Home</li></Link>
                        <Link to={'/blogs'}><li>Blogs</li></Link>
                        <Link to={'/about'}><li>About</li></Link>
                    </ul>
                    <div className='flex'>
                        <Button onClick={() => dispatch(toggleTheme())}>
                            {theme === 'light' ? <FaMoon /> : <FaSun />}
                        </Button>
                        {
                            user ? (
                                <div className='ml-7 flex gap-3 items-center'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user.photoUrl || userLogo} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56 dark:bg-gray-800">
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                                                    <User />
                                                    <span>Profile</span>
                                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate('/dashboard/your-blog')}>
                                                    <ChartColumnBig />
                                                    <span>Your Blog</span>
                                                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate('/dashboard/comments')}>
                                                    <LiaCommentSolid />  {/*  Now imported */}
                                                    <span>Comments</span>
                                                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate('/dashboard/write-blog')}>
                                                    <FaRegEdit />  {/*  Now imported */}
                                                    <span>Write Blog</span>
                                                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={logoutHandler}>
                                                <LogOut />
                                                <span>Log out</span>
                                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button className="hidden md:block" onClick={logoutHandler}>LogOut</Button>
                                </div>
                            ) : (
                                <div className='ml-7 md:flex gap-2'>
                                    <Link to={"/login"}><Button>Login</Button></Link>
                                    <Link className='hidden md:block' to={"/signup"}><Button>Signup</Button></Link>
                                </div>
                            )
                        }
                    </div>
                    {
                        openNav ? <HiMenuAlt3 onClick={toggleNav} className='w-7 h-7 md:hidden' /> : <HiMenuAlt1 className='w-7 h-7 md:hidden' onClick={toggleNav} />
                    }
                </nav>
                <ResponsiveMenu openNav={openNav} setOpenNav={setOpenNav} logoutHandler={logoutHandler} />
            </div>
        </div>
    )
}

export default Navbar