import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthOptions } from 'next-auth';

import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
  // Usa Prisma para almacenar sesiones, usuarios, etc.
  // Estamos usando la estrategia JWT, por lo que el adaptador no es estrictamente necesario para el almacenamiento de sesiones,
  // pero es una buena práctica tenerlo para la vinculación de cuentas en el futuro.
  adapter: PrismaAdapter(prisma as PrismaClient),

  // Configura uno o más proveedores de autenticación
  providers: [
    CredentialsProvider({
      // El nombre que se mostrará en el formulario de inicio de sesión (por ejemplo, 'Iniciar sesión con...')
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
          // Devuelve un objeto de usuario que será codificado en el JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            clientId: user.clientId,
          };
        } else {
          // Si devuelves null, se mostrará un error
          return null;
        }
      },
    }),
  ],

  // Usa JWT para la gestión de sesiones
  session: {
    strategy: 'jwt',
  },

  // Los callbacks se utilizan para controlar lo que sucede cuando se realiza una acción.
  callbacks: {
    // Este callback se llama cada vez que se crea o actualiza un JWT.
    async jwt({ token, user }) {
      // En el inicio de sesión inicial, el objeto `user` está disponible.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.clientId = user.clientId;
      }
      return token;
    },
    async session({ session, token }) {
      // Añadimos las propiedades personalizadas del token al objeto de sesión.
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.clientId = token.clientId;
      }
      return session;
    },
  },

  // Especifica las páginas para anular las páginas predeterminadas de NextAuth
  pages: {
    signIn: '/auth/signin', // Crearemos esta página más tarde
  },

  // Secreto para la firma y encriptación de JWT.
  // Se lee automáticamente de la variable de entorno NEXTAUTH_SECRET.
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };