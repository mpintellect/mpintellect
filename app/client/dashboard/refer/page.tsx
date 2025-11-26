"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebaseClient";
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from "firebase/firestore";
import { Copy, Share2, Users, Zap, Gift } from "lucide-react";
import toast from "react-hot-toast";

export default function ReferPage() {
  const [user] = useAuthState(auth);
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState({ count: 0, earned: 0 });
  const [loading, setLoading] = useState(true);
  
  // State for entering a code manually
  const [inputCode, setInputCode] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setReferralCode(user.uid);
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if(!user) return;
    try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Assuming you add a 'referralsCount' field to user doc in your backend logic
            const count = data.referralsCount || 0;
            setStats({
                count: count,
                earned: count * 5
            });
        }
    } catch(e) {}
    setLoading(false);
  };

  const referralLink = `https://mzprimer.com/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MZ Primer AI Trading',
          text: 'Join me on MZ Primer and get AI trading signals!',
          url: referralLink,
        });
      } catch (err) { console.log("Share failed", err); }
    } else {
      handleCopy();
    }
  };

  const handleRedeem = async () => {
    if(!inputCode || inputCode.length < 5) return toast.error("Invalid code");
    setRedeemLoading(true);

    try {
        const res = await fetch('/api/referral/redeem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentUserId: user?.uid,
                referralCode: inputCode.trim()
            })
        });
        const data = await res.json();
        if(res.ok) {
            toast.success("🎉 Success! You are linked.");
            // Optionally refresh user profile to see updated status
        } else {
            toast.error(data.error || "Failed to redeem");
        }
    } catch(e) {
        toast.error("Network error");
    } finally {
        setRedeemLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Referral Hub...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Gift className="text-yellow-500" /> 
            Refer & Earn
        </h1>
        <p className="text-gray-400">
            Invite friends to MZ Primer. You get <span className="text-green-400 font-bold">+5 Setups</span> for every friend who joins.
        </p>
      </div>

      {/* --- 1. YOUR UNIQUE LINK CARD --- */}
      <div className="bg-[#1b1b1b] border border-gray-800 rounded-2xl p-8 mb-8 text-center shadow-lg relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
         
         <h3 className="text-white font-semibold text-lg mb-4">Your Unique Referral Link</h3>
         
         <div className="flex flex-col md:flex-row items-center gap-3 max-w-lg mx-auto">
            <div className="bg-black border border-gray-700 text-gray-300 p-4 rounded-xl w-full font-mono text-sm truncate">
                {referralLink}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <button onClick={handleCopy} className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold p-4 rounded-xl transition flex-1 flex items-center justify-center gap-2">
                    <Copy size={18} /> Copy
                </button>
                <button onClick={handleShare} className="bg-gray-700 hover:bg-gray-600 text-white font-bold p-4 rounded-xl transition">
                    <Share2 size={18} />
                </button>
            </div>
         </div>
      </div>

      {/* --- 2. STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1b1b1b] p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                  <p className="text-gray-500 text-xs uppercase font-bold mb-1">Total Referred</p>
                  <h2 className="text-4xl font-black text-white">{stats.count}</h2>
              </div>
              <div className="bg-blue-900/20 p-4 rounded-full">
                  <Users className="text-blue-500" size={32} />
              </div>
          </div>

          <div className="bg-[#1b1b1b] p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                  <p className="text-gray-500 text-xs uppercase font-bold mb-1">Setups Earned</p>
                  <h2 className="text-4xl font-black text-green-400">+{stats.earned}</h2>
              </div>
              <div className="bg-green-900/20 p-4 rounded-full">
                  <Zap className="text-green-500" size={32} />
              </div>
          </div>
      </div>

      {/* --- 3. HAVE A CODE? (For New Users) --- */}
      <div className="bg-zinc-900/50 border border-dashed border-zinc-700 rounded-xl p-6">
          <h3 className="text-gray-400 font-medium mb-4 text-sm">Have a code from a friend?</h3>
          <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Enter Referrer UID Code" 
                className="bg-black border border-zinc-700 text-white rounded-lg px-4 py-2 flex-1 outline-none focus:border-yellow-500 transition"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
              <button 
                onClick={handleRedeem}
                disabled={redeemLoading}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition"
              >
                {redeemLoading ? 'Verifying...' : 'Redeem'}
              </button>
          </div>
      </div>

    </div>
  );
}