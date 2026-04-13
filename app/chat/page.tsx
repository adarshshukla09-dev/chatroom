
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import HomePage from "@/components/HomePage";

export default async  function ChatPage() {
const session = await auth.api.getSession({
        headers:await headers()
    })

    if(!session){
        redirect("/Sign-in")
    }
 
  return (
 <HomePage/>
  );
}