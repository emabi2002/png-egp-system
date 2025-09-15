import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { emailVerificationSchema } from '@/lib/validations'
import { isValidTokenFormat, isTokenExpired, generateAuditId } from '@/lib/tokens'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = emailVerificationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid verification token format',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { token } = validationResult.data

    // Additional token format validation
    if (!isValidTokenFormat(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (isTokenExpired(verificationToken.expires)) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token }
      })

      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
      include: {
        agency: true,
        ownedSupplier: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: true,
          message: 'Email already verified',
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            emailVerified: true
          }
        }
      )
    }

    // Start transaction to verify user and clean up
    const result = await prisma.$transaction(async (tx) => {
      // Update user verification status
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          lastLoginAt: new Date() // Set as first login
        },
        include: {
          agency: true,
          ownedSupplier: true
        }
      })

      // Update supplier KYC status if applicable
      if (user.ownedSupplier) {
        await tx.supplier.update({
          where: { id: user.ownedSupplier.id },
          data: {
            kycStatus: 'PENDING' // Move to pending for document upload
          }
        })
      }

      // Delete the verification token
      await tx.verificationToken.delete({
        where: { token }
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          id: generateAuditId(),
          actorUserId: user.id,
          action: 'EMAIL_VERIFIED',
          entity: 'User',
          entityId: user.id,
          payload: {
            email: user.email,
            role: user.role,
            verificationMethod: 'email_token',
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || 'unknown'
          },
          ip: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent')
        }
      })

      return updatedUser
    })

    // Send welcome email
    const emailResult = await sendWelcomeEmail(
      result.email,
      result.fullName,
      result.role
    )

    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.error)
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! Welcome to PNG e-GP.',
      user: {
        id: result.id,
        email: result.email,
        fullName: result.fullName,
        role: result.role,
        emailVerified: true,
        agency: result.agency ? {
          id: result.agency.id,
          name: result.agency.name,
          code: result.agency.code
        } : null,
        supplier: result.ownedSupplier ? {
          id: result.ownedSupplier.id,
          legalName: result.ownedSupplier.legalName,
          kycStatus: result.ownedSupplier.kycStatus
        } : null
      },
      welcomeEmailSent: emailResult.success
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error during email verification' },
      { status: 500 }
    )
  }
}

// Resend verification email
export async function PUT(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Delete any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    })

    // Generate new verification token
    const { generateVerificationToken } = await import('@/lib/tokens')
    const { token: verificationToken, expiresAt } = generateVerificationToken()

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: expiresAt
      }
    })

    // Send verification email
    const { sendVerificationEmail } = await import('@/lib/email')
    const emailResult = await sendVerificationEmail(
      email,
      user.fullName,
      verificationToken
    )

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        id: generateAuditId(),
        actorUserId: user.id,
        action: 'VERIFICATION_EMAIL_RESENT',
        entity: 'User',
        entityId: user.id,
        payload: {
          email: user.email,
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        },
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent')
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully'
    })

  } catch (error) {
    console.error('Resend verification email error:', error)
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    )
  }
}
