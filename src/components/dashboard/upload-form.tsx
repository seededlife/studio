'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from 'lucide-react'

interface UploadFormProps {
  userId: string;
}

export default function UploadForm({ userId }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file || !userId) return

    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images') // Ensure you have a bucket named 'images'
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
       const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

       if (!urlData?.publicUrl) {
           throw new Error('Could not get public URL for the uploaded image.')
       }

      // Insert image metadata into the database
      const { error: dbError } = await supabase
        .from('images') // Ensure you have a table named 'images'
        .insert({
          user_id: userId,
          name: file.name,
          url: urlData.publicUrl,
          path: filePath, // Store the path for potential deletion later
        })

      if (dbError) {
        // If DB insert fails, attempt to delete the uploaded file
         await supabase.storage.from('images').remove([filePath]);
        throw dbError
      }


      toast({
        title: "Upload Successful",
        description: `${file.name} uploaded successfully.`,
      })
      setFile(null) // Reset file input
      // Refresh the page or specific component to show the new image
      router.refresh()

    } catch (error: any) {
      console.error('Upload failed:', error)
      toast({
        title: "Upload Failed",
        description: error.message || "Could not upload the image.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          required
        />
      </div>
      <Button type="submit" disabled={uploading || !file}>
        {uploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {uploading ? 'Uploading...' : 'Upload Image'}
      </Button>
       {file && !uploading && (
        <p className="text-sm text-muted-foreground">Selected file: {file.name}</p>
      )}
    </form>
  )
}
