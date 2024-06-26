import User from "../../../../../../lib/models/User.js";
import Work from "../../../../../../lib/models/Work.js";
import connect from "../../../../../../lib/mongdb/database.js"

export const PATCH = async (req, { params }) => {
    try {
        await connect();
        const userId = params.id;
        const workId = params.workId;

        const user = await User.findById(userId);
        const work = await Work.findById(workId).populate("creator");

        const favoriteWork = user.wishlist.find((item) => item._id.toString() === workId)

        if (favoriteWork) {
            user.wishlist = user.wishlist.filter((item) => item._id.toString() !== workId);
            await user.save()
            return new Response(JSON.stringify({ message: "Work removed from wishlist", wishlist: user.wishlist }), { status: 200 });
        } else {
            user.wishlist.push(work);
            await user.save()
            return new Response(JSON.stringify({ message: "Work added to wishlist", wishlist: user.wishlist }), { status: 200 });
        }
    } catch (err) {
        console.log(err)
        return new Response("Failed to patch work to wishlist", { status: 500 })
    }
}