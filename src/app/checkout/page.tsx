import { Suspense } from 'react'
import CheckoutPageClient from './CheckoutPageClient'

export default function CheckoutPage() {
    return (
        // use suspense to handle useSearchParams
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutPageClient />
        </Suspense>
    )
}
