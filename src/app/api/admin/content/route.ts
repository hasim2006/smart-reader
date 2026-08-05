import { NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent, addAuditLog, SiteContent } from '@/lib/serverStore';

export async function GET(req: Request) {
  try {
    const content = getSiteContent();
    return NextResponse.json({
      success: true,
      content
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to retrieve content: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { content, adminUser, actionDescription } = await req.json();

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Updated content payload is required.' },
        { status: 400 }
      );
    }

    const author = adminUser || process.env.ADMIN_USERNAME || 'Hasim';
    saveSiteContent(content as SiteContent, author);

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    addAuditLog(
      author,
      'Content Published',
      actionDescription || 'Updated website text, hero badges, FAQs, testimonials, and banners live.',
      clientIp
    );

    return NextResponse.json({
      success: true,
      message: 'Website content successfully updated and published live for all users!',
      content
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to publish content: ${error.message}` },
      { status: 500 }
    );
  }
}
