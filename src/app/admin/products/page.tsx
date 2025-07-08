'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../lib/firebase'

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

    const deleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        await deleteDoc(doc(db, 'products', id))
        setProducts(prev => prev.filter(p => p.id !== id))
        alert('🗑️ Product deleted')
    }

    const deleteVariant = async (productId: string, index: number) => {
        const product = products.find(p => p.id === productId)
        if (!product) return

        const updatedVariants = product.variants.filter((_, i) => i !== index)
        await updateDoc(doc(db, 'products', productId), {
            variants: updatedVariants,
        })

        setProducts(prev =>
            prev.map(p =>
                p.id === productId ? { ...p, variants: updatedVariants } : p
            )
        )
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
                                                className="text-blue-600 text-xs hover:underline"
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
