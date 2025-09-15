import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { passwordResetRequestSchema } from '@/lib/validations'
import { generatePasswordResetToken, generateAuditId } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = passwordResetRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid email address',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true,
// emailVerified: true
      }
    })

    // Always return success to prevent email enumeration attacks
    // But only actually send email if user exists and is active
    if (user && user.status === 'ACTIVE') {
      // Generate reset token
      const { token: resetToken, expiresAt } = generatePasswordResetToken()

      // Store reset token in verification tokens table (reusing the table)
      // Delete any existing reset tokens for this user first
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: email,
          token: { startsWith: 'reset_' }
        }
      })

      // Create new reset token with prefix to distinguish from verification tokens
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token: `reset_${resetToken}`,
          expires: expiresAt
        }
      })

      // Send password reset email
      const emailResult = await sendPasswordResetEmail(
        email,
        user.fullName,
        resetToken // Send without prefix to user
      )

      if (emailResult.success) {
        // Create audit log
        await prisma.auditLog.create({
          data: {
            id: generateAuditId(),
            actorUserId: user.id,
            action: 'PASSWORD_RESET_REQUESTED',
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
      }
    }

    // Always return success message for security
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    })

  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get password reset token validity (for frontend to check before showing form)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Look for reset token with prefix
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token: `reset_${token}` }
    })

    if (!resetToken) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid reset token'
        },
        { status: 400 }
      )
    }

    // Check if token is expired
    const { isTokenExpired } = await import('@/lib/tokens')
    if (isTokenExpired(resetToken.expires)) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token: `reset_${token}` }
      })

      return NextResponse.json(
        {
          valid: false,
          error: 'Reset token has expired'
        },
        { status: 400 }
      )
    }

    // Find user to get basic info
    const user = await prisma.user.findUnique({
      where: { email: resetToken.identifier },
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true
      }
    })

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid user account'
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      user: {
        email: user.email,
        fullName: user.fullName
      },
      expiresAt: resetToken.expires
    })

  } catch (error) {
    console.error('Password reset token validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
