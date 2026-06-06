import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const updateData: any = {
      updatedAt: new Date(),
    }
    
    if (body.status) {
      updateData.status = body.status
    }
    if (body.driverId) {
      updateData.driverId = body.driverId
      updateData.status = 'assigned'
      updateData.assignedAt = new Date()
    }
    if (body.routeId) {
      updateData.routeId = body.routeId
    }

    const updatedSignal = await prisma.demandSignal.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(
      { success: true, data: updatedSignal },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error updating signal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update signal' },
      { status: 500, headers: corsHeaders }
    )
  }
}