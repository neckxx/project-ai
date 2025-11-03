'use client'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
export default function NavBar() {
  const { data: session } = useSession()
  const user = (session as any)?.user
  return (
    <nav className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3"><Link href="/"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center text-white font-bold">T</div></Link><span className="font-semibold text-lg">TerraAI</span></div>
      <div className="flex items-center gap-4">
        <Link href="/chat" className="text-sm px-3 py-2 rounded-md bg-white/5">Chat</Link>
        {!session ? (<div className="flex items-center gap-2"><button onClick={()=>signIn('google')} className="px-3 py-1 rounded-md bg-white/6">Sign In</button><button onClick={()=>signIn('google')} className="px-3 py-1 rounded-md bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white">Sign Up</button></div>) : (<div className="flex items-center gap-3">{user?.image ? <img src={user.image} alt="avatar" className="w-9 h-9 rounded-full object-cover"/> : <div className="w-9 h-9 rounded-full bg-[#8b5cf6] flex items-center justify-center">{(user?.name||'T').charAt(0).toUpperCase()}</div>}<button onClick={()=>signOut()} className="text-sm underline">Sign out</button></div>)}
      </div>
    </nav>
  )
}
