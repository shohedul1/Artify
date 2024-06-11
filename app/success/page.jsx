import Link from "next/link"

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-lime-500">Payment Successfully</h1>
      <p className="px-20 text-xl">Thank you for your purchase!</p>
      <Link href="/" className="text-red-500">CONTINUE TO SHOPPING</Link>
    </div>
  )
}

export default Success