'use client';

import React, { useState } from 'react';
import Form from "../../components/Form/Form.jsx"

const CreateWork = () => {
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
                type="Create"
                work={work}
                setWork={setWork}
            />
        </>
    )
}

export default CreateWork