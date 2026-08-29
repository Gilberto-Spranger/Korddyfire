"use client";
import { FaShoppingBag, FaShoppingCart, FaChartBar, FaHome, FaSignOutAlt, FaCog, FaUser } from "react-icons/fa";
import { useSidebar } from "@/context/sidebarcontext";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const router = useRouter();
    const { showSidebar } = useSidebar();
    const { logout } = useAuth();

    const navigate = (path: string) => {
        router.push(path);
    };

    return (
        <div
            className={`fixed left-0 top-0 w-85 h-screen shadow-md z-99 border-r border-gray-400 bg-gray-900 transition-transform duration-300 ease-in-out
                ${showSidebar ? "translate-x-0" : "-translate-x-full"} overflow-y-scroll scrollbar-none`}
        >
            <nav>
                <div className="w-full">
                    <h1 className="text-2xl font-bold text-white text-center py-6 w-full flex justify-center ">
                        <button onClick={() => navigate("/home")} className="text-center">Korddyfire</button>
                    </h1>
                    <button onClick={() => navigate("/home")} className="flex items-center gap-8 w-full text-left px-6 py-4 text-white hover:bg-gray-800 transition cursor-pointer">
                        <FaHome size={25} /> Home
                    </button>
                    <button onClick={() => navigate("/user/profile")} className="flex items-center gap-8 w-full text-left px-6 py-4 text-white hover:bg-gray-800 transition cursor-pointer">
                        <FaUser size={25} /> Profile
                    </button>
                    <button onClick={() => navigate("/seller_dashboard")} className="flex items-center gap-8 w-full text-left px-6 py-4 text-white hover:bg-gray-800 transition cursor-pointer">
                        <FaChartBar size={25} /> Seller Dashboard
                    </button>
                    <button onClick={() => navigate("/cart")} className="flex items-center gap-8 w-full text-left px-6 py-4 text-white hover:bg-gray-800 transition cursor-pointer">
                        <FaShoppingCart size={25} /> Cart
                    </button>
                    <button onClick={() => navigate("/shopping")} className="flex items-center gap-8 w-full text-left px-6 py-4 text-white hover:bg-gray-800 transition cursor-pointer">
                        <FaShoppingBag size={25} /> Shopping
                    </button>
                    <button onClick={() => navigate("/settings")} className="flex items-center gap-8 w-full text-left px-6 py-4 text-white hover:bg-gray-800 transition cursor-pointer">
                        <FaCog size={25} /> Settings
                    </button>
                    <button
                        className="flex items-center gap-8 w-full text-left px-6 py-4 text-white hover:bg-gray-800 transition cursor-pointer"
                        onClick={() => { logout(); router.push("/signin"); }}>
                        <FaSignOutAlt size={25} /> Sign Out
                    </button>
                </div>
            </nav>
        </div>
    );
}
