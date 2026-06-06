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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const driver = await prisma.driver.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(
      { success: true, data: driver },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error updating driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update driver' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.driver.delete({ where: { id } })
    return NextResponse.json(
      { success: true },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error deleting driver:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete driver' },
      { status: 500, headers: corsHeaders }
    )
  }
}
