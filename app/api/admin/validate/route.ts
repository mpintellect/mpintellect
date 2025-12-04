import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();
        
        // Compare with server-side environment variable
        if (password === process.env.ADMIN_KEY) {
            return NextResponse.json({ 
                valid: true,
                message: "Authentication successful" 
            });
        }
        
        return NextResponse.json({ 
            valid: false,
            message: "Invalid credentials" 
        }, { status: 401 });
        
    } catch (error) {
        console.error('Admin validation error:', error);
        return NextResponse.json({ 
            valid: false,
            message: "Authentication error" 
        }, { status: 500 });
    }
}