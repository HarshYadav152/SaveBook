import Link from 'next/link';
import React, { Suspense } from 'react';

// Page content component to wrap in Suspense
const NotFoundContent = () => {
  return (
    <div className="max-w-md w-full text-center">
      {/* Simple 404 display */}
      <h1 className="text-7xl font-bold text-blue-500">404</h1>
      
      <h2 className="mt-6 text-2xl font-semibold">Page not found</h2>
      
      <p className="mt-3 text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      
      {/* Simple action button */}
      <div className="mt-8">
        <Link 
          href="/" 
          className="inline-flex items-center px-6 py-2 border border-gray-700 rounded-md text-base font-medium bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

// Loading fallback component
const NotFoundLoading = () => {
  return (
    <div className="max-w-md w-full text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-gray-800 animate-pulse"></div>
      <div className="h-8 bg-gray-800 rounded w-32 mx-auto mt-6 animate-pulse"></div>
      <div className="h-4 bg-gray-800 rounded max-w-xs mx-auto mt-3 animate-pulse"></div>
      <div className="h-10 bg-gray-800 rounded-md w-36 mx-auto mt-8 animate-pulse"></div>
    </div>
  );
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-900 text-gray-200">
      <Suspense fallback={<NotFoundLoading />}>
        <NotFoundContent />
      </Suspense>
    </div>
  );
}