"use client"

import React, { useState } from "react"
import CentralSection from "@/components/CentralSection"
import RightSection from "@/components/RightSection"
import LeftSection from "@/components/LeftScetion"

function Page() {
  const [selectedUser, setSelectedUser] = useState<boolean>(false)

  return (
    // Added a subtle background gradient to make the white glass panels pop
    <div className="flex h-screen w-full bg-slate-50 p-2 gap-2 overflow-hidden">
      <LeftSection
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
      <CentralSection 
        selectedUser={selectedUser}
      />
      {selectedUser && (
        <RightSection 
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      )}
    </div>
  )
}

export default Page