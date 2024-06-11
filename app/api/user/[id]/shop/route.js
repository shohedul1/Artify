import User from "../../../../../lib/models/User.js";
import Work from "../../../../../lib/models/Work.js";
import connect from "../../../../../lib/mongdb/database.js"


export const GET = async (req, { params }) => {
    try {
        await connect();

        const user = await User.findById(params.id);
        const workList = await Work.find({ creator: params.id }).populate("creator");

        user.works = workList;
        await user.save();

        return new Response(JSON.stringify({ user: user, workList: workList }), { status: 200 });
    } catch (err) {
        return new Response("Failed to fetch work list by user", { status: 500 })
    }
}