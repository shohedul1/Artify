import NextAuth from "next-auth"
import { authOptions } from "../../../../lib/authOption/authOption"

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }