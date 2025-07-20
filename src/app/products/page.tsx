'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useProductStore } from '../../../lib/useProductStore'

export default function ProductListingPage() {
    const router = useRouter()
    const { products, isLoading, loadProducts } = useProductStore()

    useEffect(() => {
        if (products.length === 0) loadProducts()
    }, [])

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">All Products</h2>

            {isLoading && <p className="text-center text-gray-400">Loading products...</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-6xl mx-auto">
                {products.map((product) => (
                    <div key={product.id} className="bg-white shadow rounded-lg p-4 flex flex-col justify-between">
                        <div>
                            <Image
                                src={product.image || '/mockup/duck.png'}
                                alt={product.name}
                                width={300}
                                height={300}
                                className="w-full h-40 object-contain bg-gray-100 rounded"
                            />
                            <h3 className="text-lg font-semibold mt-4 text-gray-700">{product.name}</h3>
                        </div>

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
