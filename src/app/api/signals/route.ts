import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import type { DemandSignal } from '@prisma/client'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const neighborhood = searchParams.get('neighborhood')
    const urgency = searchParams.get('urgency')

    const where: any = {}
    if (category) where.productCategory = category
    if (neighborhood) where.neighborhood = neighborhood
    if (urgency) where.urgency = urgency

    const [signals, stats] = await Promise.all([
      prisma.demandSignal.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.demandSignal.aggregate({
        _count: {
          id: true,
        },
        where: {
          status: {
            in: ['pending', 'assigned', 'in_transit', 'delivered']
          }
        }
      })
    ])

    const total = signals.length
    const pending = signals.filter((s: DemandSignal) => s.status === 'pending').length
    const active = signals.filter((s: DemandSignal) => ['assigned', 'in_transit'].includes(s.status)).length
    const delivered = signals.filter((s: DemandSignal) => s.status === 'delivered').length

    return NextResponse.json(
      { 
        success: true, 
        data: signals,
        stats: { total, pending, active, delivered }
      },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error fetching signals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch signals' },
      { status: 500, headers: corsHeaders }
    )
  }
}