'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, Check, Clock, Sparkles } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationAsRead } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Notifications & Alerts
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time updates regarding application status changes, new invitations, and reviews.
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h4 className="font-bold text-gray-900 text-sm">No notifications</h4>
          <p className="text-xs text-gray-400 mt-1">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                notif.read ? 'bg-white border-gray-200 opacity-75' : 'bg-blue-50/60 border-blue-200 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notif.read ? 'bg-gray-100 text-gray-500' : 'bg-blue-600 text-white'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{notif.title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-gray-400 mt-1 block font-mono">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

