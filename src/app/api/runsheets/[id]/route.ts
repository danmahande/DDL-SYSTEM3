import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const runsheet = await prisma.route.findUnique({
      where: { id },
      include: { driver: true, stops: true, demandSignals: true },
    })
    return NextResponse.json(
      { success: true, data: runsheet },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error fetching runsheet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch runsheet' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // If setting isActive, deactivate others
    if (body.isActive) {
      await prisma.route.updateMany({
        where: { id: { not: id }, isActive: true },
        data: { isActive: false },
      })
    }
    
    const runsheet = await prisma.route.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(
      { success: true, data: runsheet },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error updating runsheet:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update runsheet' },
      { status: 500, headers: corsHeaders }
    )
  }
}
