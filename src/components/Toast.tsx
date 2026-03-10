import React from 'react'

export default function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div aria-live="polite" role="status" className="fixed right-4 bottom-4 bg-gray-800 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  )
}
