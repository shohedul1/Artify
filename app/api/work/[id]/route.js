import connect from "../../../../lib/mongdb/database.js";
import Work from "../../../../lib/models/Work.js";
import { writeFile } from 'fs/promises';
import path from 'path';

export const GET = async (req, { params }) => {
    try {
        await connect();

        const work = await Work.findById(params.id).populate("creator");

        if (!work) return new Response("The Work Not Found", { status: 404 });

        return new Response(JSON.stringify(work), { status: 200 });
    } catch (err) {
        console.error("Error fetching the Work:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
};

export const PATCH = async (req, { params }) => {
    try {
        await connect();

        const data = await req.formData();

        const category = data.get("category");
        const title = data.get("title");
        const description = data.get("description");
        const price = data.get("price");

        const photos = data.getAll("workPhotoPaths");

        const workPhotoPaths = [];

        for (const photo of photos) {
            if (photo instanceof File) {
                const bytes = await photo.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const uniqueFilename = `${Date.now()}-${photo.name}`;
                const workImagePath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename);

                await writeFile(workImagePath, buffer);

                workPhotoPaths.push(`/uploads/${uniqueFilename}`);
            } else {
                workPhotoPaths.push(photo);
            }
        }

        const existingWork = await Work.findById(params.id);

        if (!existingWork) {
            return new Response("The Work Not Found", { status: 404 });
        }

        existingWork.category = category;
        existingWork.title = title;
        existingWork.description = description;
        existingWork.price = price;
        existingWork.workPhotoPaths = workPhotoPaths;

        await existingWork.save();

        return new Response("Successfully updated the Work", { status: 200 });
    } catch (err) {
        console.error("Error updating the Work:", err);
        return new Response("Error updating the Work", { status: 500 });
    }
};

export const DELETE = async (req, { params }) => {
    try {
        await connect();
        await Work.findByIdAndDelete(params.id);

        return new Response("Successfully deleted the Work", { status: 200 });
    } catch (err) {
        console.error("Error deleting the Work:", err);
        return new Response("Error deleting the Work", { status: 500 });
    }
};
