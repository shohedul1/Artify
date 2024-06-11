"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import Form from "../../components/Form/Form";

const UpdateWorkContent = () => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const workId = searchParams.get("id");

  const [work, setWork] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    photos: [],
  });

  useEffect(() => {
    const getWorkDetails = async () => {
      const response = await fetch(`api/work/${workId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setWork({
        category: data.category,
        title: data.title,
        description: data.description,
        price: data.price,
        photos: data.workPhotoPaths,
      });

      setLoading(false);
    };

    if (workId) {
      getWorkDetails();
    }
  }, [workId]);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updateFormWork = new FormData();

      for (var key in work) {
        updateFormWork.append(key, work[key]);
      }

      work.photos.forEach((photo) => {
        updateFormWork.append("workPhotoPaths", photo);
      });

      const response = await fetch(`/api/work/${workId}`, {
        method: "PATCH",
        body: updateFormWork,
      });

      if (response.ok) {
        router.push(`/shop?id=${session?.user?._id}`);
      }
    } catch (err) {
      console.log("Publish Work failed", err.message);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <Form
        type="Edit"
        work={work}
        setWork={setWork}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

const UpdateWork = () => {
  return (
    <Suspense fallback={<Loader />}>
      <UpdateWorkContent />
    </Suspense>
  );
};

export default UpdateWork;
