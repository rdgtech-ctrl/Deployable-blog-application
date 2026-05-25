import React, { useState } from 'react'
import auth from "../assets/auth.jpg"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { EyeOff, Eye } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { setLoading, setUser } from '@/redux/authSlice'  
import { Loader2 } from 'lucide-react'                    
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const {loading} = useSelector(store=>store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(user);

    try {
      dispatch(setLoading(true))
      const res = await axios.post(`https://blogging-application-ox2h.onrender.com/api/v1/user/register`,user,{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      })
      if(res.data.success){
        navigate('/login')
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }finally{
      dispatch(setLoading(false))
    }
  }
  return (
    <div className='flex h-screen md:pt-14 md:h-[760px]'>
      <div className='hidden md:block'>
        <img src={auth} alt="" className='h-[700px]' />
      </div>
      <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
        <Card className='w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600'>
          <CardHeader>
            <CardTitle>
              <h1 className="text-center text-xl font-semibold">Create an account</h1>
            </CardTitle>
            <p className='mt-2 text-sm font-serif text-center dark:text-gray-300'>
              Enter your details below to create an Account
            </p>
          </CardHeader>
          <CardContent>
            <form className='space-y-4' onSubmit={handleSubmit}>

              {/* First Name and Last Name side by side */}
              <div className='flex gap-3'>
                <div className='flex-1'>
                  <Label>First Name</Label>
                  <Input
                    type='text'
                    placeholder='First Name'
                    name='firstName'
                    className="dark:border-gray-600 dark:bg-gray-900"
                    value={user.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className='flex-1'>
                  <Label>Last Name</Label>
                  <Input
                    type='text'
                    placeholder='Last Name'
                    name='lastName'
                    className="dark:border-gray-600 dark:bg-gray-900"
                    value={user.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email on its own row */}
              <div>
                <Label>Email</Label>
                <Input
                  type='email'
                  placeholder='johnmartson@example.com'
                  name='email'
                  className="dark:border-gray-600 dark:bg-gray-900"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password on its own row */}
              <div className='relative'>
                <Label>Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder='Create a Password'
                  name='password'
                  className="dark:border-gray-600 dark:bg-gray-900"
                  value={user.password}
                  onChange={handleChange}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type='button'
                  className='absolute right-3 top-6 text-gray-500'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button type="submit" className="w-full">
                {
                  loading?(
                    <>
                    <Loader2 className='mr-2 w-4 h-4 animate-spin'/>
                    Please wait
                    </>
                  ):(
                    "Sign up"
                  )
                }
              </Button>

              <p className='text-center text-gray-600 dark:text-gray-300'>
                Already have an account?{" "}
                <Link to={"/login"}>
                  <span className='underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100'>
                    Sign in
                  </span>
                </Link>
              </p>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Signup