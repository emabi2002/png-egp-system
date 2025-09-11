import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test basic connection
    await prisma.$connect()

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`

    // Check if we can see any tables
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      testQuery: result,
      tables: tables,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Database test error:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
