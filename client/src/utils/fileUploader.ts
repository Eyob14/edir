import axios, { AxiosError } from 'axios'
import { cloudinaryCloudName, cloudinaryPreset } from '@/config'

type ErrorType = {
  message: string
}
type FileUploadError = {
  error: ErrorType
}

export function uploadImageToCloudinary(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', cloudinaryPreset)
    formData.append('cloud_name', cloudinaryCloudName)

    axios
      .post(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
          console.log(`Upload Progress: ${progress}%`)
        },
      })
      .then((response) => {
        resolve(response.data.url)
      })
      .catch((error) => {
        const axiosError = error as AxiosError
        const errorObject: FileUploadError = axiosError.response?.data as FileUploadError
        reject(errorObject.error.message as string)
      })
  })
}
