import { z } from 'zod'
import { UserRole, AgencyType } from '@prisma/client'

// Base user validation
export const baseUserSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Supplier registration schema
export const supplierRegistrationSchema = baseUserSchema.extend({
  role: z.literal(UserRole.SUPPLIER_USER),
  legalName: z.string().min(2, 'Legal company name is required'),
  tradingName: z.string().optional(),
  tin: z.string().min(1, 'TIN is required'),
  address: z.string().optional(),
  categories: z.array(z.string()).default([])
})

// Agency registration schema
export const agencyRegistrationSchema = baseUserSchema.extend({
  role: z.literal(UserRole.AGENCY_BUYER),
  agencyCode: z.string().min(2, 'Agency code is required'),
  position: z.string().min(2, 'Position/title is required'),
  agencyName: z.string().min(2, 'Agency name is required'),
  agencyType: z.nativeEnum(AgencyType).default(AgencyType.MINISTRY)
})

// Union schema for registration
export const registrationSchema = z.discriminatedUnion('role', [
  supplierRegistrationSchema,
  agencyRegistrationSchema
])

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required')
})

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email address')
})

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Types for TypeScript
export type SupplierRegistrationInput = z.infer<typeof supplierRegistrationSchema>
export type AgencyRegistrationInput = z.infer<typeof agencyRegistrationSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
export type LoginInput = z.infer<typeof loginSchema>
