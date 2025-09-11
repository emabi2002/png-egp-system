import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient()

  try {
    const userCount = await prisma.user.count()
    const agencyCount = await prisma.agency.count()
    const tenderCount = await prisma.tender.count()
    const supplierCount = await prisma.supplier.count()

    const agencies = await prisma.agency.findMany({
      select: { id: true, name: true, code: true, type: true }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      stats: {
        users: userCount,
        agencies: agencyCount,
        tenders: tenderCount,
        suppliers: supplierCount
      },
      agencies: agencies
    })
  } catch (error) {
    console.error('Stats error:', error)
    await prisma.$disconnect()

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
