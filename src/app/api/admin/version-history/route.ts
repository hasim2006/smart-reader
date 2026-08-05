import { NextResponse } from 'next/server';
import { getVersionHistory, saveSiteContent, addAuditLog } from '@/lib/serverStore';

export async function GET(req: Request) {
  try {
    const versions = getVersionHistory();
    return NextResponse.json({
      success: true,
      versions
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to fetch version history: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { versionId, adminUser } = await req.json();

    if (!versionId) {
      return NextResponse.json(
        { success: false, message: 'versionId is required to restore snapshot.' },
        { status: 400 }
      );
    }

    const versions = getVersionHistory();
    const snapshot = versions.find(v => v.id === versionId);

    if (!snapshot) {
      return NextResponse.json(
        { success: false, message: `Version snapshot "${versionId}" not found.` },
        { status: 404 }
      );
    }

    const author = adminUser || 'Hasim';
    saveSiteContent(snapshot.content, author);

    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    addAuditLog(
      author,
      'Version Restored',
      `Restored website content snapshot from ${new Date(snapshot.timestamp).toLocaleString()}`,
      clientIp
    );

    return NextResponse.json({
      success: true,
      message: `Successfully restored website content to snapshot from ${new Date(snapshot.timestamp).toLocaleString()}`,
      restoredContent: snapshot.content
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Version restore failed: ${error.message}` },
      { status: 500 }
    );
  }
}
