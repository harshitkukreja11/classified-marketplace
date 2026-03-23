import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},

      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("No user");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Wrong password");

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: { signIn: "/login" },

  secret: process.env.NEXTAUTH_SECRET,

  // ✅ ADD THIS BLOCK
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // store user id in token
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id; // expose it in session
      return session;
    },
  },
};