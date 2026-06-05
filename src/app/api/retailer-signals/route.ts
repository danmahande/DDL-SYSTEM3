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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const existingSignal = await prisma.demandSignal.findUnique({
      where: { signalId: body.signalId }
    })

    if (existingSignal) {
      return NextResponse.json(
        { success: true, data: { signalId: existingSignal.signalId } },
        { headers: corsHeaders }
      )
    }

    const newSignal = await prisma.demandSignal.create({
      data: {
        signalId: body.signalId,
        shopkeeperId: body.shopkeeperId,
        businessName: body.businessName || '',
        neighborhood: body.neighborhood,
        productCategory: body.productCategory,
        productLabel: body.productLabel,
        productId: body.productId || '',
        packageSize: body.packageSize,
        priceTier: body.priceTier,
        quantity: body.quantity || 1,
        urgency: body.urgency || 'normal',
        status: 'pending',
        latitude: body.latitude,
        longitude: body.longitude,
        locationAccuracy: body.locationAccuracy,
        source: 'retailer_app',
        notes: body.notes,
        isSynced: true,
        syncedAt: new Date(),
        privacyApplied: false,
      }
    })

    return NextResponse.json(
      { success: true, data: { signalId: newSignal.signalId } },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error creating retailer signal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create signal' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function GET() {
  try {
    const signals = await prisma.demandSignal.findMany({
      where: { source: 'retailer_app' },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(
      { success: true, data: signals },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error fetching retailer signals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch signals' },
      { status: 500, headers: corsHeaders }
    )
  }
}