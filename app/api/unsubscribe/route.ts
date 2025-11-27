import { NextResponse } from 'next/server';
import { adminDb } from '../../lib/pushAdminSafe'; // Ensure this safe file exists

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    console.log("Unsubscribing:", email);

    // Save to Firestore Collection "unsubscribes"
    // We use the email as the Document ID so it's easy to check existence later
    await adminDb.collection('unsubscribes').doc(email.toLowerCase()).set({
      email: email.toLowerCase(),
      createdAt: new Date(),
      source: 'web_link',
      active: true // active means 'active suppression'
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Unsubscribe Failed:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}