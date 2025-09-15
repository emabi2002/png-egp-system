import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registrationSchema } from '@/lib/validations'
import { hashPassword, generateVerificationToken, generateAuditId } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/email'
import { UserRole, AgencyType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = registrationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Generate verification token
    const { token: verificationToken, expiresAt: verificationExpiresAt } = generateVerificationToken()

    // Start database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          fullName: data.fullName,
          phone: data.phone,
          role: data.role,
          status: 'ACTIVE'
        }
      })

      // Create verification token
      await tx.verificationToken.create({
        data: {
          identifier: user.email,
          token: verificationToken,
          expires: verificationExpiresAt
        }
      })

      let supplierId: string | undefined
      let agencyId: string | undefined

      // Handle role-specific data
      if (data.role === UserRole.SUPPLIER_USER) {
        // Check if supplier with same legal name and TIN exists
        const existingSupplier = await tx.supplier.findFirst({
          where: {
            AND: [
              { legalName: data.legalName },
              { tin: data.tin }
            ]
          }
        })

        if (existingSupplier) {
          throw new Error('Supplier with this legal name and TIN already exists')
        }

        // Create supplier profile
        const supplier = await tx.supplier.create({
          data: {
            legalName: data.legalName,
            tradingName: data.tradingName,
            tin: data.tin,
            address: data.address,
            contactEmail: data.email,
            contactPhone: data.phone,
            categories: data.categories || [],
            ownerUserId: user.id,
            kycStatus: 'PENDING',
            ircStatus: 'NOT_PROVIDED'
          }
        })

        supplierId = supplier.id

      } else if (data.role === UserRole.AGENCY_BUYER) {
        // Check if agency exists or create it
        let agency = await tx.agency.findUnique({
          where: { code: data.agencyCode }
        })

        if (!agency) {
          agency = await tx.agency.create({
            data: {
              name: data.agencyName,
              code: data.agencyCode,
              type: data.agencyType,
              contactEmail: data.email,
              contactPhone: data.phone
            }
          })
        }

        // Update user with agency ID
        await tx.user.update({
          where: { id: user.id },
          data: { agencyId: agency.id }
        })

        agencyId = agency.id
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          id: generateAuditId(),
          actorUserId: user.id,
          action: 'USER_REGISTERED',
          entity: 'User',
          entityId: user.id,
          payload: {
            role: data.role,
            email: data.email,
            registrationMethod: 'email',
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || 'unknown'
          },
          ip: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent')
        }
      })

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          supplierId,
          agencyId
        },
        verificationToken
      }
    })

    // Send verification email
    const emailResult = await sendVerificationEmail(
      data.email,
      data.fullName,
      verificationToken
    )

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      // Don't fail the registration if email fails, just log it
    }

    // Return success response (don't include verification token for security)
    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        role: result.user.role
      },
      emailSent: emailResult.success
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    )
  }
}

// Get registration statistics (for admin dashboard)
export async function GET() {
  try {
    const stats = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
      where: {
        status: 'ACTIVE'
      }
    })

    const totalUsers = await prisma.user.count({
      where: { status: 'ACTIVE' }
    })

    const recentRegistrations = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        agency: {
          select: {
            name: true,
            code: true
          }
        },
        ownedSupplier: {
          select: {
            legalName: true,
            kycStatus: true
          }
        }
      }
    })

    return NextResponse.json({
      stats: {
        total: totalUsers,
        byRole: stats.reduce((acc, item) => {
          acc[item.role] = item._count
          return acc
        }, {} as Record<string, number>)
      },
      recentRegistrations
    })

  } catch (error) {
    console.error('Failed to get registration stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registration statistics' },
      { status: 500 }
    )
  }
}
