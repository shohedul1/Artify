"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import WorkList from "../../components/WorkList/WorkList";
// import "@styles/Shop.scss"

const Shop = () => {
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const loggedInUserId = session?.user?._id;

  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  const [workList, setWorkList] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const getWorkList = async () => {
      const response = await fetch(`api/user/${profileId}/shop`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setWorkList(data.workList);
      setProfile(data.user);
      setLoading(false);
    };

    if (profileId) {
      getWorkList();
    }
  }, [profileId]);

  return loading ? <Loader /> : (
    <>
      <Navbar />

      {loggedInUserId === profileId && (
        <h1 className="title-list">Your Works</h1>
      )}

      {loggedInUserId !== profileId && (
        <h1 className="title-list">{profile.username}'s Works</h1>
      )}

      <WorkList data={workList}/>
    </>
  );
};

export default Shop;