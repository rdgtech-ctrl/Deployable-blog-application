import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import JoditEditor from 'jodit-react';
import { useRef } from 'react'
import { Loader2 } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'                           // ✅ Fix 1: added missing import
import { setLoading } from '@/redux/authSlice'      // ✅ Fix 2: added missing import
import { setBlog } from '@/redux/blogSlice'

const UpdateBlog = () => {
    const editor = useRef(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const params = useParams()
    const id = params.blogId
    const { blog, loading } = useSelector(store => store.blog)
    const [publish, setPublish] = useState(false)

    // ✅ Fix 3: Guard check - wait until blog loads
    if (!blog) return <p>Loading...</p>

    const selectBlog = blog.find((b) => b._id === id)

    // ✅ Fix 4: Guard check - if blog not found
    if (!selectBlog) return <p>Blog not found!</p>

    const [content, setContent] = useState(selectBlog?.description || "")
    const [blogData, setBlogData] = useState({
        title: selectBlog?.title || "",
        subtitle: selectBlog?.subtitle || "",
        description: selectBlog?.description || "",
        category: selectBlog?.category || ""
    })
    const [previewThumbnail, setPreviewThumbnail] = useState(selectBlog?.thumbnail || "")

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // ✅ Fix 5: Fixed variable name (value_ → value)
    const selectCategory = (value) => {
        setBlogData({ ...blogData, category: value })
    }

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setBlogData({ ...blogData, thumbnail: file })
            const fileReader = new FileReader()
            fileReader.onload = () => setPreviewThumbnail(fileReader.result)
            fileReader.readAsDataURL(file)
        }
    }

    const updateBlogHandler = async () => {
        const formData = new FormData()
        formData.append("title", blogData.title)
        formData.append("subtitle", blogData.subtitle)
        formData.append("description", content)
        formData.append("category", blogData.category)
        formData.append("file", blogData.thumbnail)
        try {
            dispatch(setLoading(true))
            const res = await axios.put(`https://blogging-application-ox2h.onrender.com/api/v1/blog/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })
            if (res.data.success) {
                // ✅ Update global blog state after successful update
                const updatedBlogs = blog.map((b) => b._id === id ? res.data.blog : b)
                dispatch(setBlog(updatedBlogs))
                toast.success(res.data.message)
                navigate(-1)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        } finally {
            dispatch(setLoading(false))
        }
    }

    const togglePublishUnpublish = async () => {
        try {
            const res = await axios.patch(`https://blogging-application-ox2h.onrender.com/api/v1/blog/${id}`, {
                // params: {
                //     action
                // },
                withCredentials: true
            })
            if (res.data.success) {
                setPublish(!publish)
                toast.success(res.data.message)
                navigate('/dashboard/your-blog')
            } else {
                toast.error("failed to update")
            }
        } catch (error) {

        }
    }

    const deleteBlog = async () => {
        try {
            const res = await axios.delete(`https://blogging-application-ox2h.onrender.com/api/v1/blog/delete/${id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id)
                dispatch(setBlog(updatedBlogData))
                toast.success(res.data.message)
                navigate('/dashboard/your-blog')
            }
        } catch (error) {
            toast.error("Something went error")
        }
    }

    return (
        <div className="md:ml-[320px] pt-20 px-3 pb-10">
            <div className="max-w-6xl mx-auto mt-8">
                <Card className="w-full bg-white dark:bg-gray-800 p-5 -space-y-3">
                    <h1 className='text-4xl font-bold'>Basic Blog Information</h1>
                    <p>Make changes to your blogs here. Click publish when you are done</p>
                    <div className='space-x-2'>
                        <Button onClick={() => togglePublishUnpublish(selectBlog.isPublished ? "false" : "true")}>
                            {
                                selectBlog?.isPublished ? "UnPublish" : "Publish"
                            }
                        </Button>
                        <Button onClick={deleteBlog} variant='destructive'>Remove Blog</Button>
                    </div>
                    <div className='pt-10'>
                        <Label className="mb-2">Title</Label>
                        <Input
                            type="text"
                            placeholder="Enter a title"
                            name="title"
                            className="dark:border-gray-300"
                            value={blogData.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Subtitle</Label>
                        <Input
                            type="text"
                            placeholder="Enter a subtitle"
                            name="subtitle"
                            className="dark:border-gray-300"
                            value={blogData.subtitle}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Description</Label>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            className='jodit_toolbar'
                            onChange={newContent => setContent(newContent)}
                        />
                    </div>
                    <div>
                        <Label>Category</Label>
                        {/* ✅ Fix 6: Connected onValueChange to selectCategory */}
                        <Select onValueChange={selectCategory} className="dark:border-gray-300">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel className="mb-1">Category</SelectLabel>
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
                    <div>
                        <Label className="mb-1">Thumbnail</Label>
                        <Input
                            type="file"
                            id="file"
                            accept="image/*"
                            className="w-fit dark:border-gray-300"
                            onChange={selectThumbnail}
                        // when user picks a file -> selectThumbnail fires
                        />

                        {previewThumbnail && (
                            // only show the image if a thumbnail exists
                            // at the start previewThumbnail is empty -> image is hidden
                            //After user picks a file -> previewThumbnail gets a URL -> image appers
                            <img
                                src={previewThumbnail}
                                className="w-64 my-2"
                                alt="Blog Thumbnail"
                            />
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button variant='outline' onClick={() => navigate(-1)}>Back</Button>
                        <Button onClick={updateBlogHandler}>
                            {
                                loading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />please wait</> : "Save"
                            }
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default UpdateBlog