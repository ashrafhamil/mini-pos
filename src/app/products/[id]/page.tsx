'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCartStore } from '../../../../lib/useCartStore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../../../lib/firebase'
import Image from 'next/image'

type Variant = {
    storage: string
    color: string
    setType: string
    price: number
}

type Product = {
    id: string
    name: string
    desc: string
    image: string
    variants: Variant[]
}

export default function ProductDetailPage() {
    const { id } = useParams()
    const addToCart = useCartStore((state) => state.addToCart)

    const [product, setProduct] = useState<Product | null>(null)
    const [selectedStorage, setSelectedStorage] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSetType, setSelectedSetType] = useState('')

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return

            const docRef = doc(db, 'products', id as string)
            const snapshot = await getDoc(docRef)

            if (snapshot.exists()) {
                const data = snapshot.data() as Product
                setProduct(data)
                setSelectedStorage(data.variants[0]?.storage || '')
                setSelectedColor(data.variants[0]?.color || '')
                setSelectedSetType(data.variants[0]?.setType || '')
            }
        }

        fetchProduct()
    }, [id])

    if (!product) return <div className="p-6 text-center text-red-600">Product not found.</div>

    const matchedVariant = product.variants.find(
        (v) =>
            v.storage === selectedStorage &&
            v.color === selectedColor &&
            v.setType === selectedSetType
    )

    const price = matchedVariant?.price ?? 0

    const handleAddToCart = () => {
        if (!matchedVariant) return alert('❌ No matching variant.')

        const item = {
            id: id as string,
            name: product.name,
            storage: selectedStorage,
            color: selectedColor,
            purchaseType: selectedSetType,
            price,
            image: product.image,
        }

        addToCart(item)
        alert('✅ Added to cart!')
    }

    const storages = [...new Set(product.variants.map(v => v.storage))].sort((a, b) => parseInt(a) - parseInt(b))
    const colors = [...new Set(product.variants.map(v => v.color))].sort((a, b) => a.localeCompare(b))
    const setTypes = [...new Set(product.variants.map(v => v.setType))].sort((a, b) => a.localeCompare(b))

    return (
        <div className="min-h-screen bg-white px-4 py-10 max-w-4xl mx-auto">
            <Image
                src={product.image || '/mockup/duck.png'}
                alt={product.name}
                width={800}
                height={400}
                className="w-full rounded-lg object-contain h-64"
            />

            <div className="mt-6 space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
                <h2 className="text-sm text-gray-400">{product.desc}</h2>
                <p className="text-blue-600 text-xl font-semibold">RM {price.toFixed(2)}</p>

                <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedStorage}
                    onChange={(e) => setSelectedStorage(e.target.value)}
                >
                    {storages.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                >
                    {colors.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedSetType}
                    onChange={(e) => setSelectedSetType(e.target.value)}
                >
                    {setTypes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <button
                    disabled={!matchedVariant}
                    onClick={handleAddToCart}
                    className={`w-full mt-6 py-3 text-white rounded text-base font-bold cursor-pointer ${matchedVariant ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                >
                    {matchedVariant ? 'Add to Cart' : 'Select a valid combination'}
                </button>
            </div>
        </div>
    )
}
