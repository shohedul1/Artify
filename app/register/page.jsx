"use client";

import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: null,
    });

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: value,
            [name]: name === "profileImage" ? files[0] : value,
        });
    };

    const router = useRouter();

    const [passwordMatch, setPasswordMatch] = useState(true);

    useEffect(() => {
        setPasswordMatch(formData.password === formData.confirmPassword);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const registerForm = new FormData();

            for (var key in formData) {
                registerForm.append(key, formData[key]);
            }

            const response = await fetch("/api/register", {
                method: "POST",
                body: registerForm,
            });

            if (response.ok) {
                router.push("/login");
            }
        } catch (err) {
            console.log("Registration failed", err.message);
        }
    };

    const loginWithGoogle = () => {
        signIn("google", { callbackUrl: "/" });
    };

    const inputStyle = "w-full bg-black text-center border-b border-gray-500 text-red-200 outline-none";

    return (
        <div className="flex w-screen h-screen items-center justify-center bg-red-100 overflow-x-hidden">
            <img
                src="/assets/register.jpg"
                alt="register"
                className="w-[550px] h-[550px] hidden md:block"
            />
            <div className="flex flex-col items-center justify-center md:w-2/5 rounded-md md:rounded-none md:rounded-r-2xl gap-5 h-[550px] bg-black ">
                <form onSubmit={handleSubmit}
                    className="flex flex-col items-center w-full px-2 md:px-20 gap-5 ">
                    <input
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                         autoComplete="username"
                        required
                        className={inputStyle}
                    />
                    <input
                        placeholder="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        name="password"
                        autoComplete="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                    />
                    <input
                        placeholder="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        autoComplete="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                    />
                    {!passwordMatch && (
                        <p style={{ color: "red" }}>Passwords are not matched!</p>
                    )}
                    <input
                        id="image"
                        type="file"
                        name="profileImage"
                        onChange={handleChange}
                        accept="image/*"
                        style={{ display: "none" }}
                        required
                    />
                    <label htmlFor="image" className="flex flex-col pt-2 items-center justify-center gap-2 cursor-pointer text-sm">
                        <img src="/assets/addImage.png" alt="add profile" className="w-5" />
                        <p className="text-white">Upload Profile Photo</p>
                    </label>
                    {formData.profileImage && (
                        <img
                            src={URL.createObjectURL(formData.profileImage)}
                            alt="Profile"
                            style={{ maxWidth: "80px", maxHeight: "100px" }}
                        />
                    )}
                    <button type="submit" disabled={!passwordMatch} className="text-white px-16 rounded-md hover:shadow-md hover:shadow-red-200 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        Register
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
                <Link href="/login" className="text-white">Already have an account? Log In Here</Link>
            </div>
        </div>
    );
};

export default Register;