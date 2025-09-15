import { NextRequest, NextResponse } from 'next/server'
import { Client } from 'pg'

export async function GET(request: NextRequest) {
  const client = new Client({
    host: 'db.xtyhxjqxaepmybguxvur.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'w@#091836!!',
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('Attempting to connect to database...')
    await client.connect()

    console.log('Connected! Testing query...')
    const result = await client.query('SELECT version(), current_database(), current_user')

    await client.end()

    return NextResponse.json({
      success: true,
      message: 'Raw PostgreSQL connection successful',
      version: result.rows[0].version,
      database: result.rows[0].current_database,
      user: result.rows[0].current_user,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Raw database connection error:', error)

    try {
      await client.end()
    } catch (endError) {
      console.error('Error closing connection:', endError)
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
