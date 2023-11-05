import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice'
import { Link } from 'react-router-dom'

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const fileRef = useRef(null)

  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingsError] = useState(false)
  const [userListings, setuserListings] = useState([])

  const dispatch = useDispatch()

  // console.log(file)
  // console.log(filePerc)
  console.log('formdata', formData)

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)

    // see percentage of upload
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100)
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // spread formData, only update avatar
          setFormData({ ...formData, avatar: downloadURL })
        })
      }
    )
  }

  const handleChange = (event) => {
    // spread form data, assign value to id
    setFormData({ ...formData, [event.target.id]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      dispatch(updateUserStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      console.log('update User data', data)

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)

    } catch (err) {
      dispatch(updateUserFailure(err.message))
    }
  }

  const handleDeleteUser = async (event) => {
    event.preventDefault()

    try {
      dispatch(deleteUserStart())

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }

      dispatch(deleteUserSuccess(data))
    } catch (err) {
      dispatch(deleteUserFailure(err.message))
    }
  }

  const handleSignOut = async () => {
    dispatch(signOutUserStart())
    try {
      const res = await fetch('/api/auth/signout')
      const data = await res.json()

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return
      }

      dispatch(signOutUserSuccess(data))
      return
    } catch (err) {
      dispatch(deleteUserFailure(err.message))
    }
  }

  const handleShowListings = async () => {
    setShowListingsError(false)
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()

      if (data.success === false) {
        setShowListingsError(true)
        return
      }

      setuserListings(data)
    } catch (err) {
      setShowListingsError(true)
    }

  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      {/* Update Profile Form */}

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='file' ref={fileRef} onChange={(e) => setFile(e.target.files[0])} hidden accept='image/*' />
        <img
          src={formData.avatar || currentUser.avatar}
          alt='profile-pic'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          onClick={() => fileRef.current.click()}
        />

        <p className='text-small self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        <input type='text' placeholder='Username' id='username' defaultValue={currentUser.username} onChange={handleChange} className='border p-3 rounded-lg' />
        <input type='email' placeholder='Email' id='email' defaultValue={currentUser.email} onChange={handleChange} className='border p-3 rounded-lg' />
        <input type='password' placeholder='Password' id='password' onChange={handleChange} className='border p-3 rounded-lg' />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-70'>Update</button>

        {
          loading ? 'Loading...' : ''
        }

        <Link to={'/create-listing'} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:op90'>Create Listing</Link>

      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>

      <p className='text-red-700'>{error ? error : ''}</p>
      <p className='text-green-700'>{updateSuccess ? 'User Updated!' : ''}</p>

      <button className='text-green-700 w-full' onClick={handleShowListings}>Show Listings</button>
      <p>{showListingsError ? 'Error showing listings' : ''}</p>


      {/* User Listings */}
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>
          Your Listings
        </h1>

        {userListings.map((listing) => (
          <div
            key={listing._id}
            className='border rounded-lg p-3 flex justify-between items-center gap-4'
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageURLs[0]}
                alt='listing cover'
                className='h-16 w-16 object-contain'
              />
            </Link>

            <Link
              className='text-slate-700 font-semibold hover:underline truncate flex-1'
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>

            <div className='flex flex-col item-center'>
              <button
                className='text-red-700 uppercase'
              >
                Delete
              </button>

              <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile