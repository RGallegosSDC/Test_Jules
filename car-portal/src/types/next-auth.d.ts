import { UserRole } from '@prisma/client';
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Devuelto por `useSession`, `getSession` y recibido como prop en el Contexto de React `SessionProvider`
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
  /** Devuelto por el callback `jwt` y enviado al callback `Session` */
  interface JWT {
    id: string;
    role: UserRole;
    clientId: string | null;
  }
}