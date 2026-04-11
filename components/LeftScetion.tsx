"use client"

import React, { Dispatch, SetStateAction } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Search, ListFilter } from "lucide-react"

interface Props {
  selectedUser: boolean
  setSelectedUser: Dispatch<SetStateAction<boolean>>
}

const USERS = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  name: `Adharsh ${i + 1}`,
  lastSeen: `${i + 2} mins ago`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  latestMsg: "Let me know when you're free to chat!"
}))

function LeftSection({ selectedUser, setSelectedUser }: Props) {
  return (
    <div
      className={`
        flex flex-col h-full
        bg-white/80 backdrop-blur-xl
        rounded-3xl border border-slate-200
        transition-all duration-500 ease-in-out
        ${selectedUser ? "w-[320px]" : "w-[400px]"}
     overflow-y-auto
     scrollbar-hide `}
    >
      {/* --- Fixed Header Section --- */}
      <div className="p-6 pb-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Messages</h2>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ListFilter size={20} className="text-slate-500" />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            placeholder="Search conversations..." 
            className="w-full bg-slate-100/50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 ring-blue-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* --- Scrollable Content Area --- */}
      <div className="flex-1 px-3">
        <div className="flex flex-col gap-1 pb-6">
          {USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(true)}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 transition-all duration-200 group text-left w-full"
            >
              <div className="relative shrink-0">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                {user.id % 3 === 0 && ( // Just an example online status
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-700 truncate">{user.name}</span>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">12:45 PM</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-slate-500 truncate pr-2">
                    {user.latestMsg}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                    <Clock size={10} />
                    <span>{user.lastSeen}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeftSection