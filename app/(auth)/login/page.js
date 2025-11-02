'use client'

import { SignIn, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn) {
      router.push('/book')
    }
  }, [isLoaded, isSignedIn, router])

  // while Clerk state is loading, render nothing (or a loader)
  if (!isLoaded) return null

  // if already signed in we return null because useEffect will redirect
  if (isSignedIn) return null

  return <SignIn />
}