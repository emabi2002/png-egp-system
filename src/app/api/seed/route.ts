import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient()

  try {
    // Check if data already exists
    const existingAgencies = await prisma.agency.count()
    if (existingAgencies > 0) {
      return NextResponse.json({
        success: false,
        message: 'Seed data already exists',
        existingAgencies
      })
    }

    // Create agencies
    const agencies = await prisma.agency.createMany({
      data: [
        {
          id: 'npc-admin',
          name: 'National Procurement Commission',
          code: 'NPC',
          type: 'AUTHORITY',
          address: 'Port Moresby, Papua New Guinea',
          contactEmail: 'contact@npc.gov.pg',
          contactPhone: '+675 321 1234'
        },
        {
          id: 'health-dept',
          name: 'Department of Health',
          code: 'DOH',
          type: 'MINISTRY',
          address: 'Waigani, Port Moresby',
          contactEmail: 'procurement@health.gov.pg',
          contactPhone: '+675 301 3000'
        },
        {
          id: 'education-dept',
          name: 'Department of Education',
          code: 'DOE',
          type: 'MINISTRY',
          address: 'Waigani, Port Moresby',
          contactEmail: 'procurement@education.gov.pg',
          contactPhone: '+675 301 3001'
        },
        {
          id: 'transport-dept',
          name: 'Department of Transport',
          code: 'DOT',
          type: 'MINISTRY',
          address: 'Port Moresby, Papua New Guinea',
          contactEmail: 'procurement@transport.gov.pg',
          contactPhone: '+675 321 5678'
        },
        {
          id: 'pngports',
          name: 'PNG Ports Corporation Limited',
          code: 'PNGPCL',
          type: 'SOE',
          address: 'Port Moresby, Papua New Guinea',
          contactEmail: 'procurement@pngports.com.pg',
          contactPhone: '+675 321 9876'
        }
      ]
    })

    // Create a test admin user
    const bcrypt = require('bcryptjs')
    const testAdminPassword = await bcrypt.hash('TestAdmin123!', 12)

    const testAdmin = await prisma.user.create({
      data: {
        id: 'test-admin-001',
        email: 'admin@npc.gov.pg',
        emailVerified: new Date(),
        passwordHash: testAdminPassword,
        fullName: 'NPC Test Administrator',
        role: 'NPC_ADMIN',
        agencyId: 'npc-admin',
        phone: '+675 321 1234',
        status: 'ACTIVE'
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Seed data created successfully',
      data: {
        agencies: agencies.count,
        testAdmin: {
          email: testAdmin.email,
          role: testAdmin.role,
          agency: 'National Procurement Commission'
        }
      }
    })
  } catch (error) {
    console.error('Seed data creation error:', error)

    await prisma.$disconnect()

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
