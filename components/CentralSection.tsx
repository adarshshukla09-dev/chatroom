"use client"

import React, { Dispatch, SetStateAction } from 'react'
import { MoreHorizontal, Phone, Search, Video } from 'lucide-react'

function CentralSection({ selectedUser }: { selectedUser: boolean }) {
  return (
    <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 overflow-hidden">
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-white/40">
            <div className="flex items-center gap-3">
              <div className="font-semibold text-slate-800">Adharsh 1</div>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <Phone size={20} className="cursor-pointer hover:text-primary transition-colors" />
              <Video size={20} className="cursor-pointer hover:text-primary transition-colors" />
              <MoreHorizontal size={20} className="cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>
          
          {/* Messages Placeholder */}
          <div className="flex-1 bg-slate-50/50 p-6 flex flex-col justify-end">
            <div className="self-end bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-xs text-sm shadow-sm">
              Hey! I finished the UI improvements we discussed.
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
             <div className="bg-slate-100 rounded-2xl px-4 py-3">
                <input placeholder="Type a message..." className="bg-transparent border-none outline-none w-full text-sm" />
             </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
             <Search size={32} />
          </div>
          <p>Select a contact to start messaging</p>
        </div>
      )}
    </div>
  )
}

export default CentralSection