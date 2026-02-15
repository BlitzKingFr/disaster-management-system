"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Home Page/Navbar";
import Footer from "./Home Page/Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide navbar and footer on Dashboard page
    const isDashboard = pathname === "/NavPages/Dashboard";

    return (
        <>
            {!isDashboard && <Navbar />}
            {children}
            {!isDashboard && <Footer />}
        </>
    );
}
