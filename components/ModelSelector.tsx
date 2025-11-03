'use client'
import React from 'react'
export default function ModelSelector({ model, onChange }: any) { const models = [{ id:'deepseek/deepseek-r1-0528:free', label:'DeepSeek: R1 0528' }, { id:'openai/gpt-oss-20b:free', label:'GPT OSS 20B' }]; return (<select value={model} onChange={e=>onChange(e.target.value)} className='bg-transparent border px-3 py-2 rounded'>{models.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select>) }
