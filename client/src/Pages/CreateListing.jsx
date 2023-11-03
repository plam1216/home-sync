import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'

const CreateListing = () => {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageURLs: [],
    })
    const [imageUploadError, setImageUploadError] = useState(null)
    const [uploading, setUploading] = useState(false)

    console.log('formData', formData)

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log(`Upload progress: ${progress}% done`)
                },
                (error) => {
                    reject(error)
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            // one by one images will be uploaded
            const promises = []

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }

            Promise.all(promises).then((urls) => {
                // add new photos to previous ones
                setFormData({
                    ...formData,
                    imageURLs: formData.imageURLs.concat(urls)
                })

                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setImageUploadError('Image upload failed')
                setUploading(false)
            })
        } else {
            setImageUploadError('Maximum 6 images per listing')
            setUploading(false)
        }
    }

    const handleDeleteImage = (index) => {
        setFormData({
            ...formData,
            imageURLs: formData.imageURLs.filter((url, i) => i !== index)
        })
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4'>

                {/* Left Col */}
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text'
                        placeholder='Name'
                        className='border p-3 rounded-lg'
                        id='name'
                        minLength='10'
                        maxLength='62'
                        required />

                    <textarea type='text'
                        placeholder='Description'
                        className='border p-3 rounded-lg'
                        id='description'
                        required />

                    <input type='text'
                        placeholder='Address'
                        className='border p-3 rounded-lg'
                        id='address'
                        required />


                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sale' className='w-5' />
                            <span>Sell</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type='checkbox' id='parking' className='w-5' />
                            <span>Parking</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type='checkbox' id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>

                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                            <p>Beds</p>
                        </div>

                        <div className='flex items-center gap-2'>
                            <input type='number' id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                            <p>Bathrooms</p>
                        </div>

                        <div className='flex items-center gap-2'>
                            <input type='number' id='regularPrice' required className='p-3 border border-gray-300 rounded-lg' />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            <input type='number' id='discountedPrice' required className='p-3 border border-gray-300 rounded-lg' />
                            <div className='flex flex-col items-center'>
                                <p>Discounted Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-4 flex-1'>
                    <p className='font-semibold'>Images: </p>
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>

                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple />
                        <button onClick={handleImageSubmit} disabled={uploading} className='p-3 text-green-700 border border-green-700 uppercase hover:shadow-lg disabled:opacity-80'>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>

                    <p className='text-red-700'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageURLs.length > 0 && formData.imageURLs.map((url, index) => (
                            <div key={url} className='flex justify-between p-3 border items-center'>
                                <img src={url} alt='listing-image' className='w-20 h-20 object-contain rounded-lg' />
                                <button type='button' onClick={() => handleDeleteImage(index)} className='p-3- text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                            </div>
                        ))
                    }

                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
                </div>
            </form>
        </main>
    )
}

export default CreateListing