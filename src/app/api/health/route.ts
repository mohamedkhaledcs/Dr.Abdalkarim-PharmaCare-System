import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const productsFilePath = path.resolve(process.cwd(), 'data', 'products.json')

export async function GET() {
  try {
    console.log('[HealthCheck] Testing local products.json connection...')

    const raw = await fs.readFile(productsFilePath, 'utf-8')
    const products = JSON.parse(raw)

    return NextResponse.json({
      status: 'ok',
      database: 'local-file',
      totalProducts: Array.isArray(products) ? products.length : 0,
      sampleProducts: Array.isArray(products) ? products.slice(0, 5) : [],
      message: 'Local product file connected successfully',
    }, { status: 200 })
  } catch (error) {
    console.error('[HealthCheck] Error reading products.json:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Could not read local products data',
      error: String(error),
    }, { status: 500 })
  }
}

