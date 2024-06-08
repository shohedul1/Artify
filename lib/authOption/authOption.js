import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import connect from "../../lib/mongdb/database";
import User from "../../lib/models/User";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials) {
                if (!credentials.email || !credentials.password) {
                    throw new Error("Invalid Email or Password");
                }

                await connect();

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("Invalid Email or Password");
                }

                const isMatch = await compare(credentials.password, user.password);

                if (!isMatch) {
                    throw new Error("Invalid Email or Password");
                }

                return user;
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async session({ session, token, user }) {
            if (session.user) {
                const sessionUser = await User.findOne({ email: session.user.email });

                if (sessionUser) {
                    session.user.id = sessionUser._id.toString();
                    session.user = { ...session.user, ...sessionUser._doc };
                }
            }

            return session;
        },

        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                try {
                    await connect();

                    let existingUser = await User.findOne({ email: profile.email });

                    if (!existingUser) {
                        existingUser = await User.create({
                            email: profile.email,
                            username: profile.name,
                            profileImagePath: profile.picture,
                            wishlist: [],
                            cart: [],
                            order: [],
                            work: [],
                        });
                    }

                    return true;
                } catch (err) {
                    console.log("Error checking if user exists: ", err.message);
                    return false;
                }
            }

            return true;
        },
    },
};



