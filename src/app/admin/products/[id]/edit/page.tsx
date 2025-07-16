'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../../../../../lib/firebase'

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

export default function EditProductPage() {
    const { id } = useParams()
    const router = useRouter()
    const [productName, setProductName] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [newImageFile, setNewImageFile] = useState<File | null>(null)
    const [variants, setVariants] = useState<Variant[]>([])

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return
            const refDoc = doc(db, 'products', id as string)
            const snap = await getDoc(refDoc)
            if (snap.exists()) {
                const data = snap.data() as Product
                setProductName(data.name)
                setImageUrl(data.image || '')
                setVariants(data.variants || [])
            }
        }

        fetchProduct()
    }, [id])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setNewImageFile(e.target.files[0])
            setImageUrl(URL.createObjectURL(e.target.files[0]))
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

    const saveChanges = async () => {
        if (!id) return
        const refDoc = doc(db, 'products', id as string)
        let finalImageUrl = imageUrl

        if (newImageFile) {
            const imageId = crypto.randomUUID()
            const imageRef = ref(storage, `product_images/${imageId}-${newImageFile.name}`)
            await uploadBytes(imageRef, newImageFile)
            finalImageUrl = await getDownloadURL(imageRef)
        }

        await updateDoc(refDoc, {
            name: productName,
            image: finalImageUrl,
            variants,
        })

        alert('✅ Product updated')
        router.push('/admin/products')
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

            {imageUrl && (
                <img
                    src={imageUrl}
                    alt="Product Preview"
                    className="mb-4 w-40 h-40 object-contain border rounded"
                />
            )}

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-6"
            />

            <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full mb-6 border px-3 py-2 rounded"
                placeholder="Product Name"
            />

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
                    onClick={saveChanges}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}
