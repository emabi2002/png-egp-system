import crypto from 'crypto'
import CryptoJS from 'crypto-js'

// Generate a secure random token
export const generateToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex')
}

// Generate verification token with expiry
export const generateVerificationToken = () => {
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours from now

  return {
    token,
    expiresAt
  }
}

// Generate password reset token with expiry
export const generatePasswordResetToken = () => {
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour from now

  return {
    token,
    expiresAt
  }
}

// Encrypt sensitive data
export const encryptData = (data: string): string => {
  const key = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'
  return CryptoJS.AES.encrypt(data, key).toString()
}

// Decrypt sensitive data
export const decryptData = (encryptedData: string): string => {
  const key = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'
  const bytes = CryptoJS.AES.decrypt(encryptedData, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(password, 12)
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hashedPassword)
}

// Generate audit log ID
export const generateAuditId = (): string => {
  return `audit_${Date.now()}_${generateToken(8)}`
}

// Generate reference numbers
export const generateReferenceNumber = (prefix: string): string => {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const randomNumber = Math.floor(Math.random() * 9000) + 1000

  return `${prefix}-${year}-${month}-${randomNumber}`
}

// Generate tender reference
export const generateTenderRef = (): string => {
  return generateReferenceNumber('TND')
}

// Generate contract reference
export const generateContractRef = (): string => {
  return generateReferenceNumber('CNT')
}

// Generate bid reference
export const generateBidRef = (): string => {
  return generateReferenceNumber('BID')
}

// Validate token format
export const isValidTokenFormat = (token: string): boolean => {
  return /^[a-f0-9]{64}$/.test(token) // 64 character hex string
}

// Check if token is expired
export const isTokenExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt
}
