import { NextResponse } from 'next/server';
import { adminDb } from '../../lib/firebaseAdmin'; // Ensure this path matches your folder structure
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON body
    const { email } = await request.json();

    // 2. Basic Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // 3. Define the collection
    const subscribersRef = adminDb.collection('subscribers');

    // 4. Check if email already exists (Optional: prevent duplicates)
    const existingUser = await subscribersRef
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      // If user exists, just return 200 so the UI shows "Success"
      // (We don't want to tell hackers which emails exist)
      return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });
    }

    // 5. Save to Firestore
    await subscribersRef.add({
      email: email,
      createdAt: FieldValue.serverTimestamp(), // Uses server time
      source: 'footer',
      status: 'active'
    });

    console.log(`✅ New subscriber added: ${email}`);

    return NextResponse.json(
      { message: 'Subscription successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}