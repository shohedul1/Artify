import WorkCard from "../WorkCard/WorkCard"

const WorkList = ({ data }) => {
    return (
        <div className="flex flex-wrap justify-center gap-[20px] pt-0 px-[40px] pb-[120px] lg:px-[20px]">
            {data.map((work) => (
                <WorkCard
                    key={work._id}
                    work={work}
                />
            ))}
        </div>
    )
}

export default WorkList