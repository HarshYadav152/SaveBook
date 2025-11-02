'use client'

import { SignUp, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Home() {
    const router = useRouter()
  const { isSignedIn } = useUser()

  if (isSignedIn) {
    router.push("/book")
  }

  return <SignUp/>
}