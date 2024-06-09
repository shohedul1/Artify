
'use client';


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";






const WorkCard = ({ work }) => {
    // console.log(work);
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

    const router = useRouter();

    /* DELETE WORK */
    const handleDelete = async () => {
        const hasConfirmed = confirm("Are you sure you want to delete this work?");

        if (hasConfirmed) {
            try {
                await fetch(`api/work/${work._id}`, {
                    method: "DELETE",
                });
                window.location.reload();
            } catch (err) {
                console.log(err);
            }
        }
    };

    const { data: session, update } = useSession();
    const userId = session?.user?._id;

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

    return (
        <div
            className="relative cursor-pointer p-[10px] rounded-[10px] hover:shadow"
            onClick={() => {
                router.push(`/work-details?id=${work._id}`);
            }}
        >
            <div className="w-[360px] overflow-hidden rounded-[10px] mb-[10px]">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {work.workPhotoPaths?.map((photo, index) => (
                        <div className="relative flex-none w-full h-[270px] flex items-center" key={index}>
                            <img src={photo} alt="work" className="w-full h-full" />
                            <div
                                className="absolute hover:bg-white left-10 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full border-0 cursor-pointer flex items-center justify-center bg-white bg-opacity-70 z-99"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevSlide(e);
                                }}
                            >
                                <MdArrowBackIosNew sx={{ fontSize: "15px " }} />
                            </div>
                            <div
                                className="absolute hover:bg-white right-10 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full border-0 cursor-pointer flex items-center justify-center bg-white bg-opacity-70 z-99"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNextSlide(e);
                                }}
                            >
                                <MdArrowForwardIos sx={{ fontSize: "15px" }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center my-4">
                <div>
                    <h3 className="text-base mb-1.5">{work.title}</h3>
                    <div className="flex items-center gap-1.5">
                        <img src={work.creator.profileImagePath} alt="creator" className="w-10 h-10 rounded-full" />
                        <span className="text-sm font-semibold">{work.creator.username}</span> in <span>{work.category}</span>
                    </div>
                </div>
                <div className="bg-blue-500 p-2 rounded-2xl font-semibold text-base">${work.price}</div>
            </div>

            {userId === work?.creator._id ? (
                <div
                    className="absolute right-5 top-5 border-0 text-lg cursor-pointer z-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                >
                    <MdDelete
                        sx={{
                            borderRadius: "50%",
                            backgroundColor: "white",
                            padding: "5px",
                            fontSize: "30px",
                        }}
                    />
                </div>
            ) : (
                <div
                    className="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        patchWishlist();
                    }}
                >
                    {isLiked ? (
                        <MdFavorite
                            sx={{
                                borderRadius: "50%",
                                backgroundColor: "white",
                                color: "red",
                                padding: "5px",
                                fontSize: "30px",
                            }}
                        />
                    ) : (
                        <MdFavoriteBorder
                            sx={{
                                borderRadius: "50%",
                                backgroundColor: "white",
                                padding: "5px",
                                fontSize: "30px",
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default WorkCard;