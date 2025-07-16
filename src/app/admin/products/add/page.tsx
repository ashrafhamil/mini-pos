'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../../../../lib/firebase'
import { v4 as uuid } from 'uuid'

type Variant = {
    storage: string
    color: string
    setType: string
    price: number
}

export default function AddProductPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [variants, setVariants] = useState<Variant[]>([])
    const [loading, setLoading] = useState(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setImageFile(e.target.files[0])
            setPreviewUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleVariantChange = (index: number, key: keyof Variant, value: string | number) => {
        const updated = [...variants]
        updated[index] = {
            ...updated[index],
            [key]: key === 'price' ? parseFloat(value as string) : value,
        }
        setVariants(updated)
    }

    const addVariant = () => {
        setVariants([...variants, { storage: '', color: '', setType: '', price: 0 }])
    }

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index))
    }

    const saveProduct = async () => {
        if (!name || !imageFile) {
            alert('❗ Product name and image are required.')
            return
        }

        try {
            setLoading(true)
            const imageId = uuid()
            const imageRef = ref(storage, `product_images/${imageId}-${imageFile.name}`)
            await uploadBytes(imageRef, imageFile)
            const imageUrl = await getDownloadURL(imageRef)

            await addDoc(collection(db, 'products'), {
                name,
                image: imageUrl,
                variants,
            })

            alert('✅ Product added successfully!')
            router.push('/admin/products')
        } catch (err) {
            console.error(err)
            alert('❌ Failed to add product. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Add Product</h2>

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-4 border px-3 py-2 rounded"
                placeholder="Product Name"
            />

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4"
            />

            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Preview"
                    className="mb-6 w-40 h-40 object-contain border rounded"
                />
            )}

            <div className="space-y-4">
                {variants.map((variant, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-4 gap-4 items-center bg-gray-100 p-4 rounded"
                    >
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

                        <input
                            type="number"
                            placeholder="Price"
                            value={variant.price === 0 ? '' : variant.price.toString()}
                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                            className="border px-3 py-2 rounded"
                        />

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
                    onClick={saveProduct}
                    disabled={loading}
                    className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </div>
    )
}
