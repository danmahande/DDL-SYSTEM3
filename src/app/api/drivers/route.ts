import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'desc' },
      include: { routes: true },
    })
    return NextResponse.json(
      { success: true, data: drivers },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch drivers' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const driverId = `DRV-${Date.now()}`
    
    const driver = await prisma.driver.create({
      data: {
        driverId,
        name: body.name,
        phone: body.phone,
        vehicleNumber: body.vehicleNumber || null,
        licenseNumber: body.licenseNumber || null,
        photoUrl: body.photoUrl || null,
        status: body.status || 'active',
      },
    })
    return NextResponse.json(
      { success: true, data: driver },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error creating driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create driver' },
      { status: 500, headers: corsHeaders }
    )
  }
}
