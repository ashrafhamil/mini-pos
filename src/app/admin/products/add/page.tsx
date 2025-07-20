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
    const [desc, setDesc] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [variants, setVariants] = useState<Variant[]>([])
    const [loading, setLoading] = useState(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('❗ Please upload a valid image file.')
            return
        }

        setImageFile(file)
        setPreviewUrl(URL.createObjectURL(file))
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
        if (!name || !desc || !imageFile) return alert('❗ Product name, description and image are required.')

        const invalidVariants = variants.length === 0 || variants.some(v => !(v.storage && v.color && v.setType && v.price > 0))
        if (invalidVariants) return alert('❗ Please fill out all variant fields correctly.')

        try {
            setLoading(true)
            const imageId = uuid()
            const imageRef = ref(storage, `product_images/${imageId}-${imageFile.name}`)
            await uploadBytes(imageRef, imageFile)
            const imageUrl = await getDownloadURL(imageRef)

            await addDoc(collection(db, 'products'), {
                name,
                desc,
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
                type="text"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full mb-4 border px-3 py-2 rounded"
                placeholder="Product Description"
            />

            <div className="mb-4">
                <label
                    htmlFor="product-image"
                    className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded cursor-pointer hover:bg-indigo-700 transition"
                >
                    Upload Product Image
                </label>
                <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
            </div>


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
                            <option value="" disabled>Storage</option>
                            <option value="64GB">64GB</option>
                            <option value="128GB">128GB</option>
                            <option value="256GB">256GB</option>
                            <option value="512GB">512GB</option>
                            <option value="1TB">1TB</option>
                        </select>

                        <input
                            list={`color-options-${index}`}
                            placeholder="Color"
                            value={variant.color}
                            onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                            className="border px-3 py-2 rounded"
                        />
                        <datalist id={`color-options-${index}`}>
                            <option value="(PRODUCT)RED" />
                            <option value="Alpine Green" />
                            <option value="Black" />
                            <option value="Black Titanium" />
                            <option value="Blue" />
                            <option value="Blue Titanium" />
                            <option value="Coral" />
                            <option value="Deep Purple" />
                            <option value="Gold" />
                            <option value="Graphite" />
                            <option value="Green" />
                            <option value="Jet Black" />
                            <option value="Midnight" />
                            <option value="Natural Titanium" />
                            <option value="Pacific Blue" />
                            <option value="Pink" />
                            <option value="Purple" />
                            <option value="Rose Gold" />
                            <option value="Sierra Blue" />
                            <option value="Silver" />
                            <option value="Space Black" />
                            <option value="Space Gray" />
                            <option value="Starlight" />
                            <option value="White" />
                            <option value="White Titanium" />
                            <option value="Yellow" />
                        </datalist>


                        <select
                            value={variant.setType}
                            onChange={(e) => handleVariantChange(index, 'setType', e.target.value)}
                            className="border px-3 py-2 rounded"
                        >
                            <option value="" disabled>Set Type</option>
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

                        <div className="col-span-4 flex justify-end">
                            <button
                                onClick={() => removeVariant(index)}
                                className="text-white text-xs bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
                            >
                                Remove
                            </button>
                        </div>

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
