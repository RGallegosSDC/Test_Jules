import { UserRole } from '@prisma/client';
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: UserRole;
      clientId: string | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: UserRole;
    clientId: string | null;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and sent to the `Session` callback */
  interface JWT {
    id: string;
    role: UserRole;
    clientId: string | null;
  }
}