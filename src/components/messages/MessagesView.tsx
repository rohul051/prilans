'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Send, MessageSquare, CheckCheck, Users } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export const MessagesView: React.FC = () => {
  const { currentUser, users } = useApp();

  const otherUsers = users.filter((u) => u.id !== currentUser?.id);
  const [activeContact, setActiveContact] = useState(otherUsers[0] || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !activeContact) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs h-[78vh] flex">
        {/* Contact List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900 text-base">Messages</h3>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
              {otherUsers.length} Contacts
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {otherUsers.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                <Users className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                No other users in Firestore yet.
              </div>
            ) : (
              otherUsers.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    activeContact?.id === contact.id ? 'bg-blue-50/70' : 'hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={contact.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(contact.name)}`}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900 text-xs truncate">
                        {contact.name}
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5 capitalize">
                      {contact.role}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Chat Conversation */}
        <div className="flex-1 flex flex-col bg-gray-50/40">
          {activeContact ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeContact.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activeContact.name)}`}
                    alt={activeContact.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {activeContact.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium capitalize">
                      {activeContact.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-400">
                    <MessageSquare className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="font-semibold text-gray-600">No messages in this chat yet</p>
                    <p className="mt-0.5">Type a message below to start communicating with {activeContact.name}.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-lg ${
                        msg.isSelf ? 'ml-auto flex-row-reverse' : ''
                      }`}
                    >
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                          msg.isSelf
                            ? 'bg-gray-900 text-white rounded-tr-xs'
                            : 'bg-white text-gray-800 border border-gray-200 shadow-xs rounded-tl-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div
                          className={`flex items-center gap-1 justify-end mt-1 text-[10px] ${
                            msg.isSelf ? 'text-gray-400' : 'text-gray-400'
                          }`}
                        >
                          <span>{msg.time}</span>
                          {msg.isSelf && <CheckCheck className="w-3 h-3 text-blue-400" />}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white border-t border-gray-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeContact.name}...`}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-gray-900 hover:bg-black text-white rounded-xl transition-all shadow-sm flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-400">
              <MessageSquare className="w-10 h-10 text-gray-300 mb-2" />
              <p className="font-semibold text-gray-600">Select a contact to begin messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
