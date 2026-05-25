import React, { useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { LuSend } from 'react-icons/lu'
import { Textarea } from './ui/textarea'
import axios from 'axios'
import { setComment } from '@/redux/commentSlice.js'
import { FaRegHeart,FaHeart } from 'react-icons/fa'
import { setBlog } from '@/redux/blogSlice'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'react-hot-toast'
import { BsThreeDots } from 'react-icons/bs'
import { Edit, Trash2, Check, X } from 'lucide-react'

const CommentBox = ({ selectedBlog }) => {
    const { user } = useSelector(store => store.auth)
    const { comment } = useSelector(store => store.comment)
    const { blog } = useSelector(store => store.blog)
    const [content, setContent] = useState("")
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editedContent, setEditedContent] = useState("")
    const dispatch = useDispatch()

    const changeEventHandler = (e) => {
        setContent(e.target.value)
    }

    const likeCommentHandler = async (commentId) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/comment/${commentId}/like`, {
                withCredentials: true
            });
            if (res.data.success) {
                const updatedComment = res.data.updatedComment

                const updatedCommentList = comment.map(item =>
                    item._id === commentId ? updatedComment : item
                )
                dispatch(setComment(updatedCommentList))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.error("Error liking comment", error)
            toast.error("Something went wrong")
        }
    }

    const commentHandler = async () => {
        if (!content.trim()) {
            toast.error("Comment cannot be empty")
            return
        }
        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/comment/${selectedBlog._id}/create`,
                { content: content.trim() },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            )
            if (res.data.success) {
                const updatedCommentData = comment.length >= 1
                    ? [...comment, res.data.comment]
                    : [res.data.comment]
                dispatch(setComment(updatedCommentData))
                const updatedBlogData = blog.map(b =>
                    b._id === selectedBlog._id
                        ? { ...b, comments: updatedCommentData }
                        : b
                )
                dispatch(setBlog(updatedBlogData))
                toast.success(res.data.message)
                setContent("")
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Comment not added")
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const res = await axios.delete(
                `http://localhost:8000/api/v1/comment/${commentId}/delete`,
                { withCredentials: true }
            )
            if (res.data.success) {
                const updatedCommentData = comment.filter((item) => item._id !== commentId)
                dispatch(setComment(updatedCommentData))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Comment not deleted")
        }
    }

    const startEditing = (item) => {
        setEditingCommentId(item._id)
        setEditedContent(item.content)
    }

    const cancelEditing = () => {
        setEditingCommentId(null)
        setEditedContent("")
    }

    const saveEdit = async (commentId) => {
        if (!editedContent.trim()) {
            toast.error("Comment cannot be empty")
            return
        }
        try {
            const res = await axios.put(
                `http://localhost:8000/api/v1/comment/${commentId}/edit`,
                { content: editedContent.trim() },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
            )
            if (res.data.success) {
                const updatedCommentData = comment.map(c =>
                    c._id === commentId ? { ...c, content: editedContent.trim() } : c
                )
                dispatch(setComment(updatedCommentData))
                toast.success(res.data.message)
                cancelEditing()
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Comment not edited")
        }
    }


    useEffect(() => {
        const getAllcommentsOfBlog = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/v1/comment/${selectedBlog._id}/comment/all`,
                    { withCredentials: true }
                )
                dispatch(setComment(res.data.comments))
            } catch (error) {
                console.log(error)
            }
        }
        getAllcommentsOfBlog()
    }, [selectedBlog._id])

    return (
        <div>
            <div className='flex gap-4 mb-4 items-center'>
                <Avatar>
                    <AvatarImage src={user.photoUrl} />
                    <AvatarFallback>TS</AvatarFallback>
                </Avatar>
                <h3 className='font-semibold'>{user.firstName} {user.lastName}</h3>
            </div>
            <div className="flex gap-3">
                <Textarea
                    placeholder="Leave a comment"
                    className="bg-gray-100 dark:bg-gray-800"
                    value={content}
                    onChange={changeEventHandler}
                />
                <Button onClick={commentHandler}><LuSend /></Button>
            </div>
            {
                comment.length > 0 ? (
                    <div className='mt-7 bg-gray-100 dark:bg-gray-800 p-5 rounded-md'>
                        {
                            comment.map((item, index) => (
                                <div key={index} className='mb-4'>
                                    <div className='flex items-center justify-between'>
                                        <div className="flex gap-3 items-start w-full">
                                            <Avatar>
                                                <AvatarImage src={item?.userId?.photoUrl} />
                                                <AvatarFallback>TS</AvatarFallback>
                                            </Avatar>
                                            <div className='mb-2 space-y-1 md:w-[400px]'>
                                                <h1 className='font-semibold'>
                                                    {item?.userId?.firstName} {item?.userId?.lastName}
                                                </h1>
                                                {
                                                    editingCommentId === item?._id ? (
                                                        <>
                                                            <Textarea
                                                                value={editedContent}
                                                                onChange={(e) => setEditedContent(e.target.value)}
                                                                className="mb-2 bg-gray-200 dark:bg-gray-700"
                                                            />
                                                            <div className='flex py-1 gap-2'>
                                                                <Button onClick={() => saveEdit(item._id)}>Save</Button>
                                                                <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                                                            </div>
                                                        </>
                                                    ) : <p>{item?.content}</p>
                                                }
                                                <div className='flex gap-5 items-center'>
                                                    <div className='flex gap-2 items-center'>
                                                        <div onClick={() => likeCommentHandler(item._id)} className='flex gap-1 items-center cursor-pointer'>
                                                            {
                                                                item.likes.includes(user._id) ? <FaHeart fill='red' /> :
                                                                    <FaRegHeart />
                                                            }
                                                            <span>{item.numberOfLikes}</span>
                                                        </div>
                                                    </div>
                                                    <p className='text-sm cursor-pointer'>Reply</p>
                                                </div>
                                            </div>
                                        </div>

                                        {user._id === item?.userId?._id ?
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <BsThreeDots />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => {
                                                        setEditingCommentId(item._id);
                                                        setEditedContent(item.content)
                                                    }}><Edit /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => deleteComment(item._id)}
                                                        className="text-red-500"
                                                    >
                                                        <Trash2 className='w-4 h-4 mr-2' /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            : null
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : null
            }
        </div>
    )
}

export default CommentBox