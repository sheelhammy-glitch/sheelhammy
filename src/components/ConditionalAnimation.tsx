"use client";
import { usePathname } from 'next/navigation';
import React from 'react'
import LenisScroll from './lenis-scroll';
export default function ConditionalAnimation({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const isAdmin = pathname.includes('/admin');
    const isDashboard = pathname.includes('/dashboard');

    if (isAdmin || isDashboard) {
        return (
            <div>{children}</div>
        )
    } else {
        return (
            <div>
                <LenisScroll />
                {children}</div >
        )
    }
}
