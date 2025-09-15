import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient()

  try {
    // Test basic connection
    await prisma.$connect()

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT sqlite_version() as version`

    // Test if we can query our tables
    const userCount = await prisma.user.count()

    await prisma.$disconnect()

    console.log('Database connection successful:', { result, userCount })

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      version: result,
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)

    await prisma.$disconnect()

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
