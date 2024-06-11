"use client";

import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdOutlineArrowCircleLeft } from "react-icons/md";
import { useSession } from "next-auth/react";
import getStripe from "../../lib/getStripe/getStripe.js";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import Link from "next/link";

const Cart = () => {
  const { data: session, update } = useSession();
  const cart = session?.user?.cart;
  const userId = session?.user?._id;

  const updateCart = async (cart) => {
    const response = await fetch(`/api/user/${userId}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });
    const data = await response.json();
    update({ user: { cart: data } });
  };

  const calcSubtotal = (cart) => {
    return cart?.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const increaseQty = (cartItem) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem) {
        item.quantity += 1;
        return item;
      } else return item;
    });
    updateCart(newCart);
  };

  const decreaseQty = (cartItem) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem && item.quantity > 1) {
        item.quantity -= 1;
        return item;
      } else return item;
    });
    updateCart(newCart);
  };

  const removeFromCart = (cartItem) => {
    const newCart = cart.filter((item) => item.workId !== cartItem.workId);
    updateCart(newCart);
  };

  const subtotal = calcSubtotal(cart);

  const handleCheckout = async () => {
    const stripe = await getStripe()

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart, userId }),
    })

    if (response.statusCode === 500) {
      return
    }

    const data = await response.json()

    toast.loading("Redirecting to checkout...")

    const result = stripe.redirectToCheckout({ sessionId: data.id })

    if (result.error) {
      console.log(result.error.message)
      toast.error("Something went wrong")
    }
  }

  return !session?.user?.cart ? <Loader /> : (
    <>
      <Navbar />
      <div className="flex justify-center items-center my-10 w-full px-5 md:px-40 ">
        <div className="flex flex-col bg-gray-200 w-full p-5">
          <div className="flex flex-col items-center gap-5 pb-2">
            <h1 className="text-xl font-bold">Your Cart</h1>
            <h2 className="text-gray-500">
              Subtotal: <span className="text-gray-600">${subtotal}</span>
            </h2>
          </div>

          {cart?.length === 0 && <h3>Empty Cart</h3>}

          {cart?.length > 0 && (
            <div className="flex flex-col gap-8">
              {cart?.map((item, index) => (
                <div className="flex items-center flex-col md:flex-row" key={index}>
                  <div className="flex gap-20 flex-col md:flex-row items-center text-xs">
                    <img src={item.image} alt="product" className="w-40 h-40 rounded-md"/>
                    <div className="flex flex-col gap-5">
                      <h3 className="text-base">{item.title}</h3>
                      <p className="text-base font-bold">Category: {item.category}</p>
                      <p className="text-base text-lime-500 font-bold">Seller: {item.creator.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <IoIosAddCircleOutline
                      onClick={() => increaseQty(item)}
                      sx={{
                        fontSize: "18px",
                        color: "grey",
                        cursor: "pointer",
                      }}
                    />
                    <h3>{item.quantity}</h3>
                    <IoIosRemoveCircleOutline
                      onClick={() => decreaseQty(item)}
                      sx={{
                        fontSize: "18px",
                        color: "grey",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-center items-center gap-2">
                    <h2>${item.quantity * item.price}</h2>
                    <p>${item.price} / each</p>
                  </div>

                  <div className="remove">
                    <MdDelete
                    size={24}
                    className="hover:text-red-400"
                      sx={{ cursor: "pointer" }}
                      onClick={() => removeFromCart(item)}
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-5">
                <Link href="/" className="flex gap-1 hover:text-red-500">
                  <MdOutlineArrowCircleLeft size={24}  /> Continue Shopping
                </Link>
                <button className="px-2 py-2 bg-lime-500" onClick={handleCheckout}>CHECK OUT NOW</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;