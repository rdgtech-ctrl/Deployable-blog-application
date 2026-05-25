import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Comments = () => {
  const navigate = useNavigate()
  const [allComments, setAllComments] = useState([])
  const getTotalComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/comment/my-blogs/comments`, { withCredentials: true })
      if (res.data.success) {
        setAllComments(res.data.comments)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTotalComments()
  }, [])
  //[] runs once only
  // if you put a variable , it would re-run every time that value changes
  return (
    <div className='pb-10 pt-20 md:ml-[320px] h-screen'>
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className="w-full p-5 space-y-2 dark:bg-gray-800">
          <Table>
            <TableCaption>A list of your comments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Blog Title</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allComments.slice(0, 3).map((comment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{comment.postId.title}</TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.userId.firstName}</TableCell>
                  <TableCell className="text-right flex gap-3 items-center justify-center">
                    <Eye className='cursor-pointer' onClick={() => navigate(`/blogs/${comment.postId._id}`)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

export default Comments
