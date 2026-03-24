import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/server/services/productService'

const productService = new ProductService()

// This route uses dynamic search params
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')

    if (!q || q.trim().length === 0) {
      console.log('[SearchAPI] No search query provided')
      return NextResponse.json({ error: 'Search query required' }, { status: 400 })
    }

    console.log(`[SearchAPI] Searching for: ${q}`)
    const results = await productService.searchProducts(q)
    
    console.log(`[SearchAPI] Found ${results.length} results`)
    return NextResponse.json(results)
  } catch (error) {
    console.error('[SearchAPI] Error searching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
