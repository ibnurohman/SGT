import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

 export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }
    try {
        const url = new URL(req.url);
        const page = url.searchParams.get('page') || '1';
        const limit = url.searchParams.get('limit') || '10';
        const search = url.searchParams.get('search') || ''; 
        const backendUrl = `http://localhost:8001/api/web/v1/products?page=${page}&limit=${limit}&search=${search}`;
        const response = await axios.get(backendUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Failed to fetch products';
        return NextResponse.json({ error: message }, { status: status });
    }
}


