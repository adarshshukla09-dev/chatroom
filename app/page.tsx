import Image from "next/image";
import Login from "@/components/SignInCard";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function Home() {
   const session = await auth.api.getSession({
        headers:await headers()
    })

    if(!session){
        redirect("/Sign-in")
    }
  return (
  <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div className="flex flex-col items-center justify-center gap-4">

     <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">welcome to chatroom</h1>
     <div className="flex gap-4">

    <Link href="/Sign-in">
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Sign In</button>
    </Link>
    <Link href="/Sign-up">
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Sign Up</button>
    </Link>
    <Link href="/chat">
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Chat</button>
    </Link>
     </div>
    </div>
    </div>
  );
}
