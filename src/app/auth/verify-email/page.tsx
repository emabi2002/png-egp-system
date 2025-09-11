'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight,
  RefreshCw
} from 'lucide-react'

type VerificationState = 'loading' | 'success' | 'error' | 'expired' | 'invalid'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [state, setState] = useState<VerificationState>('loading')
  const [message, setMessage] = useState('')
  const [userInfo, setUserInfo] = useState<{
    email?: string
    fullName?: string
    role?: string
  }>({})
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (!token) {
      setState('invalid')
      setMessage('No verification token provided')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      setState('loading')

      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      })

      const result = await response.json()

      if (response.ok) {
        setState('success')
        setMessage(result.message || 'Email verified successfully!')
        setUserInfo({
          email: result.user?.email,
          fullName: result.user?.fullName,
          role: result.user?.role
        })
      } else {
        if (result.error?.includes('expired')) {
          setState('expired')
        } else {
          setState('error')
        }
        setMessage(result.error || 'Verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
      setState('error')
      setMessage('An unexpected error occurred during verification')
    }
  }

  const resendVerificationEmail = async () => {
    if (!userInfo.email) return

    setIsResending(true)
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userInfo.email }),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Verification email sent successfully! Please check your inbox.')
      } else {
        alert(result.error || 'Failed to resend verification email')
      }
    } catch (error) {
      console.error('Resend email error:', error)
      alert('Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  const getIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />
      case 'error':
      case 'expired':
      case 'invalid':
        return <AlertCircle className="h-12 w-12 text-red-600" />
      default:
        return <Mail className="h-12 w-12 text-gray-600" />
    }
  }

  const getTitle = () => {
    switch (state) {
      case 'loading':
        return 'Verifying Your Email...'
      case 'success':
        return 'Email Verified Successfully!'
      case 'expired':
        return 'Verification Link Expired'
      case 'error':
        return 'Verification Failed'
      case 'invalid':
        return 'Invalid Verification Link'
      default:
        return 'Email Verification'
    }
  }

  const getActions = () => {
    switch (state) {
      case 'success':
        return (
          <div className="space-y-3">
            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={() => router.push('/auth/signin')}
            >
              Continue to Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="text-center">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:underline">
                Or go to dashboard
              </Link>
            </div>
          </div>
        )

      case 'expired':
        return (
          <div className="space-y-3">
            {userInfo.email && (
              <Button
                className="w-full"
                onClick={resendVerificationEmail}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            )}
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        )

      default:
        return (
          <div className="space-y-3">
            <Link href="/auth/signin">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Create New Account
              </Button>
            </Link>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">PNG</span>
            </div>
            <h1 className="text-2xl font-bold">PNG e-GP</h1>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getIcon()}
            </div>
            <CardTitle className="text-xl">{getTitle()}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Message */}
            <div className="text-center">
              <p className="text-muted-foreground">{message}</p>
              {userInfo.fullName && (
                <p className="text-sm text-muted-foreground mt-2">
                  Welcome, {userInfo.fullName}!
                </p>
              )}
            </div>

            {/* Success details */}
            {state === 'success' && userInfo.role && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Account Details</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>Role:</strong> {userInfo.role.replace('_', ' ')}</p>
                  <p><strong>Status:</strong> Active</p>
                </div>
              </div>
            )}

            {/* Expired/Error details */}
            {(state === 'expired' || state === 'error') && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">What happened?</h4>
                <div className="text-sm text-red-700 space-y-1">
                  {state === 'expired' ? (
                    <>
                      <p>Your verification link has expired for security reasons.</p>
                      <p>Verification links are valid for 24 hours after registration.</p>
                    </>
                  ) : (
                    <>
                      <p>The verification link is invalid or has already been used.</p>
                      <p>Please try registering again or contact support if the problem persists.</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            {getActions()}

            {/* Help */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Need help? Contact support at</p>
              <a href="mailto:support@png-egp.gov.pg" className="text-red-600 hover:underline">
                support@png-egp.gov.pg
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
