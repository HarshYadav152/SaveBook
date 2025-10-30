"use client"
import Link from 'next/link'
import { Construction, Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen text-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <Construction className="h-24 w-24 text-yellow-400 mb-4 animate-bounce" />
            <div className="absolute -inset-4 bg-yellow-400/20 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold mb-4">Page Under Construction</h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          We're currently building this page with exciting new features. 
          Check back soon for updates!
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="h-5 w-5 mr-2" />
            Return Home
          </Link>
          
          <div className="text-sm text-gray-500">
            Think this is an error?{' '}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}