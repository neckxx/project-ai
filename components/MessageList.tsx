'use client'
import React from 'react'
export default function MessageList({ messages }: any) { return (<div className='space-y-4 px-2'>{messages.map((m:any)=>(<div key={m.id} className={m.role==='user'?'text-right':'text-left'}><div className={`inline-block p-3 rounded-lg ${m.role==='user'?'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white':'bg-white/6 text-white'}`} style={{ maxWidth:'80%' }}><div style={{ whiteSpace:'pre-wrap' }}>{m.content}</div></div></div>))}</div>) }
