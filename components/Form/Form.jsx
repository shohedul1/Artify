import { categories } from "../../lib/CategoriesData/data.js";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";

const Form = ({ type, work, setWork }) => {
    const handleUploadPhotos = (e) => {
        const newPhotos = e.target.files;
        setWork((prevWork) => {
            return {
                ...prevWork,
                photos: [...prevWork.photos, ...newPhotos],
            };
        });
    };

    const handleRemovePhoto = (indexToRemove) => {
        setWork((prevWork) => {
            return {
                ...prevWork,
                photos: prevWork.photos.filter((_, index) => index !== indexToRemove),
            };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWork((prevWork) => {
            return {
                ...prevWork,
                [name]: value,
            };
        });
    };

    return (
        <div className="bg-lime-200 md:px-20 py-10 min-h-screen">
            <h1 className="text-2xl font-bold">{type} Your Work</h1>
            <form className="bg-white p-5 rounded-md ">
                <h3>Which of these categories best describes your work?</h3>
                <div className="my-5 mb-10 flex flex-wrap gap-10">
                    {categories?.map((item, index) => (
                        <p
                            key={index}
                            className={`${work.category === item ? "text-red-500" : ""} font-medium text-base cursor-pointer hover:text-red-500`}
                            onClick={() => {
                                setWork({ ...work, category: item });
                            }}
                        >
                            {item}
                        </p>
                    ))}
                </div>
                <h3>Add some photos of your work</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {work.photos.length === 0 && (
                        <div className="flex flex-col items-center justify-center w-full h-40 cursor-pointer border border-dashed border-red-500">
                            <input
                                id="image"
                                type="file"
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleUploadPhotos}
                                multiple
                            />
                            <label htmlFor="image" className="flex flex-col items-center justify-center cursor-pointer">
                                <IoIosImages size={60} />
                                <p className="font-semibold text-center">Upload from your device</p>
                            </label>
                        </div>
                    )}

                    {work.photos.length > 0 && work.photos.map((photo, index) => (
                        <div key={index} className="relative w-full h-40 cursor-pointer border border-gray-300">
                            <img
                                src={photo instanceof Object ? URL.createObjectURL(photo) : photo}
                                alt="work"
                                className="w-full h-full object-cover"
                            />
                            <button
                                className="absolute top-1 right-1 p-1 bg-white rounded-full text-black hover:text-red-500"
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                            >
                                <BiTrash />
                            </button>
                        </div>
                    ))}

                    {work.photos.length > 0 && (
                        <div className="flex flex-col items-center justify-center w-full h-40 cursor-pointer border border-dashed border-red-500">
                            <input
                                id="image"
                                type="file"
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleUploadPhotos}
                                multiple
                            />
                            <label htmlFor="image" className="flex flex-col items-center justify-center cursor-pointer">
                                <IoIosImages size={60} />
                                <p className="font-semibold text-center">Upload from your device</p>
                            </label>
                        </div>
                    )}
                </div>

                <h3>What makes your work attractive?</h3>
                <div className="description mt-4">
                    <p className="font-medium">Title</p>
                    <input
                        type="text"
                        placeholder="Title"
                        onChange={handleChange}
                        name="title"
                        value={work.title}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    />
                    <p className="font-medium mt-4">Description</p>
                    <textarea
                        placeholder="Description"
                        onChange={handleChange}
                        name="description"
                        value={work.description}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                    />
                    <p className="font-medium mt-4">Now, set your PRICE</p>
                    <div className="flex items-center mt-1">
                        <span className="mr-2">$</span>
                        <input
                            type="number"
                            placeholder="Price"
                            onChange={handleChange}
                            name="price"
                            value={work.price}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <button className="mt-6 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" type="submit">
                    PUBLISH YOUR WORK
                </button>
            </form>
        </div>
    );
};

export default Form;
