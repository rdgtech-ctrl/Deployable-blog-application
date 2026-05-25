import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import BlogCardList from './BlogCardList'
import axios from 'axios'
import { setBlog } from '@/redux/blogSlice'
import { Badge } from "@/components/ui/badge"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
const RecentBlog = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { blog } = useSelector(store => store.blog)
    useEffect(() => {
        const getAllPublishedBlogs = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/blog/get-published-blogs`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setBlog(res.data.blogs))
                }
            } catch (error) {
                console.log(error);
            }
        }
        getAllPublishedBlogs()
    }, [])
    return (
        <div className='bg-gray-100 dark:bg-gray-800 pb-10'>
            <div className='max-w-6xl mx-auto flex flex-col space-y-4 items-center'>
                <h1 className="text-4xl font-bold pt-10">Recent Blogs</h1>
                <hr className='w-24 text-center border-2 border-red-500 rounded-full' />
            </div>
            <div className='max-w-7xl mx-auto flex gap-6'>
                <div>
                    <div className='mt-10 px-4 md:px-0'>
                        {
                            blog?.slice(0, 4)?.map((blog, index) => {
                                return <BlogCardList key={index} blog={blog} />
                            })
                        }
                    </div>
                </div>
                <div className='bg-white hidden md:block dark:bg-gray-700 w-[350px] p-5 rounded-md mt-10'>
                    <h1 className='text-2xl font-semibold'>Popular Categories</h1>
                    <div className='my-5 flex flex-wrap gap-3'>
                        {
                            ["Blogging", "Web Development", "Digital Marketing", "Cooking", "Photography", "Sports", "Comics"].map((item, index) => {
                                return <Badge onClick={() => navigate(`/search?q=${item}`)} className="cursor-pointer" key={index}>{item}</Badge>
                            })
                        }
                    </div>
                    <h1 className="text-xl font-semibold">Subscribe to Newsletterr</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get the lastest posts and updates delivered straight to your inbox</p>
                    <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-5">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="flex h-10 w-full rounded-md border bg-gray-200 dark:bg-gray-800 px-3 py-2 text-sm text-gray-300"
                        />
                        <Button>Subscribe</Button>
                    </div>
                    <div className='mt-7'>
                        <h2 className='text-xl font-semibold mb-3'>Suggested Blogs</h2>
                        <ul className='space-y-3'>
                            {
                                ["10 tips to Master React",
                                    "Understanding Tailwind CSS",
                                    "Improve SEO in 2026"
                                ].map((title, idx) => {
                                    return <li key={idx} className="text-sm dark:text-gray-100 hover:underline cursor-pointer">{title}</li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecentBlog
