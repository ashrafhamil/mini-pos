'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useCartStore } from '../../../../lib/useCartStore'
import Image from 'next/image'


const mockProducts = [
    {
        id: '1',
        name: 'iPhone 15 Pro',
        basePrice: 4899,
        image: '/mockup/duck.png',
        description: 'Flagship Apple phone with A17 chip, USB-C, and ProMotion display.',
        options: [
            { label: '128GB', extra: 0 },
            { label: '256GB', extra: 400 },
            { label: '512GB', extra: 800 },
        ],
        colors: [
            { label: 'Black', extra: 0, image: '/mockup/duck.png' },
            { label: 'White', extra: 50, image: '/mockup/duck.png' },
            { label: 'Blue', extra: 100, image: '/mockup/duck.png' },
        ],
        purchaseOptions: [
            { label: 'Phone Only', extra: 0 },
            { label: 'Full Set', extra: 300 },
        ],
    },
    {
        id: '2',
        name: 'Samsung Galaxy S24',
        basePrice: 4299,
        image: '/mockup/duck.png',
        description: 'High-end Samsung phone with AI camera and Snapdragon Gen 3.',
        options: [
            { label: '128GB', extra: 0 },
            { label: '256GB', extra: 400 },
            { label: '512GB', extra: 800 },
        ],
        colors: [
            { label: 'Black', extra: 0, image: '/mockup/duck.png' },
            { label: 'White', extra: 50, image: '/mockup/duck.png' },
            { label: 'Blue', extra: 100, image: '/mockup/duck.png' },
        ],
        purchaseOptions: [
            { label: 'Phone Only', extra: 0 },
            { label: 'Full Set', extra: 300 },
        ],
    },
    {
        id: '3',
        name: 'Xiaomi 13T Pro',
        basePrice: 2799,
        image: '/mockup/duck.png',
        description: 'Budget-friendly flagship with Leica camera and Dimensity 9200 chip.',
        options: [
            { label: '128GB', extra: 0 },
            { label: '256GB', extra: 400 },
            { label: '512GB', extra: 800 },
        ],
        colors: [
            { label: 'Black', extra: 0, image: '/mockup/duck.png' },
            { label: 'White', extra: 50, image: '/mockup/duck.png' },
            { label: 'Blue', extra: 100, image: '/mockup/duck.png' },
        ],
        purchaseOptions: [
            { label: 'Phone Only', extra: 0 },
            { label: 'Full Set', extra: 300 },
        ],
    },
]

export default function ProductDetailPage() {
    const { id } = useParams()
    const product = mockProducts.find((p) => p.id === id)

    // Provide fallback values even if product is undefined (to satisfy React hooks)
    const [selectedStorage, setSelectedStorage] = useState(
        product?.options[0].label ?? ''
    )
    const [selectedColor, setSelectedColor] = useState(
        product?.colors[0].label ?? ''
    )
    const [selectedPurchaseType, setSelectedPurchaseType] = useState(
        product?.purchaseOptions[0].label ?? ''
    )

    const addToCart = useCartStore((state) => state.addToCart)

    if (!product) {
        return <div className="p-6 text-center text-red-600">Product not found.</div>
    }

    const calculateTotal = () => {
        const storageExtra = product.options.find((o) => o.label === selectedStorage)?.extra || 0
        const colorExtra = product.colors.find((c) => c.label === selectedColor)?.extra || 0
        const purchaseExtra = product.purchaseOptions.find((p) => p.label === selectedPurchaseType)?.extra || 0

        return product.basePrice + storageExtra + colorExtra + purchaseExtra
    }

    const handleAddToCart = () => {
        const item = {
            id: product.id,
            name: product.name,
            storage: selectedStorage,
            color: selectedColor,
            purchaseType: selectedPurchaseType,
            price: calculateTotal(),
            image: product.colors.find((c) => c.label === selectedColor)?.image || product.image,
        }

        addToCart(item)
        console.log('🛒 Cart after add:', useCartStore.getState().items)
        alert('Added to cart!')
    }


    return (
        <div className="min-h-screen bg-white px-4 py-10 max-w-4xl mx-auto">
            <Image
                src={product.colors.find((c) => c.label === selectedColor)?.image || product.image}
                alt={`${product.name} - ${selectedColor}`}
                width={800}
                height={400}
                className="w-full rounded-lg object-cover h-64 transition duration-300"
                priority
            />

            <div className="mt-6 space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
                <p className="text-blue-600 text-xl font-semibold">RM {calculateTotal().toFixed(2)}</p>
                <p className="text-gray-600">{product.description}</p>

                <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedStorage}
                    onChange={(e) => setSelectedStorage(e.target.value)}
                >
                    {product.options.map((opt) => (
                        <option key={opt.label} value={opt.label}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                >
                    {product.colors.map((opt) => (
                        <option key={opt.label} value={opt.label}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <div className="flex gap-4">
                    {product.purchaseOptions.map((option) => (
                        <label key={option.label} className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name="purchaseType"
                                value={option.label}
                                checked={selectedPurchaseType === option.label}
                                onChange={() => setSelectedPurchaseType(option.label)}
                                className="accent-blue-600"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>


                <button
                    onClick={handleAddToCart}
                    className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded text-base font-bold transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    )
}
