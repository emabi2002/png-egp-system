import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            agency: true,
            ownedSupplier: true
          }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        if (user.status !== 'ACTIVE') {
          return null
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          agencyId: user.agencyId || undefined,
          agency: user.agency ? {
            id: user.agency.id,
            name: user.agency.name,
            code: user.agency.code,
            type: user.agency.type
          } : undefined,
          supplierId: user.ownedSupplier?.id
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.agencyId = user.agencyId
        token.agency = user.agency
        token.supplierId = user.supplierId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.agencyId = token.agencyId as string
        session.user.agency = token.agency as any
        session.user.supplierId = token.supplierId as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
}

export default authOptions
