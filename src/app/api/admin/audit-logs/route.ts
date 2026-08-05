import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/serverStore';

export async function GET(req: Request) {
  try {
    const logs = getAuditLogs();
    return NextResponse.json({
      success: true,
      logs
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Failed to fetch audit logs: ${error.message}` },
      { status: 500 }
    );
  }
}
