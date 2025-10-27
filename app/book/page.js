"use client"
import Notes from "@/components/notes/Notes";
import { useEffect } from "react";

export default function Book() {
  useEffect(() => {
    async function createUser() {
      try {
        await fetch("/api/create-user", {
          method: "POST"
        });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
    createUser();
  }, []);

  return (
   <>
    <Notes/>
   </>
  );
}