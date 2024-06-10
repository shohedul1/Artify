"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CiEdit } from "react-icons/ci";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";





const WorkDetails = () => {
    const [loading, setLoading] = useState(true);
    const [work, setWork] = useState({});

    const searchParams = useSearchParams();
    const workId = searchParams.get("id");

    /* GET WORK DETAILS */
    useEffect(() => {
        const getWorkDetails = async () => {
            const response = await fetch(`api/work/${workId}`, {
                method: "GET",
            });
            const data = await response.json();
            setWork(data);
            setLoading(false);
        };

        if (workId) {
            getWorkDetails();
        }
    }, [workId]);

    const { data: session, update } = useSession();

    const userId = session?.user?._id;

    /* SLIDER FOR PHOTOS */
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNextSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex + 1) % work.workPhotoPaths.length
        );
    };

    const goToPrevSlide = () => {
        setCurrentIndex(
            (prevIndex) =>
                (prevIndex - 1 + work.workPhotoPaths.length) %
                work.workPhotoPaths.length
        );
    };

    /* SHOW MORE PHOTOS */
    const [visiblePhotos, setVisiblePhotos] = useState(5);

    const loadMorePhotos = () => {
        setVisiblePhotos(work.workPhotoPaths.length);
    };

    /* SELECT PHOTO TO SHOW */
    const [selectedPhoto, setSelectedPhoto] = useState(0);

    const handleSelectedPhoto = (index) => {
        setSelectedPhoto(index);
        setCurrentIndex(index);
    };

    const router = useRouter();

    /* ADD TO WISHLIST */
    const wishlist = session?.user?.wishlist;

    const isLiked = wishlist?.find((item) => item?._id === work._id);

    const patchWishlist = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        const response = await fetch(`api/user/${userId}/wishlist/${work._id}`, {
            method: "PATCH",
        });
        const data = await response.json();
        update({ user: { wishlist: data.wishlist } }); // update session
    };

    /* ADD TO CART */
    const cart = session?.user?.cart;

    const isInCart = cart?.find((item) => item?.workId === workId);

    const addToCart = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        const newCartItem = {
            workId,
            image: work.workPhotoPaths[0],
            title: work.title,
            category: work.category,
            creator: work.creator,
            price: work.price,
            quantity: 1,
        };

        if (!isInCart) {
            const newCart = [...cart, newCartItem];

            try {
                await fetch(`/api/user/${userId}/cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ cart: newCart }),
                });
                update({ user: { cart: newCart } });
            } catch (err) {
                console.log(err);
            }
        } else {
            confirm("This item is already in your cart");
            return;
        }
    };

    console.log(session?.user?.cart);

    return loading ? (
        <Loader />
    ) : (
        <>
            <Navbar />
            <div className="pt-10 px-20 pb-30 xl:pt-10 xl:px-20 xl:pb-30">
                <div className="flex justify-between items-center sm:flex-col sm:items-start sm:gap-2.5">
                    <h1 className="text-xl">{work.title}</h1>
                    {work?.creator?._id === userId ? (
                        <div
                            className="flex items-center gap-2.5 cursor-pointer"
                            onClick={() => {
                                router.push(`/update-work?id=${workId}`);
                            }}
                        >
                            <CiEdit />
                            <p className="text-xl font-bold	m-0 hover:text-red-500">Edit</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5 cursor-pointer" onClick={patchWishlist}>
                            {isLiked ? (
                                <MdFavorite sx={{ color: "red" }} />
                            ) : (
                                <MdFavoriteBorder />
                            )}
                            <p className="text-xl font-bold	m-0 hover:text-red-500">Save</p>
                        </div>
                    )}
                </div>

                <div className="max-w-[800px] overflow-hidden rounded-[10px] my-10">
                    <div
                        className="flex transition-transform duration-500 ease"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {work.workPhotoPaths?.map((photo, index) => (
                            <div className="relative flex-none w-full h-auto flex items-center" key={index}>
                                <img src={photo} alt="work" className="w-full h-full" />
                                <div className="hover:bg-white left-2.5 absolute top-1/2 transform -translate-y-1/2 p-[6px] rounded-full border-none cursor-pointer flex items-center justify-center bg-white/70 z-[99" onClick={(e) => goToPrevSlide(e)}>
                                    <MdArrowBackIosNew sx={{ fontSize: "15px" }} />
                                </div>
                                <div className="absolute bg-white right-2.5 top-1/2 transform -translate-y-1/2 p-[6px] rounded-full border-none cursor-pointer flex items-center justify-center bg-white/70 z-[99" onClick={(e) => goToNextSlide(e)}>
                                    <MdArrowForwardIos sx={{ fontSize: "15px" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2.5 my-5">
                    {work.workPhotoPaths?.slice(0, visiblePhotos).map((photo, index) => (
                        <img
                            src={photo}
                            alt="work-demo"
                            key={index}
                            onClick={() => handleSelectedPhoto(index)}
                            className={`cursor-pointer w-36 h-auto ${selectedPhoto === index ? "border-2 border-black border-solid" : ""}`}
                        />
                    ))}

                    {visiblePhotos < work.workPhotoPaths.length && (
                        <div className="flex flex-col gap-5 items-center justify-center cursor-pointer" onClick={loadMorePhotos}>
                            <MdFavoriteBorder sx={{ fontSize: "40px" }} />
                            Show More
                        </div>
                    )}
                </div>

                <hr className="my-5" />

                <div className="flex gap-5 items-center cursor-pointer">
                    <img
                        src={work.creator.profileImagePath}
                        alt="profile"
                        className="w-16 h-16 rounded-full"
                        onClick={() => router.push(`/shop?id=${work.creator._id}`)}
                    />
                    <h3>Created by {work.creator.username}</h3>
                </div>

                <hr />

                <h3>About this product</h3>
                <p className="max-w-800 my-2">{work.description}</p>

                <h1>${work.price}</h1>
                <button type="submit" onClick={addToCart} className="my-5 px-2 py-3 bg-red-200 rounded-full font-bold hover:shadow-lg flex items-center gap-2 ">
                    <FaShoppingCart />
                    ADD TO CART
                </button>
            </div>
        </>
    );
};

export default WorkDetails;