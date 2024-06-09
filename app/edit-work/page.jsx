'use client';

import React, { useState } from 'react';
import Form from "../../components/Form/Form.jsx"

const EditWork = () => {
    const [work, setWork] = useState({
        creator: "",
        category: "",
        title: "",
        description: "",
        price: "",
        photos: []
    })
    return (
        <>
            <Form
                type="Edit"
                work={work}
                setWork={setWork}
            />
        </>
    )
}

export default EditWork