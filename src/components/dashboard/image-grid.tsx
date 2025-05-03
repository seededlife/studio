'use client'

import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface Image {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

interface ImageGridProps {
  images: Image[];
}

export default function ImageGrid({ images }: ImageGridProps) {
   const { toast } = useToast()

   const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Copied!",
        description: "Image URL copied to clipboard.",
      })
    }).catch(err => {
      console.error('Failed to copy: ', err)
       toast({
        title: "Copy Failed",
        description: "Could not copy URL to clipboard.",
        variant: "destructive",
      })
    })
  }

  if (images.length === 0) {
    return <p className="text-muted-foreground">No images uploaded yet.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden bg-card shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4 space-y-2">
             <div className="aspect-square relative w-full bg-muted rounded-md overflow-hidden">
               <Image
                src={image.url}
                alt={image.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
                unoptimized // Add this if you have issues with Supabase URLs and Next/Image optimization
              />
             </div>
            <p className="text-sm font-medium truncate" title={image.name}>{image.name}</p>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={image.url}
                readOnly
                className="text-xs h-8 flex-1 bg-muted border-none"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={() => copyToClipboard(image.url)}
              >
                <Copy className="h-4 w-4" />
                 <span className="sr-only">Copy URL</span>
              </Button>
            </div>
             <p className="text-xs text-muted-foreground">
              Uploaded: {new Date(image.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
