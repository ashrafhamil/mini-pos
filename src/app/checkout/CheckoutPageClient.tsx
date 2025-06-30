'use client'

import { useCartStore } from "../../../lib/useCartStore"
import Image from "next/image"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function CheckoutPageClient() {
    const items = useCartStore((state) => state.items)
    const clearCart = useCartStore((state) => state.clearCart)
    const removeFromCart = useCartStore((state) => state.removeFromCart)
    const placeOrder = useCartStore((state) => state.placeOrder)
    const router = useRouter()
    const searchParams = useSearchParams()
    const paymentStatus = searchParams.get('payment')
    const hasRun = useRef(false)

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true

        if (paymentStatus === 'success') {
            if (items.length > 0) {
                placeOrder()
                clearCart()
                alert('✅ Payment successful. Order placed!')
            } else {
                alert('⚠️ No items in cart to place order.')
            }
            router.replace('/checkout')
        } else if (paymentStatus === 'failed') {
            alert('❌ Payment failed.')
            router.replace('/checkout')
        }
    }, [paymentStatus, placeOrder, clearCart, router, items])

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
                <p>Your cart is empty 🛒</p>
                <button
                    onClick={() => router.push('/products')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold transition cursor-pointer"
                >
                    Add Product
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>

            <div className="space-y-6">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow flex gap-4 justify-between">
                        <Image
                            src={item.image}
                            alt={item.name}
                            width={128}
                            height={96}
                            className="rounded object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">Storage: {item.storage}</p>
                            <p className="text-sm text-gray-600">Color: {item.color}</p>
                            <p className="text-sm text-gray-600">Package: {item.purchaseType}</p>
                            <p className="text-blue-600 font-semibold mt-2">RM {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-start">
                            <button
                                onClick={() => removeFromCart(item)}
                                className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded cursor-pointer"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-right">
                <p className="text-lg font-bold text-gray-800">
                    Total: RM {items.reduce((total, item) => total + item.price, 0).toFixed(2)}
                </p>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={clearCart}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium cursor-pointer"
                >
                    Clear Cart
                </button>
                <button
                    onClick={() => router.push('/payment')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium cursor-pointer"
                >
                    Place Order
                </button>
            </div>
        </div>
    )
}
