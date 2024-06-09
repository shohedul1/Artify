"use client";

import { categories } from "../../lib/CategoriesData/data.js"
import { useEffect, useState } from "react";
import WorkList from "../WorkList/WorkList.jsx";
import Loader from "../Loader/Loader.jsx";

const Feed = () => {
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("All");

    const [workList, setWorkList] = useState([]);

    const getWorkList = async () => {
        const response = await fetch(`/api/work/list/${selectedCategory}`);
        const data = await response.json();
        setWorkList(data);
        setLoading(false);
    };

    useEffect(() => {
        getWorkList();
    }, [selectedCategory]);

    return loading ? (
        <Loader />
    ) : (
        <>
            <div className="flex flex-wrap items-center justify-center gap-[50px] py-[20px] px-[30px] mb-[60px] border border-y border-black">
                {categories?.map((item, index) => (
                    <p
                        onClick={() => setSelectedCategory(item)}
                        className={`font-semibold text-xl cursor-pointer hover:text-red-500 ${item === selectedCategory ? "text-red-500" : ""}`}
                        key={index}
                    >
                        {item}
                    </p>
                ))}
            </div>

            <WorkList data={workList} />
        </>
    );
};

export default Feed;