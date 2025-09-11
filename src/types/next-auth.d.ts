import { UserRole } from '@prisma/client'
import type { DefaultSession, DefaultUser } from 'next-auth'
import type { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      agencyId?: string
      agency?: {
        id: string
        name: string
        code: string
        type: string
      }
      supplierId?: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: UserRole
    agencyId?: string
    agency?: {
      id: string
      name: string
      code: string
      type: string
    }
    supplierId?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: UserRole
    agencyId?: string
    agency?: {
      id: string
      name: string
      code: string
      type: string
    }
    supplierId?: string
  }
}
