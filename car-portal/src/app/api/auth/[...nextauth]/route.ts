import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthOptions } from 'next-auth';

import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
  // Use Prisma to store sessions, users, etc.
  // We are using JWT strategy, so adapter is not strictly needed for session storage,
  // but it's good practice to have it for account linking in the future.
  adapter: PrismaAdapter(prisma as PrismaClient),

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'john.doe@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && await bcrypt.compare(credentials.password, user.password)) {
          // Return a user object that will be encoded in the JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            clientId: user.clientId,
          };
        } else {
          // If you return null then an error will be displayed
          return null;
        }
      },
    }),
  ],

  // Use JWT for session management
  session: {
    strategy: 'jwt',
  },

  // Callbacks are used to control what happens when an action is performed.
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    async jwt({ token, user }) {
      // On initial sign in, `user` object is available.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.clientId = user.clientId;
      }
      return token;
    },
    async session({ session, token }) {
      // We are adding the custom properties from the token to the session object.
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.clientId = token.clientId;
      }
      return session;
    },
  },

  // Specify pages to override the default NextAuth pages
  pages: {
    signIn: '/auth/signin', // We will create this page later
  },

  // Secret for JWT signing and encryption.
  // It's automatically read from the NEXTAUTH_SECRET environment variable.
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };