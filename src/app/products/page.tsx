'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../lib/firebase' // adjust path if different

type Variant = {
    storage: string
    color: string
    setType: string
    price: number
}

type Product = {
    id: string
    name: string
    image: string
    variants: Variant[]
}

export default function ProductListingPage() {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        const fetchProducts = async () => {
            const snapshot = await getDocs(collection(db, 'products'))
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Product[]

            setProducts(data)
        }

        fetchProducts()
    }, [])

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">All Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {products.map((product) => (
                    <div key={product.id} className="bg-white shadow rounded-lg p-4">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={128}
                            height={96}
                            className="rounded object-cover"
                        />
                        <h3 className="text-lg font-semibold mt-4 text-gray-700">{product.name}</h3>
                        <button
                            onClick={() => router.push(`/products/${product.id}`)}
                            className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium cursor-pointer"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
