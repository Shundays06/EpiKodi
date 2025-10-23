import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, PaginatedResponse, Media } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    console.log('GET /api/media - params:', { page, pageSize, type, category, search });

    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (type) where.type = type;
    if (category) where.category = category;
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    console.log('Prisma query where:', where);

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        include: {
          metadata: true,
        },
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.media.count({ where }),
    ]);

    console.log('Query result - items:', items.length, 'total:', total);

    // Convertir les BigInt en String pour la sérialisation JSON
    const serializedItems = items.map(item => ({
      ...item,
      fileSize: item.fileSize.toString(),
      metadata: item.metadata ? {
        ...item.metadata,
        budget: item.metadata.budget?.toString() || null,
        revenue: item.metadata.revenue?.toString() || null,
      } : null,
    }));

    const response: PaginatedResponse<Media> = {
      items: serializedItems as any,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching media:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}
