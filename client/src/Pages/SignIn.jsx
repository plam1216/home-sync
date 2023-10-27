import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../Components/OAuth'

const SignIn = () => {
  const [formData, setFormData] = useState({})
  const {loading, error } = useSelector((state) => state.user)

  // redirect
  const navigate = useNavigate()

  // used to invoke slice reducers
  const dispatch = useDispatch()

  const handleChange = (event) => {
    // spread form data, assign value to id
    setFormData({
      ...formData, [event.target.id]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    // stop page from refreshing after submit
    event.preventDefault()
    try {
      dispatch(signInStart())

      // create user in backend
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      console.log('sign in data', data)

      // if user already exists
      if (data.success === false) {
        // console.log('message', data.message)
        dispatch(signInFailure(data.message))
        return
      }
      
      // if user doesn't exist; create user and redirect to sign-in
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (err) {
      dispatch(signInFailure(err.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='email' placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover hover:opacity-90 disabled:opacity-50'>Sign In</button>
        <OAuth/>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>
            Sign up
          </span>
        </Link>
      </div>
    </div>
  )
}

export default SignIn