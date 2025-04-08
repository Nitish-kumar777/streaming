// app/api/logout/route.js
import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({ success: true }); // सिर्फ success भेजें
}
