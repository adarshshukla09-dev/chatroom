"use client"

import React, { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Pencil, Image as ImageIcon } from 'lucide-react' // Assuming you have lucide-react

interface Props {
  selectedUser: boolean
  setSelectedUser: Dispatch<SetStateAction<boolean>>
}

function RightSection({ selectedUser, setSelectedUser }: Props) {
  // Mock data for the media gallery
  const mediaItems = [1, 2, 3, 4, 5, 6]

  return (
    <div className={`
      min-h-[calc(100vh-2rem)] flex flex-col items-center 
      bg-white/40 backdrop-blur-xl 
      p-6 m-4 rounded-3xl border border-white/20
      shadow-xl transition-all duration-500 ease-in-out
      w-1/4 max-w-sm
    `}>
      
      {/* Profile Header Section */}
      <div className="flex flex-col items-center w-full space-y-4 mb-8">
        <div className="relative group">
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-inner bg-gradient-to-tr from-slate-100 to-slate-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" 
              alt="avatar" 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" title="Online" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">John Doe</h2>
          <p className="text-sm text-slate-500">Available</p>
        </div>

        <Button variant="outline" className="w-full rounded-xl flex gap-2 bg-white/50 hover:bg-white shadow-sm border-slate-200">
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      <hr className="w-full border-slate-200/50 mb-6" />

      {/* WhatsApp-style Media Section */}
      <div className="w-full flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Media, Links and Docs
          </span>
          <span className="text-xs text-blue-500 font-medium cursor-pointer hover:underline">
            {mediaItems.length} {'>'}
          </span>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-64 scrollbar-hide">
          {mediaItems.map((item) => (
            <div 
              key={item} 
              className="aspect-square rounded-lg bg-slate-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src={`https://picsum.photos/seed/${item + 10}/200`} 
                alt="Shared media" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Additional Info Section */}
        <div className="mt-8 space-y-4 w-full">
            <div className="p-3 rounded-xl bg-white/30 hover:bg-white/50 cursor-pointer transition-colors">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">About</p>
                <p className="text-sm text-slate-700 mt-1">Coding the future, one bug at a time. 🚀</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default RightSection