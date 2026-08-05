import { NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/serverStore';

export async function GET(req: Request) {
  try {
    const content = getSiteContent();
    return NextResponse.json({
      success: true,
      content
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to fetch site content: ${error.message}` },
      { status: 500 }
    );
  }
}
