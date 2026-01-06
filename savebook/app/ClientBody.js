// Create a new file: /app/ClientBody.js
"use client";

import { useEffect, useState } from 'react';

export default function ClientBody({ children, className }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <body className={className} suppressHydrationWarning={isClient}>
      {children}
    </body>
  );
}