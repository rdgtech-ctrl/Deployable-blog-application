import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { setBlog } from '@/redux/blogSlice'
import BlogCard from '@/components/BlogCard'

const SearchList = () => {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const query = params.get('q')
    const { blog } = useSelector(store => store.blog)
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get('https://blogging-application-ox2h.onrender.com/blog/all')
                if (res.data.success) {
                    dispatch(setBlog(res.data.blogs))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchBlogs()
        window.scrollTo(0, 0)
    }, [])

    const filteredBlogs = blog.filter(
        (blog) =>
            blog.title.toLowerCase().includes(query.toLowerCase()) ||
            blog.subtitle.toLowerCase().includes(query.toLowerCase()) ||
            blog.category.toLowerCase() === query.toLowerCase()
    )
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    console.log("all blogs:", blog)
    console.log("query:", query)
    console.log("filtered:", filteredBlogs)
    return (
        <div className='pt-32'>
            <div className="max-w-6xl mx-auto">
                <h2 className="mb-5">Search result for : "{query}"</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 my-10">
                    {
                        filteredBlogs.map((blog, index) => (
                            <BlogCard key={index} blog={blog} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchList
