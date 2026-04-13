"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {  Search, ListFilter, Loader2 } from "lucide-react";
import { getAllUserForLeftSideBar, markSeen } from "@/server-action/leftSidebar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { socket  } from "@/lib/scoket"; // Import your socket instance
export type User = {
    unseenMessageCount: number;
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    lastseen: Date;
    about: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface UserAll extends User {
  unseenMessageCount: number;
}

interface Props {
  selectedUser: User | null; // Changed to allow null
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
}

function LeftSection({ selectedUser, setSelectedUser }: Props) {
  const [users, setUsers] = useState<UserAll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [logged, setLogged] = useState<string>("");
const [online,setOnline]=useState<boolean>(false)
const [onUser,setOnUser]=useState()
  // Effect 1: Socket connection lifecycle (runs once on mount)
  useEffect(() => {
    const initChat = async () => {
      try {
        setLoading(true);
        const { data: session } = await authClient.getSession();
        const loggedUserId = session?.user?.id;

        if (loggedUserId) {
          setLogged(loggedUserId);

          // Wait for socket to actually connect before registering
          socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            setOnline(true)
            socket.emit("register_user", loggedUserId);
          });

          socket.connect();
          socket.on("online_user",(users)=>{
            setOnUser( users)
          })
          // Fetch Initial List
          const result = await getAllUserForLeftSideBar(loggedUserId);

          if (result){ 
            setUsers(result);
          
          }
        }
      } catch (error) {
        toast.error("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // Cleanup on unmount only
    return () => {
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

  // Effect 2: Listen for incoming messages (re-subscribes when selectedUser changes)
  useEffect(() => {
    const handleIncomingMessage = (newMessage: any) => {
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.id === newMessage.senderId) {
            // Only increment if we aren't currently looking at their chat
            const isNotSelected = selectedUser?.id !== u.id;
            return {
              ...u,
              unseenMessageCount: isNotSelected 
                ? u.unseenMessageCount + 1 
                : 0,
            };
          }
          return u;
        })
      );
    };

    socket.on("receive_private_message", handleIncomingMessage);

    return () => {
      socket.off("receive_private_message", handleIncomingMessage);
    };
  }, [selectedUser?.id]);

  const markedSeen = async (id: string, clickedUser: UserAll) => {
  try {
    await markSeen(id, logged); // Fixed order: sender is the other user, receiver is 'logged'
    setSelectedUser(clickedUser);
    
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === id ? { ...u, unseenMessageCount: 0 } : u
      )
    );
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div
      className={`
        flex flex-col h-full
        bg-white/80 backdrop-blur-xl
        rounded-3xl border border-slate-200
        transition-all duration-500 ease-in-out
        ${selectedUser ? "w-[320px]" : "w-[400px]"}
        overflow-hidden`} // Changed to hidden; scroll inner container
    >
      {/* Header Section */}
      <div className="p-6 pb-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Messages
          </h2>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ListFilter size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            placeholder="Search conversations..."
            className="w-full bg-slate-100/50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 ring-blue-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* List Section */}
      <div className="flex-1 overflow-y-auto px-3 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-slate-400">
            <Loader2 className="animate-spin" />
            <span className="text-xs">Loading chats...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1 pb-6">
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <button
                  onClick={()=>markedSeen(user.id,user)}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group text-left w-full
                    ${selectedUser?.id === user.id ? "bg-blue-50" : "hover:bg-slate-100"}
                  `}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {/* Status Indicator */}
                  {/* {onUser && user.id in onUser &&  <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></div>} */}
                  </div>

                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline">
                      <span className={`font-semibold truncate ${selectedUser?.id === user.id ? "text-blue-600" : "text-slate-700"}`}>
                        {user.name}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 shrink-0">
                        12:45 PM
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-slate-500 truncate pr-2">
                        {/* You can add last message text here later */}
                        Click to view messages
                      </p>
                      
                      {user.unseenMessageCount > 0 && (
                        <div className="min-w-[18px] h-[18px] px-1 flex justify-center items-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
                          {user.unseenMessageCount}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
                <div className="mx-4 border-b border-slate-50 last:border-0" />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftSection;