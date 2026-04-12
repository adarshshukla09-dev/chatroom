"use client";

import React, { useEffect, useState, useRef } from "react";
import { MoreHorizontal, Search, SendHorizonal } from "lucide-react";
import { getChatMessages, sendMessage } from "@/server-action/leftSidebar";
import { authClient } from "@/lib/auth-client";
import { User } from "./LeftScetion";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  seen: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

function CentralSection({ selectedUser }: { selectedUser: User }) {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Current User Session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await authClient.getSession();
      if (session?.user?.id) {
        setCurrentUserId(session.user.id);
      }
    };
    fetchSession();
  }, []);

  // 2. Fetch Messages when selectedUser or currentUserId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUserId) return;
      try {
        setLoading(true);
        const allMessages = await getChatMessages(currentUserId, selectedUser.id);
        setMessages(allMessages || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedUser, currentUserId]);

  // 3. Scroll to bottom whenever messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !currentUserId || !selectedUser) return;

    try {
      const optimisticMsg: Message = {
        id: Math.random().toString(), // Temporary ID
        senderId: currentUserId,
        receiverId: selectedUser.id,
        content: input,
        seen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Update UI immediately (Optimistic UI)
      setMessages((prev) => [...prev, optimisticMsg]);
      const messageContent = input;
      setInput("");

      // Logic Fix: currentUserId is SENDER, selectedUser.id is RECEIVER
      await sendMessage(currentUserId, selectedUser.id, messageContent);
      
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 overflow-y-auto">
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-white/40">
            <div className="flex items-center gap-3">
              <img
                src={selectedUser?.image || `https://i.pinimg.com/474x/f9/05/54/f9055402c54ad21b834774c676ebb571.jpg`}
                className="h-12 w-12 rounded-full object-cover"
                alt={selectedUser.name}
              />
              <div>
                <div className="font-semibold text-slate-800">{selectedUser.name}</div>
                <div className="text-xs text-green-500">Online</div>
              </div>
            </div>
            <MoreHorizontal size={20} className="cursor-pointer text-slate-400" />
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-slate-50/50 p-6 overflow-y-auto flex flex-col gap-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? "self-end bg-blue-600 text-white rounded-tr-none"
                      : "self-start bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-4 flex items-center gap-2 bg-white border-t border-slate-100"
          >
            <div className="flex-1 bg-slate-100 rounded-2xl px-4 py-3">
              <input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 rounded-2xl transition"
            >
              <SendHorizonal className="text-white" size={18} />
            </button>
          </form>
        </>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Search size={32} />
          </div>
          <p>Select a contact to start messaging</p>
        </div>
      )}
    </div>
  );
}

export default CentralSection;