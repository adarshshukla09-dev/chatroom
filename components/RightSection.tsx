"use client"

import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Pencil, Image as ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { User } from './LeftScetion'
import { toast } from 'sonner'
import { updateAbout } from '@/server-action/leftSidebar'

interface Props {
  selectedUser: User
  }

function RightSection({ selectedUser }: Props) {
  // Mock data for the media gallery
  const mediaItems = [1, 2, 3, 4, 5, 6]
const [edit,setEdit]=useState<boolean>(false)
const [about,setAbout]=useState<string>(selectedUser.about);
const handlesave = async()=>{
  try {
    await updateAbout(selectedUser.id,about)
  } catch (error) {
    toast.error("Failed to save")
  }
}
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
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-inner bg-linear-to-tr from-slate-100 to-slate-200">
            <img 
              src={selectedUser?.image ? selectedUser.image :`https://i.pinimg.com/474x/f9/05/54/f9055402c54ad21b834774c676ebb571.jpg `} 
              alt="avatar" 
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" title="Online" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">{selectedUser.name}</h2>
          <p className="text-sm text-slate-500">Available</p>
        </div>

        
      </div>

      <hr className="w-full border-slate-200/50 mb-6" />

      
        
        {/* Additional Info Section */}
        <div className="mt-8 space-y-4 w-full">
            <div className="p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">About</p>
                  <button 
                    onClick={() => setEdit(prev => !prev)}
                    className="p-1.5 hover:bg-white rounded-full transition-colors group"
                  >
                    <Pencil size={14} className="text-slate-400 group-hover:text-blue-500" />
                  </button>
                </div>
                
                {edit ? (
                  <div className="mt-2 flex items-center">
                    <Input 
                    value={about}
                    onChange={(e)=>setAbout(e.target.value)}
                      type="text" 
                      className="bg-white/60 border-slate-200 text-sm focus-visible:ring-blue-500 h-9"
                      autoFocus
                    />
                    <button className='bg-blue-600 rounded-xl m-3 p-2 text-white text-sm ' onClick={handlesave}>save</button>
                  </div>
                ) : (
                  <p className="text-sm text-slate-700">Coding the future, one bug at a time. 🚀</p>
                )}
            </div>
        </div>
      </div>
  )
}

export default RightSection