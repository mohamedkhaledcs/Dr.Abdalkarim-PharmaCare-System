import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    const productsFilePath = path.resolve(process.cwd(), 'data', 'products.json')
    const raw = await fs.readFile(productsFilePath, 'utf-8')
    let data = JSON.parse(raw)
    
    // Ensure all products have valid IDs and defaults
    data = data.map((p: any) => {
      let cat = p.category || 'Uncategorized';
      const name = (p.name || '').toLowerCase();
      
      // Auto-categorize based on common keywords
      if (cat === 'Uncategorized' || cat === 'غير مصنف' || !cat) {
        if (name.includes('panadol') || name.includes('brufen') || name.includes('cataflam') || name.includes('pain')) cat = 'Pain Relief';
        else if (name.includes('augmentin') || name.includes('hibiotic') || name.includes('zithromax') || name.includes('amoxicillin')) cat = 'Antibiotics';
        else if (name.includes('centrum') || name.includes('omega') || name.includes('vit') || name.includes('ferroglobin')) cat = 'Vitamins';
        else if (name.includes('concor') || name.includes('capoten') || name.includes('crestor') || name.includes('plavix')) cat = 'Cardiovascular';
        else if (name.includes('congestal') || name.includes('123') || name.includes('otrivin') || name.includes('bronchicum')) cat = 'Respiratory';
        else if (name.includes('amaryl') || name.includes('glucophage') || name.includes('mixtard') || name.includes('diab')) cat = 'Diabetes';
        else if (name.includes('antinal') || name.includes('nexium') || name.includes('controloc') || name.includes('digest')) cat = 'Digestive';
        else if (name.includes('panthenol') || name.includes('sudocrem') || name.includes('bepanthen') || name.includes('cream')) cat = 'Skin Care';
        else if (name.includes('pediasure') || name.includes('baby') || name.includes('sanosan')) cat = 'Baby Care';
        else cat = 'Pain Relief'; // Fallback
      }

      return {
        ...p,
        id: p.id || uuidv4(),
        category: cat,
        price_box: p.price_box || 0,
        price_strip: p.price_strip || 0,
        strips_per_box: p.strips_per_box || 1,
        stock: p.stock || 0
      }
    })

    // Clear existing products in Supabase (optional, but good for fresh migration)
    await supabase.from('products').delete().neq('id', '0')

    // Insert all
    const { error } = await supabase.from('products').insert(data)
    
    if (error) {
      console.error('Supabase Error:', error)
      throw new Error(error.message)
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully migrated ${data.length} products to Supabase.`,
      note: 'You can now safely delete data/products.json'
    })
  } catch (err: any) {
    console.error('Migration Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
