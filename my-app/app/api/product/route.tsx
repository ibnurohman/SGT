import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
function getAuthHeaders(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
        return { error: 'Unauthorized - No token provided', status: 401 };
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    };
}
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('product_id');
    

    try {
        let backendUrl = `http://localhost:8001/api/web/v1/products`;
        if (id) {
            backendUrl = `http://localhost:8001/api/web/v1/product?product_id=${id}`;
            console.log(`[Next.js API] Fetching single product from backend: ${backendUrl}`);
        } else {
            console.log(`[Next.js API] Fetching all products from backend: ${backendUrl}`);
        }
        const response = await axios.get(backendUrl);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error in Next.js API route (GET product/products):', error.response?.data || error.message);
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to fetch data';
        return NextResponse.json({ error: message }, { status: status });
    }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await axios.post('http://localhost:8001/api/web/v1/product', body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await axios.put('http://localhost:8001/api/web/v1/product', body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
function handleAxiosError(error: any, defaultMessage: string) {
    console.error(`[Next.js API] Error:`, error.response?.data || error.message);
    const status = error.response?.status || 500; // <--- POTENSI MASALAH DI SINI
    const message = error.response?.data?.message || defaultMessage;
    return NextResponse.json({ error: message }, { status: status });
}
export async function DELETE(req: NextRequest) {
    const authResult = getAuthHeaders(req);
    if (authResult.error) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const headers = authResult.headers;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('product_id');

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    try {
        console.log(`[Next.js API - DELETE] Forwarding to backend: http://localhost:8001/api/web/v1/product?product_id=${id}`);
        // Anda mengirim permintaan ke: http://localhost:8001/api/web/v1/product?product_id=${id}
        const response = await axios.delete(`http://localhost:8001/api/web/v1/product?product_id=${id}`, { headers });
        return NextResponse.json(response.data);
    } catch (error: any) {
        return handleAxiosError(error, 'Failed to delete product');
    }
}

