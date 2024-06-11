import connect from "../../../../../lib/mongdb/database.js";
import User from "../../../../../lib/models/User.js";


export const POST = async (req, { params }) => {
    try {
        const { cart } = await req.json()
        await connect()
        const userId = params.id
        const user = await User.findById(userId)
        user.cart = cart
        await user.save()
        return new Response(JSON.stringify(user.cart), { status: 200 })
    } catch (err) {
        console.log(err)
        return new Response("Failed to update card", { status: 500 })
    }
}