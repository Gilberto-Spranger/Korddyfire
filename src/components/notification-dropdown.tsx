"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";

export function NotificationDropdown() {
  const { session } = useAuth();
  const { notifications, unreadCount, connect, disconnect, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      connect(session.user.id);
    }
    return () => {
      disconnect();
    };
  }, [session, connect, disconnect]);

  // Request Notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, []);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 z-50 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notificações</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline">
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                Nenhuma notificação no momento.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b border-gray-50 dark:border-zinc-800/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notif.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
