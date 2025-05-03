'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon, Image as ImageIcon } from 'lucide-react' // Import ImageIcon

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh() // Ensure layout reflects logout
  }

   const getInitials = (email: string | undefined) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  }


  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10 shadow-sm">
       <nav className="flex-1 flex items-center">
            {/* Logo/Brand Name */}
            <a href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-primary">
            <ImageIcon className="h-6 w-6" /> {/* Use ImageIcon */}
            <span className="">MediaBucket</span>
            </a>
        </nav>
      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  {/* You might add user avatar URL later if available */}
                  {/* <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} /> */}
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Add profile/settings links if needed */}
              {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                 <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
           // Optionally show login/signup button if needed on other pages
          <Button onClick={() => router.push('/')}>Login</Button>
        )}
      </div>
    </header>
  )
}
