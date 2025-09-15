import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { passwordResetSchema } from '@/lib/validations'
import { hashPassword, isTokenExpired, generateAuditId } from '@/lib/tokens'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationResult = passwordResetSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { token, password } = validationResult.data

    // Find reset token with prefix
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token: `reset_${token}` }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (isTokenExpired(resetToken.expires)) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token: `reset_${token}` }
      })

      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.identifier },
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true,
        passwordHash: true
      }
    })

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'User account not found or inactive' },
        { status: 400 }
      )
    }

    // Check if new password is different from current password
    const { verifyPassword } = await import('@/lib/tokens')
    const isSamePassword = await verifyPassword(password, user.passwordHash || '')

    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password must be different from your current password' },
        { status: 400 }
      )
    }

    // Hash new password
    const newPasswordHash = await hashPassword(password)

    // Start transaction to update password and cleanup
    await prisma.$transaction(async (tx) => {
      // Update user password
      await tx.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newPasswordHash,
          // Update lastLoginAt to mark password change time
          updatedAt: new Date()
        }
      })

      // Delete the reset token
      await tx.verificationToken.delete({
        where: { token: `reset_${token}` }
      })

      // Delete all sessions for this user (force re-login)
      await tx.session.deleteMany({
        where: { userId: user.id }
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          id: generateAuditId(),
          actorUserId: user.id,
          action: 'PASSWORD_RESET_COMPLETED',
          entity: 'User',
          entityId: user.id,
          payload: {
            email: user.email,
            resetMethod: 'email_token',
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || 'unknown'
          },
          ip: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent')
        }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. Please sign in with your new password.',
      user: {
        email: user.email,
        fullName: user.fullName
      }
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Internal server error during password reset' },
      { status: 500 }
    )
  }
}

// Get password reset form (check token validity and show form)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      )
    }

    // Validate token format
    const { isValidTokenFormat } = await import('@/lib/tokens')
    if (!isValidTokenFormat(token)) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      )
    }

    // Find reset token
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
    if (isTokenExpired(resetToken.expires)) {
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

    // Get user info
    const user = await prisma.user.findUnique({
      where: { email: resetToken.identifier },
      select: {
        email: true,
        fullName: true,
        status: true
      }
    })

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          valid: false,
          error: 'User account not found or inactive'
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
      expiresAt: resetToken.expires,
      token: token // Return for form submission
    })

  } catch (error) {
    console.error('Password reset form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
