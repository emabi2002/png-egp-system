'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  User,
  Shield,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Mail,
  Lock,
  Phone,
  Building
} from 'lucide-react'

type UserRole = 'SUPPLIER_USER' | 'AGENCY_BUYER'
type RegistrationStep = 'role' | 'details' | 'verification'

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState<RegistrationStep>('role')
  const [selectedRole, setSelectedRole] = useState<UserRole>()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Supplier specific
    legalName: '',
    tradingName: '',
    tin: '',
    address: '',
    // Agency specific
    agencyCode: '',
    position: ''
  })

  const roleOptions = [
    {
      value: 'SUPPLIER_USER' as UserRole,
      title: 'Supplier/Contractor',
      description: 'Register as a supplier to participate in government tenders and procurement opportunities',
      icon: Building2,
      features: [
        'Submit bids for open tenders',
        'Track bid status and results',
        'Manage company profile and compliance documents',
        'Receive notifications for relevant opportunities'
      ],
      requirements: [
        'Valid TIN (Tax Identification Number)',
        'Business registration documents',
        'Bank account details',
        'Authorized representative details'
      ]
    },
    {
      value: 'AGENCY_BUYER' as UserRole,
      title: 'Government Agency',
      description: 'Register as a government agency to create and manage procurement processes',
      icon: Shield,
      features: [
        'Create and publish tender notices',
        'Manage procurement plans',
        'Evaluate bids and award contracts',
        'Track contract performance'
      ],
      requirements: [
        'Valid government agency code',
        'Official authorization letter',
        'Procurement officer certification',
        'Agency contact verification'
      ]
    }
  ]

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setStep('details')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const registrationData = {
        ...formData,
        role: selectedRole,
        // Add required fields based on role
        ...(selectedRole === 'AGENCY_BUYER' && {
          agencyName: formData.agencyCode // Use agency code as name for now
        })
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      console.log('Registration successful:', result)
      setStep('verification')
    } catch (error) {
      console.error('Registration failed:', error)
      alert(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    const { fullName, email, password, confirmPassword } = formData
    const basicValid = fullName && email && password && confirmPassword && password === confirmPassword

    if (selectedRole === 'SUPPLIER_USER') {
      return basicValid && formData.legalName && formData.tin
    }

    if (selectedRole === 'AGENCY_BUYER') {
      return basicValid && formData.agencyCode && formData.position
    }

    return basicValid
  }

  if (step === 'role') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PNG</span>
              </div>
              <h1 className="text-3xl font-bold">Join PNG e-GP</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Choose your registration type to get started
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {roleOptions.map((option) => {
              const Icon = option.icon
              return (
                <Card
                  key={option.value}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-red-200"
                  onClick={() => handleRoleSelect(option.value)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Key Features
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {option.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        Requirements
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {option.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Register as {option.title}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-red-600 hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'details') {
    const selectedRoleData = roleOptions.find(r => r.value === selectedRole)!

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('role')}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-2xl">Complete Registration</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{selectedRoleData.title}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+675..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Role-specific fields */}
                {selectedRole === 'SUPPLIER_USER' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Company Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="legalName">Legal Company Name *</Label>
                        <Input
                          id="legalName"
                          value={formData.legalName}
                          onChange={(e) => setFormData(prev => ({ ...prev, legalName: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tradingName">Trading Name</Label>
                        <Input
                          id="tradingName"
                          value={formData.tradingName}
                          onChange={(e) => setFormData(prev => ({ ...prev, tradingName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tin">Tax Identification Number (TIN) *</Label>
                      <Input
                        id="tin"
                        value={formData.tin}
                        onChange={(e) => setFormData(prev => ({ ...prev, tin: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'AGENCY_BUYER' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Agency Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agencyCode">Agency Code *</Label>
                        <Input
                          id="agencyCode"
                          value={formData.agencyCode}
                          onChange={(e) => setFormData(prev => ({ ...prev, agencyCode: e.target.value }))}
                          placeholder="e.g., DOH, DOF, DOW"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Position/Title *</Label>
                        <Input
                          id="position"
                          value={formData.position}
                          onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                          placeholder="e.g., Procurement Officer"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={!isFormValid() || isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (step === 'verification') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Account Created!</CardTitle>
              <p className="text-muted-foreground">
                Please check your email to verify your account
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Verification Email Sent</p>
                    <p className="text-sm text-blue-700">
                      We've sent a verification link to <strong>{formData.email}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Next steps:</p>
                <ol className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                    Check your email inbox (and spam folder)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                    Click the verification link
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                    Complete your profile setup
                  </li>
                </ol>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  className="w-full"
                  onClick={() => router.push('/auth/signin')}
                >
                  Go to Sign In
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep('details')}
                >
                  Back to Registration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return null
}
