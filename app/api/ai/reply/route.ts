import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const key = process.env.OPENROUTER_API_KEY || ''
    if (!key)
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY not set' },
        { status: 400 }
      )

    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: body.model || 'openai/gpt-oss-20b:free',
        messages: body.messages || [],
        stream: true,
      }),
    })

    // Tambahkan debug
    if (!upstream.ok) {
      const text = await upstream.text()
      console.error('OpenRouter upstream error:', upstream.status, text)
      return NextResponse.json(
        { error: 'upstream', status: upstream.status, detail: text },
        { status: 502 }
      )
    }

    return new NextResponse(upstream.body, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (e) {
    console.error('Internal error:', e)
    return NextResponse.json({ error: 'internal', detail: e.message }, { status: 500 })
  }
}
