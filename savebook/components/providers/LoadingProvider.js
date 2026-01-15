"use client"
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Loader from '../common/Loader';

// Simple fallback for the loader itself
const LoaderFallback = () => (
  <div className="flex items-center justify-center">
    <div className="h-16 w-16 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin"></div>
  </div>
);

export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track previous path to detect actual navigation
  const [prevPathname, setPrevPathname] = useState('');
  const [prevSearchParams, setPrevSearchParams] = useState('');

  // Function to handle route change start
  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);
  
  // Function to handle route change complete
  const stopLoading = useCallback(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Shorter delay for better UX
    return () => clearTimeout(timer);
  }, []);

  // Detect route changes
  useEffect(() => {
    const currentSearchParams = searchParams.toString();
    
    // Only trigger loading on actual navigation (not initial load)
    if (prevPathname && (prevPathname !== pathname || prevSearchParams !== currentSearchParams)) {
      startLoading();
      stopLoading();
    }
    
    // Update previous values for next comparison
    setPrevPathname(pathname);
    setPrevSearchParams(currentSearchParams);
  }, [pathname, searchParams, prevPathname, prevSearchParams, startLoading, stopLoading]);

  // Add event listeners for navigation events
  useEffect(() => {
    // Immediately detect link clicks before navigation
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith(window.location.origin)) {
        startLoading();
      }
    };

    // Add event listener for link clicks
    document.addEventListener('click', handleLinkClick);
    
    // Initial page load should not show loading
    if (!prevPathname) {
      setPrevPathname(pathname);
      setPrevSearchParams(searchParams.toString());
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [startLoading, pathname, searchParams, prevPathname]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50">
          <Suspense fallback={<LoaderFallback />}>
            <Loader />
          </Suspense>
        </div>
      )}
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50">
          <LoaderFallback />
        </div>
      }>
        {children}
      </Suspense>
    </>
  );
}