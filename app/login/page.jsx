"use client";

import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await signIn("credentials", {
                redirect: false,
                email: email,
                password: password,
            });

            if (response.ok) {
                router.push("/");
            }

            if (response.error) {
                setError("Invalid email or password. Please try again!");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loginWithGoogle = () => {
        signIn("google", { callbackUrl: "/" });
    };

    const inputStyle = "w-full bg-black text-center border-b border-gray-500 text-red-200 outline-none";

    return (
        <div className="flex w-screen h-screen items-center justify-center bg-red-100 overflow-x-hidden">
            <img
                src="/assets/login.jpg"
                alt="register"
                className="w-[550px] h-[550px] hidden md:block"
            />
            <div className="flex flex-col items-center justify-center md:w-2/5 rounded-md md:rounded-none md:rounded-r-2xl gap-5 h-[550px] bg-black">
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-full px-2 md:px-20 gap-5">
                    <input
                        placeholder="Email"
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputStyle}
                        required
                        autoComplete="email"
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputStyle}
                        required
                        autoComplete="current-password"
                    />
                    {error && <p className="text-red-500">{error}</p>}

                    <button type="submit" className="text-white px-20 rounded-md hover:shadow-md hover:shadow-red-200 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        login
                    </button>
                </form>
                <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="text-white px-3 py-3 rounded-md hover:shadow-md hover:shadow-red-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center gap-2"
                >
                    <p>Log In with Google</p>
                    <FcGoogle />
                </button>
                <Link href="/register" className="text-white px-10">Don't have an account? Sign In Here</Link>
            </div>
        </div>
    );
};

export default Login;
