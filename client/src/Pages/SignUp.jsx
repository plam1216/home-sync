import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // redirect
  const navigate = useNavigate()

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
      setLoading(true)

      // create user in backend
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      console.log(data)

      // if user already exists
      if (data.success === false) {
        setLoading(false)
        setError(data.message)
        return
      }

      // if user doesn't exist; create user and redirect to sign-in
      setLoading(false)
      setError(null)
      navigate('/sign-in')
    } catch (err) {
      setLoading(false)
      setError(err.message)
    }
  }

  // console.log(formData)

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>SignUp</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='text' placeholder='Username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
        <input type='email' placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover hover:opacity-90 disabled:opacity-50'>Sign Up</button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Already have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>
            Sign in
          </span>
        </Link>
      </div>
    </div>
  )
}

export default SignUp