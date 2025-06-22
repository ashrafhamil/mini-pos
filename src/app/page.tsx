'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Mini POS System</h1>
        <p className="text-gray-600 text-lg max-w-md mx-auto">
          Accept card payments without a physical terminal. Manage your products and checkout anywhere.
        </p>
        <button
          onClick={() => router.push('/products')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold transition cursor-pointer"
        >
          View Products
        </button>
      </div>
    </main>
  )
}
