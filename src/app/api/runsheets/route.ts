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
    const runsheets = await prisma.route.findMany({
      orderBy: { createdAt: 'desc' },
      include: { driver: true, stops: true, demandSignals: true },
    })
    return NextResponse.json(
      { success: true, data: runsheets },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error fetching runsheets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch runsheets' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const routeId = `RTE-${Date.now()}`
    
    // If this is the active runsheet, deactivate others first
    if (body.isActive) {
      await prisma.route.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      })
    }
    
    const runsheet = await prisma.route.create({
      data: {
        routeId,
        driverId: body.driverId,
        date: new Date(body.date),
        totalDistance: body.totalDistance || null,
        estimatedTime: body.estimatedTime || null,
        stopsCount: body.stopsCount || 0,
        status: body.status || 'planned',
        isActive: body.isActive || false,
        optimizationData: body.optimizationData ? JSON.stringify(body.optimizationData) : null,
      },
      include: { driver: true },
    })
    
    return NextResponse.json(
      { success: true, data: runsheet },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error creating runsheet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create runsheet' },
      { status: 500, headers: corsHeaders }
    )
  }
}
