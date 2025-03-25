"use client"

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { storage } from '@/firebase/client' // Make sure this import is correct
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  multiple?: boolean
  disabled?: boolean
}

export function ImageUpload({
  value = [],
  onChange,
  multiple = false,
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadedUrls: string[] = []
      
      // If not multiple, we'll replace the current images
      const newValue = multiple ? [...value] : []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileId = uuidv4()
        const fileExtension = file.name.split('.').pop()
        const fileName = `products/${fileId}.${fileExtension}`
        
        // Ensure storage is defined before creating reference
        const storageRef = ref(storage!, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)
        
        // Create a promise to track the upload
        const uploadPromise = new Promise<string>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              setUploadProgress(progress)
            },
            (error) => {
              console.error('Upload error:', error)
              reject(error)
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              resolve(downloadURL)
            }
          )
        })
        
        const downloadURL = await uploadPromise
        uploadedUrls.push(downloadURL)
      }
      
      // Update the value with the new URLs
      const updatedValue = [...newValue, ...uploadedUrls]
      onChange(updatedValue)
      
      toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded successfully`)
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Failed to upload images')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      // Reset the input value so the same file can be selected again
      e.target.value = ''
    }
  }, [multiple, onChange, value])

  const handleRemove = useCallback(async (url: string) => {
    try {
      if (!storage) {
        throw new Error('Firebase storage is not initialized');
      }

      // Try to delete from Firebase Storage if it's a Firebase URL
      if (url.includes('firebasestorage.googleapis.com')) {
        // Extract the path from the URL
        const urlObj = new URL(url)
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/)
        
        if (pathMatch && pathMatch[1]) {
          const path = decodeURIComponent(pathMatch[1])
          const storageRef = ref(storage!, path)
          
          try {
            await deleteObject(storageRef)
          } catch (error) {
            console.error('Error deleting image from storage:', error)
            // Continue even if delete fails
          }
        }
      }
      
      // Remove the URL from the value array
      const updatedValue = value.filter(item => item !== url)
      onChange(updatedValue)
      
      toast.success('Image removed')
    } catch (error) {
      console.error('Error removing image:', error)
      toast.error('Failed to remove image')
    }
  }, [onChange, value])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {value.map((url) => (
          <div key={url} className="relative group aspect-square rounded-md overflow-hidden border">
            <Image
              src={url}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemove(url)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        {isUploading && (
          <div className="flex flex-col items-center justify-center border rounded-md aspect-square bg-muted">
            <Loader2 className="h-6 w-6 animate-spin mb-2" />
            <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</p>
          </div>
        )}
        
        {(!multiple && value.length === 0) || (multiple) ? (
          <div className="flex flex-col items-center justify-center border rounded-md aspect-square bg-muted relative">
            <Input
              type="file"
              accept="image/*"
              multiple={multiple}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleUpload}
              disabled={disabled || isUploading}
            />
            <Upload className="h-6 w-6 mb-2" />
            <p className="text-xs text-muted-foreground">Upload</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}