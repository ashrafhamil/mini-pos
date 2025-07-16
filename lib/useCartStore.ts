import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
    id: string
    name: string
    storage: string
    color: string
    purchaseType: string
    price: number
    image: string
}

type CartState = {
    items: CartItem[]
    orders: CartItem[][]
    addToCart: (item: CartItem) => void
    removeFromCart: (item: CartItem) => void
    clearCart: () => void
    placeOrder: () => void
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            orders: [],

            addToCart: (item) =>
                set((state) => ({
                    items: [...state.items, item],
                })),

            removeFromCart: (target) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            !(
                                item.id === target.id &&
                                item.storage === target.storage &&
                                item.color === target.color &&
                                item.purchaseType === target.purchaseType
                            )
                    ),
                })),

            clearCart: () => set({ items: [] }),

            placeOrder: () =>
                set((state) => ({
                    orders: [...state.orders, state.items],
                    items: [],
                })),
        }),
        {
            name: 'cart-storage',
        }
    )
)



// Debug access in browser
if (typeof window !== 'undefined') {
    // @ts-expect-error exposing to browser for dev debug
    window.__ZUSTAND_CART_STORE__ = useCartStore
}
//contoh: paste this in browser console __ZUSTAND_CART_STORE__.getState().items