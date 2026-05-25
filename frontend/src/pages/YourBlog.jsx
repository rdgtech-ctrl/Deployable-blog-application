import React, { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDispatch, useSelector } from 'react-redux'
import { Edit, Trash2 } from 'lucide-react'
import axios from 'axios'
import { setBlog } from '@/redux/blogSlice'
import { BsThreeDotsVertical } from 'react-icons/bs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom'

const YourBlog = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { blog } = useSelector(store => store.blog)

  useEffect(() => {
    const getOwnBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/blog/get-own-blogs`, { withCredentials: true })
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs))
        }
      } catch (error) {
        console.log(error)
      }
    }
    getOwnBlog()
  }, [])

  const deleteBlog = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/blog/delete/${id}`, { withCredentials: true })
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id)
        dispatch(setBlog(updatedBlogData))
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const formatDate = (index) => {
    const date = new Date(blog[index].createdAt)
    return date.toLocaleDateString("en-GB")
  }

  return (
    <div className='pb-10 pt-20 md:ml-[320px] min-h-screen'>
      <div className='max-w-6xl mx-auto mt-8 px-4 md:px-0'>
        <Card className="w-full p-3 md:p-5 dark:bg-gray-800">
          {/* ✅ overflow-x-auto on the wrapper so table scrolls on mobile */}
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of your recent blogs.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Title</TableHead>
                  {/* ✅ hide Category and Date on small screens */}
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blog && blog.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex gap-3 items-center">
                      {/* ✅ smaller image on tablet, hidden on mobile */}
                      <img
                        src={item.thumbnail}
                        className="w-12 h-12 md:w-20 md:h-14 rounded-md object-cover hidden sm:block flex-shrink-0"
                        alt=""
                      />
                      <div className="flex flex-col">
                        <h1
                          onClick={() => navigate(`/blogs/${item._id}`)}
                          className="hover:underline cursor-pointer truncate max-w-[120px] sm:max-w-[200px] md:max-w-full font-medium"
                        >
                          {item.title}
                        </h1>
                        {/* ✅ show category and date inline on mobile */}
                        <span className="text-xs text-gray-500 sm:hidden">{item.category} · {formatDate(index)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{item.category}</TableCell>
                    <TableCell className="hidden sm:table-cell">{formatDate(index)}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <BsThreeDotsVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/write-blog/${item._id}`)}>
                            <Edit className="w-4 h-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onClick={() => deleteBlog(item._id)}>
                            <Trash2 className="w-4 h-4 mr-2 text-red-500" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default YourBlog