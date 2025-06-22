'use client'

import { useCartStore } from "../../../lib/useCartStore"
import Image from "next/image"

export default function CheckoutPage() {
    const items = useCartStore((state) => state.items)
    const clearCart = useCartStore((state) => state.clearCart)
    const removeFromCart = useCartStore((state) => state.removeFromCart)
    const placeOrder = useCartStore((state) => state.placeOrder)

    const orders = useCartStore((state) => state.orders)
    console.log('📦 Past Orders:', orders)

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Your cart is empty 🛒
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>

            <div className="space-y-6">
                {items.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow flex gap-4 justify-between">
                        {/* <img src={item.image} alt={item.name} className="w-32 h-24 object-cover rounded" /> */}
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
                                className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    </div>

                ))}
            </div>

            <div className="mt-8 text-right">
                <p className="text-lg font-bold text-gray-800">
                    Total: RM{' '}
                    {items.reduce((total, item) => total + item.price, 0).toFixed(2)}
                </p>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={clearCart}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
                >
                    Clear Cart
                </button>
                <button
                    onClick={() => {
                        placeOrder()
                        alert('✅ Order placed!')
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
                >
                    Place Order
                </button>
            </div>



        </div>
    )
}
