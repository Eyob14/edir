export const apiOrigin = import.meta.env.VITE_API_ORIGIN as string
export const apiPath = import.meta.env.VITE_API_PATH as string
export const apiBase = `${apiOrigin}${apiPath}`
export const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
export const cloudinaryPreset = import.meta.env.VITE_CLOUDINARY_PRESET as string
export const sentaryUrl = import.meta.env.VITE_SENTARY_URL as string

if (typeof apiOrigin !== 'string') {
  throw new Error('VITE_API_ORIGIN is not defined')
}

if (typeof apiPath !== 'string') {
  throw new Error('VITE_API_PATH is not defined')
}
