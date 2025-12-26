"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, rtdb } from "@/app/lib/firebaseClient";
import { ShieldAlert, Lock, LogOut } from "lucide-react";

// 🛑 CONFIG: ADD YOUR ADMIN EMAILS HERE
const ADMIN_EMAILS = [
  "abdrahman.mez7@gmail.com",
];

interface OnlineUser {
  uid: string;
  email: string;
  state: string;
  current_page: string;
  last_changed: number;
}

export default function LiveUsersPage() {
  // Auth State
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Data State
  const [users, setUsers] = useState<OnlineUser[]>([]);

  // 1. Check Authentication on Load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email && ADMIN_EMAILS.includes(user.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Live Users (Only runs if Admin)
  useEffect(() => {
    if (!isAdmin) return;

    const statusRef = ref(rtdb, "/status");
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setUsers([]);
        return;
      }

      const onlineUsers: OnlineUser[] = [];
      Object.keys(data).forEach((key) => {
        const user = data[key];
        // Filter for active/online users
        if (user.state === "online") {
          onlineUsers.push({ uid: key, ...user });
        }
      });
      setUsers(onlineUsers);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Handle Login Form Submit
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged effect will handle the redirect/state update
    } catch (err: any) {
      setError("Invalid credentials or unauthorized access.");
    }
  };

  // --- RENDER: LOADING ---
  if (authLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Verifying access...</div>;
  }

  // --- RENDER: LOGIN FORM (If not admin) ---
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center border border-red-500/20">
              <Lock className="text-red-500 w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-2">Restricted Access</h1>
          <p className="text-zinc-500 text-center mb-8 text-sm">
            This dashboard monitors live client activity. <br/> Authorized personnel only.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="Admin Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <button 
              type="submit" 
              className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER: LIVE DASHBOARD (If Admin) ---
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-bold text-green-400 flex items-center gap-3">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
          Live Traffic: {users.length}
        </h1>
        <button 
          onClick={() => signOut(auth)}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.uid} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="font-bold text-lg text-white">{user.email}</p>
              </div>
              <p className="text-zinc-600 text-xs font-mono ml-5">UID: {user.uid}</p>
            </div>
            
            <div className="text-right">
              <span className={`px-4 py-1.5 rounded-full text-xs uppercase font-bold tracking-wider ${
                user.current_page.includes('trade') || user.current_page.includes('forecast') 
                  ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30' 
                  : user.current_page.includes('dashboard')
                  ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
                {user.current_page === '/' ? 'HOME PAGE' : user.current_page.replace('/', '').toUpperCase()}
              </span>
              <p className="text-[10px] text-zinc-500 mt-2 font-mono">
                 Active Now
              </p>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
            <ShieldAlert size={48} className="mb-4 opacity-20" />
            <p>No active sessions detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}