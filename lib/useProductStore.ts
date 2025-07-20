import { create } from 'zustand'
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

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

type ProductStore = {
    products: Product[]
    isLoading: boolean
    loadProducts: () => Promise<void>
    deleteProduct: (id: string) => Promise<void>
    deleteVariant: (productId: string, index: number) => Promise<void>
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    isLoading: false,

    loadProducts: async () => {
        set({ isLoading: true })
        const snapshot = await getDocs(collection(db, 'products'))
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[]
        set({ products, isLoading: false })
    },

    deleteProduct: async (id) => {
        await deleteDoc(doc(db, 'products', id))
        set(state => ({
            products: state.products.filter(p => p.id !== id),
        }))
    },

    deleteVariant: async (productId, index) => {
        const product = get().products.find(p => p.id === productId)
        if (!product) return
        const updatedVariants = product.variants.filter((_, i) => i !== index)
        await updateDoc(doc(db, 'products', productId), { variants: updatedVariants })
        set(state => ({
            products: state.products.map(p =>
                p.id === productId ? { ...p, variants: updatedVariants } : p
            )
        }))
    },
}))
