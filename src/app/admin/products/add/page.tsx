'use client'

import { useState } from 'react'

type Variant = {
    storage: string
    color: string
    setType: string
    price: number
}

export default function ProductManagementPage() {
    const [productName, setProductName] = useState('')
    const [variants, setVariants] = useState<Variant[]>([
        { storage: '', color: '', setType: '', price: 0 },
    ])

    const handleVariantChange = (index: number, key: keyof Variant, value: string | number) => {
        const updated = [...variants]
        updated[index] = {
            ...updated[index],
            [key]: key === 'price' ? parseFloat(value as string) : value,
        }
        setVariants(updated)
        setVariants(updated)
    }

    const addVariant = () => {
        setVariants([...variants, { storage: '', color: '', setType: '', price: 0 }])
    }

    const removeVariant = (index: number) => {
        const updated = variants.filter((_, i) => i !== index)
        setVariants(updated)
    }

    const handleSubmit = () => {
        const newProduct = {
            id: Date.now().toString(), // unique ID
            name: productName,
            variants,
            image: '/mockup/duck.png', // for now
        }

        const existing = localStorage.getItem('products')
        const products = existing ? JSON.parse(existing) : []

        const updated = [...products, newProduct]
        localStorage.setItem('products', JSON.stringify(updated))

        alert('✅ Product saved to localStorage!')
        setProductName('')
        setVariants([{ storage: '', color: '', setType: '', price: 0 }])
    }


    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Product Management</h2>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div className="space-y-4">
                {variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 items-center bg-gray-100 p-4 rounded">
                        <select
                            value={variant.storage}
                            onChange={(e) => handleVariantChange(index, 'storage', e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="">Storage</option>
                            <option value="64GB">64GB</option>
                            <option value="128GB">128GB</option>
                            <option value="256GB">256GB</option>
                            <option value="512GB">512GB</option>
                        </select>
                        <input
                            list={`color-options-${index}`}
                            placeholder="Color"
                            value={variant.color}
                            onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                            className="border px-3 py-2 rounded"
                        />
                        <datalist id={`color-options-${index}`}>
                            <option value="Black" />
                            <option value="White" />
                            <option value="Pink" />
                            <option value="Orange" />
                            <option value="Rose Gold" />
                        </datalist>

                        <select
                            value={variant.setType}
                            onChange={(e) => handleVariantChange(index, 'setType', e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="">Set Type</option>
                            <option value="Phone Only">Phone Only</option>
                            <option value="Full Set">Full Set</option>
                        </select>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Price"
                                value={variant.price === 0 ? '' : variant.price.toString()}
                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                className="border px-3 py-2 rounded w-full"
                            />
                        </div>
                        <button
                            onClick={() => removeVariant(index)}
                            className="col-span-4 text-red-600 text-sm underline"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    onClick={addVariant}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                >
                    ➕ Add Variant
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                    Save Product
                </button>
            </div>
        </div>
    )
}
