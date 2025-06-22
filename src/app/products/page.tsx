'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

const mockProducts = [
    {
        id: '1',
        name: 'iPhone 15 Pro',
        price: 4899,
        image: '/mockup/duck.png',
    },
    {
        id: '2',
        name: 'Samsung Galaxy S24',
        price: 4299,
        image: '/mockup/duck.png',
    },
    {
        id: '3',
        name: 'Xiaomi 13T Pro',
        price: 2799,
        image: '/mockup/duck.png',
    },
]

export default function ProductListingPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">All Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {mockProducts.map((product) => (
                    <div key={product.id} className="bg-white shadow rounded-lg p-4">
                        {/* <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded" /> */}
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={128}
                            height={96}
                            className="rounded object-cover"
                        />
                        <h3 className="text-lg font-semibold mt-4 text-gray-700">{product.name}</h3>
                        <p className="text-blue-600 font-bold mt-1">RM {product.price.toFixed(2)}</p>
                        <button
                            onClick={() => router.push(`/products/${product.id}`)}
                            className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
