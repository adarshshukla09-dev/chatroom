"use client"
import React, { useState } from "react";
import LeftSection, { User } from "@/components/LeftScetion";
import CentralSection from "@/components/CentralSection";
import RightSection from "@/components/RightSection";

export default   function HomePage() {

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="flex h-screen w-screen bg-linear-to-br from-slate-100 via-blue-50 to-slate-200 p-4 gap-4 overflow-hidden">
      {/* Left Sidebar */}
      <LeftSection
        selectedUser={selectedUser as User}
        setSelectedUser={setSelectedUser}
      />

      {/* Central Chat Area */}
      <CentralSection selectedUser={selectedUser as User} />

      {/* Right Profile Panel */}
      {selectedUser && <RightSection selectedUser={selectedUser} />}
    </div>
  );
}