"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiLogOut } from "react-icons/fi";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Clear any stored session events
            localStorage.removeItem("sessionEvent");

            // Sign out
            await signOut({ redirect: false });

            // Show a toast confirmation
            toast.success("Logged out successfully!");

            // Redirect to home page
            router.push("/");
        } catch (err) {
            console.error("Logout error:", err);
            toast.error("Failed to logout. Try again!");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-1.5 w-full flex items-center gap-1 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
            <FiLogOut className="w-4 h-4" />
            Logout
        </button>
    );
}
