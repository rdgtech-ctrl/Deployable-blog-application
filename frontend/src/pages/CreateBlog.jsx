import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Card } from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { setBlog } from '@/redux/blogSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { setLoading } from '@/redux/authSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CreateBlog = () => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { blog, loading } = useSelector(store => store.blog) // reading blog from global box (blogSlice)

  const getSelectedCategory = (value) => {
    setCategory(value)
  }

  const createBlogHandler = async () => {
    try {
      dispatch(setLoading(true)) // from redux . slice
      const res = await axios.post(`https://blogging-application-ox2h.onrender.com/blog/`, { title, category }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true // sends cookies(token) for authentication
      })
      if (res.data.success) {
        if (!blog) {
          dispatch(setBlog([res.data.blog]))
        navigate(`/dashboard/write-blog/${res.data.blog._id}`)
          toast.success(res.data.message)
        }
        dispatch(setBlog([...blog, res.data.blog]))
        //setBlog is the function from blogSlice that updates the global blog box
        // this keeps all existing blogs and adds the newly created blog to the global state
        navigate(`/dashboard/write-blog/${res.data.blog._id}`)
        //takes you to the editor page with the new blog's id
        //example:/dashboard/write-blog/64f1a2b3c4d5e6f7
        toast.success(res.data.message)
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20'>
      <Card className='md:p-10 p-4 dark:bg-gray-800 -space-y-5'>
        <h1 className="text-2xl font-bold">Let's create blog</h1>
        <p>Share your thoughts, ideas, and stories with the world.
          Start by giving your blog a title and category.</p>
        <div className='mt-5'>
          <div className="mb-5">
            <Label className="mb-2" >Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Your blog name" className="bg-white dark:bg-gray-700 mt-10" />
          </div>
          <div className="mt-4 mb-5">
            <Label className="mb-2">Category</Label>
            <Select onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-[180px">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel >Category</SelectLabel>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Food & Recipes">Food & Recipes</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-2'>
            <Button disabled={loading} onClick={createBlogHandler}>
              {
                loading ? <><Loader2 className="mr-1 h-4 w-4 animate-spin" />Please wait</> : "Create"
              }
            </Button>
          </div>
        </div>
      </Card>

    </div>
  )
}

export default CreateBlog
