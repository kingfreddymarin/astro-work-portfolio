import { NextRequest, NextResponse } from 'next/server';

const firebaseConfig = {
  apiKey: 'AIzaSyB0U1USDZ0APIV8Bw8eeZGn6QnzBBWjfBc',
  authDomain: 'fjml-studio.firebaseapp.com',
  projectId: 'fjml-studio',
  storageBucket: 'fjml-studio.appspot.com',
  messagingSenderId: '141934667896',
  appId: '1:141934667896:web:d8a0e14df887b7c9f0d60f',
};

// Helper to format Firestore document value
function formatValue(value: any): any {
  if (typeof value === 'string') {
    return { stringValue: value };
  } else if (typeof value === 'boolean') {
    return { booleanValue: value };
  } else if (typeof value === 'number') {
    return { integerValue: String(value) };
  } else if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }
  return { stringValue: String(value) };
}

async function writeLead(data: any): Promise<boolean> {
  try {
    // Use Firestore REST API to write the lead
    // This works without requiring firebase-admin on the server
    const timestamp = new Date().toISOString();

    const fields: any = {};
    Object.entries(data).forEach(([key, value]) => {
      fields[key] = formatValue(value);
    });
    fields['createdAt'] = { timestampValue: timestamp };

    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/leads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      console.error('Firestore REST API error:', error);
    }

    return res.ok;
  } catch (err) {
    console.error('Failed to write lead:', err);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Sanitize and prepare data
    const lead = {
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 200),
      company: (body.company || '').trim().slice(0, 200),
      service: (body.service || '').slice(0, 100),
      package: (body.package || '').trim().slice(0, 200),
      message: message.trim().slice(0, 5000),
      specialRequest: body.specialRequest === true,
      specialEvidence: (body.specialEvidence || '').trim().slice(0, 1000),
      source: body.source || 'contact',
      userAgent: request.headers.get('user-agent') || 'N/A',
      pageUrl: body.pageUrl || request.headers.get('referer') || 'N/A',
      userId: body.userId || null,
    };

    // Write to Firestore
    const success = await writeLead(lead);

    if (success) {
      return NextResponse.json(
        { message: 'Lead submitted successfully' },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: 'Failed to submit lead. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/leads:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
