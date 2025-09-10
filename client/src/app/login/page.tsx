"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const { status } = useSession();

    useEffect(() => {
        // If the user is already logged in, redirect them to chat page
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading" || status === "authenticated") {
        // Show nothing or a loader while checking session
        return null;
    }

    // Regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password before sending
        if (!passwordRegex.test(password)) {
            toast.error(
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
            );
            return;
        }

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (!res?.error) {
            toast.success("Login successful!");
            router.push("/");
        } else {
            toast.error("Invalid credentials");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100">
            <div className="md:bg-white rounded-2xl md:shadow-2xl p-5 md:p-10 w-full max-w-md">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
                    Welcome Back
                </h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 text-gray-700 font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold p-3 rounded-lg transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Don’t have an account?{" "}
                    <button
                        onClick={() => router.push("/register")}
                        className="text-indigo-600 font-medium hover:underline"
                    >
                        Register here
                    </button>
                </p>
            </div>
        </div>
    );
}
