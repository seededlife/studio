import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import UploadForm from '@/components/dashboard/upload-form'
import ImageGrid from '@/components/dashboard/image-grid'
import Header from '@/components/layout/header'

export default async function Dashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch uploaded images for the current user
  const { data: images, error } = await supabase
    .from('images')
    .select('id, name, url, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching images:', error)
    // Handle error appropriately, maybe show a message to the user
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header user={user} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
        <div className="grid gap-4">
           <h1 className="text-2xl font-semibold tracking-tight">Your Media Bucket</h1>
          <Card className="bg-card">
              <CardHeader>
                  <CardTitle>Upload New Image</CardTitle>
                  <CardDescription>Select an image file to upload to your bucket.</CardDescription>
              </CardHeader>
              <CardContent>
                 <UploadForm userId={user.id} />
              </CardContent>
          </Card>

           <Card className="bg-card">
              <CardHeader>
                  <CardTitle>Uploaded Images</CardTitle>
                  <CardDescription>Click on an image URL to copy it.</CardDescription>
              </CardHeader>
              <CardContent>
                  <ImageGrid images={images || []} />
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
