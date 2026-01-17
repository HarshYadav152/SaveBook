"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button onClick={scrollToTop} className="scroll-btn" aria-label="Scroll to top">
      <span>↑</span>

     
      <style jsx>{`
        .scroll-btn {
          position: fixed;
          bottom: 90px;
          right: 32px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #6366f1, #b076e3);
          color: white;
          font-size: 22px;
          cursor: pointer;
          z-index: 9999;
          box-shadow: 0 12px 25px rgba(99, 102, 241, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          animation: fadeIn 0.4s ease;
        }

        .scroll-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 16px 35px rgba(31, 20, 41, 0.5);
        }

        .scroll-btn:active {
          transform: scale(0.95);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </button>
  );
}
