// src/app/admin/products/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function ProductAdminView() {
    const [products, setProducts] = useState<Product[]>([])
    const router = useRouter()

    useEffect(() => {
        const stored = localStorage.getItem('products')
        if (stored) {
            setProducts(JSON.parse(stored))
        }
    }, [])

    const deleteProduct = (id: string) => {
        const updated = products.filter(p => p.id !== id)
        localStorage.setItem('products', JSON.stringify(updated))
        setProducts(updated)
        alert('🗑️ Product deleted')
    }

    const deleteVariant = (productId: string, index: number) => {
        const updated = products.map(p => {
            if (p.id === productId) {
                return {
                    ...p,
                    variants: p.variants.filter((_, i) => i !== index),
                }
            }
            return p
        })
        localStorage.setItem('products', JSON.stringify(updated))
        setProducts(updated)
        alert('🗑️ Variant deleted')
    }

    if (products.length === 0) {
        return <div className="p-6 text-gray-500 text-center">No products found</div>
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Product Admin</h2>

            {products.map(product => (
                <div key={product.id} className="bg-white rounded shadow p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-700">{product.name}</h3>
                        <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-sm text-red-600 hover:underline"
                        >
                            ❌ Delete Product
                        </button>
                    </div>

                    {product.variants.length === 0 ? (
                        <p className="text-sm text-gray-400">No variants</p>
                    ) : (
                        <table className="w-full text-sm text-left border mt-2">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-2 py-1 border">Storage</th>
                                    <th className="px-2 py-1 border">Color</th>
                                    <th className="px-2 py-1 border">Set Type</th>
                                    <th className="px-2 py-1 border">Price (RM)</th>
                                    <th className="px-2 py-1 border">Edit</th>
                                    <th className="px-2 py-1 border">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.variants.map((v, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="px-2 py-1 border">{v.storage}</td>
                                        <td className="px-2 py-1 border">{v.color}</td>
                                        <td className="px-2 py-1 border">{v.setType}</td>
                                        <td className="px-2 py-1 border">RM {v.price.toFixed(2)}</td>
                                        <td className="px-2 py-1 border">
                                            <button
                                                onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                                                className="text-red-600 text-xs hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        <td className="px-2 py-1 border">
                                            <button
                                                onClick={() => deleteVariant(product.id, idx)}
                                                className="text-red-600 text-xs hover:underline"
                                            >
                                                Delete Variant
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ))}
        </div>
    )
}
