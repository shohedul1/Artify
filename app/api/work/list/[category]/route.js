import Work from "../../../../../lib/models/Work"
import connect from "../../../../../lib/mongdb/database"


// any category data get
export const GET = async (req, { params }) => {
    try {
        await connect()

        const { category } = params

        let workList

        if (category !== "All") {
            workList = await Work.find({ category }).populate("creator")
        } else {
            workList = await Work.find().populate("creator")
        }
        return new Response(JSON.stringify(workList), { status: 200 })
    } catch (err) {
        console.log(err)
        return new Response("Failed to fetch Work List", { status: 500 })
    }
}