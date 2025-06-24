'use client'

import { useRouter } from 'next/navigation'

export default function PaymentPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="bg-gray-100 p-6 rounded-lg shadow text-center space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Simulate Payment</h2>
                <p className="text-gray-600">Choose how the payment should go:</p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => router.push('/checkout?payment=success')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer"
                    >
                        ✅ Success
                    </button>
                    <button
                        onClick={() => router.push('/checkout?payment=failed')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer"
                    >
                        ❌ Failed
                    </button>
                </div>
            </div>
        </div>
    )
}
