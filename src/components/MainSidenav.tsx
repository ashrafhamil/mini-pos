'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function MainSidenav() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const links = [
        { label: 'Landing Page', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Checkout', href: '/checkout' },
    ]

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed top-4 right-4 z-50 bg-white border p-2 rounded shadow"
            >
                ☰
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 right-0 h-full w-64 bg-white border-l shadow z-40 p-6 space-y-4 transform transition-transform
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <h1 className="text-lg font-bold mb-6">MiniPOS™</h1>

                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-3 py-2 rounded text-sm hover:bg-gray-100 ${pathname === link.href ? 'text-blue-600 font-semibold' : 'text-gray-700'
                            }`}
                        onClick={() => setOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
            </aside>

            {/* Background overlay (click to close) */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-transparent z-30"
                />
            )}
        </>
    )
}
