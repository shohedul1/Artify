"use client"
import { MdMenu } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { MdShoppingCart } from "react-icons/md";
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from "next/navigation"

const Navbar = () => {
    const { data: session } = useSession()
    const user = session?.user
  
    const [dropdownMenu, setDropdownMenu] = useState(false)
  
    const handleLogout = async () => {
      signOut({ callbackUrl: '/login' })
    }
  
    const [query, setQuery] = useState('')
   
    const router = useRouter()
    const searchWork = async () => {
      router.push(`/search/${query}`)
    }
  
    const cart = user?.cart

    return (
        <div className='px-20 border-b border-gray-500 py-3 flex justify-between  items-center relative p-2.5 '>
            <Link href="/">
                <img src='/assets/logo.png' alt='logo' className="w-20 cursor-pointer" />
            </Link>

            <div className='border border-gray-200 rounded-md  p-5  items-center gap-10 hidden md:flex'>
                <input type='text' placeholder='Search...' className="outline-none" value={query} onChange={(e) => setQuery(e.target.value)} />
                <CiSearch size={20} onClick={searchWork} />
            </div>

            <div className='flex items-center gap-5'>
                <div>
                    {user && (
                        <Link href="/cart" className="m-0 border flex items-center gap-1">
                            <MdShoppingCart sx={{ color: "gray" }} />
                            Cart <span>({cart?.length})</span>
                        </Link>
                    )}
                </div>


                <button className='flex items-center gap-2.5 bg-white cursor-pointer' onClick={() => setDropdownMenu(!dropdownMenu)}>
                    {!user ? (
                        <IoPersonCircleOutline size={40} />
                    ) : (
                        <img src={user.profileImagePath} alt='profile' className="w-10" style={{ objectFit: "cover", borderRadius: "50%" }} />
                    )}
                </button>



                {dropdownMenu && !user && (
                    <div className='absolute right-20 top-24 flex flex-col rounded-md shadow-2xl border p-5 items-start text-black font-bold gap- bg-white'>
                        <Link className="hover:text-red-500" href="/login">Log In</Link>
                        <Link className="hover:text-red-500" href="/register">Sign Up</Link>
                    </div>
                )}

                {dropdownMenu && user && (
                    <div className='absolute right-2 top-24 flex flex-col rounded-md shadow-2xl border p-5 z-50 items-start text-black font-bold gap- bg-white'>
                        <Link onClick={() => setDropdownMenu(!dropdownMenu)} className="hover:text-red-500" href="/wishlist">Wishlist</Link>
                        <Link onClick={() => setDropdownMenu(!dropdownMenu)} className="hover:text-red-500" href="/cart">Cart</Link>
                        <Link onClick={() => setDropdownMenu(!dropdownMenu)} className="hover:text-red-500" href="/order">Orders</Link>
                        <Link onClick={() => setDropdownMenu(!dropdownMenu)} className="hover:text-red-500" href={`/shop?id=${user._id}`}>Your Shop</Link>
                        <Link onClick={() => setDropdownMenu(!dropdownMenu)} className="hover:text-red-500" href="/create-work">Sell Your Work</Link>
                        <button className="hover:text-red-500" onClick={handleLogout}>Log Out</button>
                    </div>
                )}


            </div>

        </div>
    )
}

export default Navbar