import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./lib/zod";
import { comparePassword } from "./utils/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials using the signInSchema (likely includes email and password)
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Fetch user from the database by email
          const user = await prisma.user.findUnique({
            where: { email },

            include: {
              role: true,
            },
          });

          if (!user) {
            // If no user is found, return null
            return null;
          }

          // Compare the provided password with the hashed password stored in the database
          if (!user.password) {
            // If the user doesn't have a password, return null
            return null;
          }
          const isPasswordValid = comparePassword(password, user.password);

          if (!isPasswordValid) {
            // If the password is incorrect, return null
            return null;
          }
          // Return the user object if authentication is successful
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Handle Zod validation errors
            console.error("Validation failed:", error.errors);
          } else {
            // Handle any other errors
            console.error("Authentication error:", error);
          }
          return null; // Return null to indicate failed authentication
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          notificationToken: token.notificationToken,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.notificationToken = user.notificationToken;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
