"use client";

import Link from "next/link";
import React from "react";
import {usePathname} from "next/navigation";

export default function NavLink({label, path}: Readonly<{
    label: string; path: string;
}>) {
    const pathname = usePathname();

    return (
        <Link className={`nav-link ${pathname === path && "nav-link-active"}`} href={path}>
            {label}
        </Link>
    );
}