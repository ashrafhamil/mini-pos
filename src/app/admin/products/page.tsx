'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProductStore } from '../../../../lib/useProductStore'

export default function ProductAdminView() {
    const { products, loadProducts, deleteProduct, deleteVariant } = useProductStore()
    const router = useRouter()

    useEffect(() => {
        if (products.length === 0) loadProducts()
    }, [])

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
                            onClick={async () => {
                                const confirmed = confirm('Are you sure?')
                                if (confirmed) await deleteProduct(product.id)
                            }}
                            className="text-sm text-red-600 hover:underline"
                        >
                            ❌ Delete Product
                        </button>
                    </div>

                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-32 h-32 object-contain border rounded"
                        />
                    ) : (
                        <div className="w-32 h-32 flex items-center justify-center bg-gray-100 border rounded text-gray-400 text-sm">
                            No image
                        </div>
                    )}

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
                                                onClick={() =>
                                                    router.push(`/admin/products/${product.id}/edit`)
                                                }
                                                className="text-blue-600 text-xs hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        <td className="px-2 py-1 border">
                                            <button
                                                onClick={async () => {
                                                    const confirmed = confirm('Delete this variant?')
                                                    if (confirmed) await deleteVariant(product.id, idx)
                                                }}
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
