"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, User } from "lucide-react"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur ">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Slide</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/solutions" className="transition-colors hover:text-primary">
            Solutions
          </Link>
          <Link href="/industries" className="transition-colors hover:text-primary">
            Industries
          </Link>
          <Link href="/about" className="transition-colors hover:text-primary">
            About Us
          </Link>
        </nav>
        <div className="flex items-center space-x-4">

          <Link href={`/dashboard`} >
            <SignedIn>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            </SignedIn>

            <SignedOut>
              <Link href={`/sign-in`} >
                <Button size="sm">Sign In</Button>
              </Link>
            </SignedOut>
          </Link>

          <SignedIn>
            <UserButton>
              <UserButton.UserProfileLink label='Dashboard' url={`/dashboard`} 
                labelIcon={<User size={16} />} />
            </UserButton>
          </SignedIn>
        </div>
      </div>
    </header>
  )
}