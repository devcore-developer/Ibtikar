import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB safety limit
      return NextResponse.json({ success: false, error: 'File size exceeds 10MB' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Only image files are allowed' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        image: base64Image,
      }),
    });

    if (!imgbbRes.ok) {
      const errText = await imgbbRes.text();
      console.error('[UPLOAD_API_ERROR] ImgBB API Error:', errText);
      return NextResponse.json({ success: false, error: 'Failed to upload image to storage provider' }, { status: 500 });
    }

    const data = await imgbbRes.json();
    return NextResponse.json({ success: true, url: data.data.url });
  } catch (error) {
    console.error('[UPLOAD_API_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}