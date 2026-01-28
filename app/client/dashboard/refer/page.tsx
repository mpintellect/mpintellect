"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { getAuthInstance, getDbInstance } from "@/app/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Copy, Share2, Users, Zap, Gift, ArrowLeft } from "lucide-react"; 
import toast from "react-hot-toast";

export const dynamic = "force-dynamic";

export default function ReferPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [referralCode, setReferralCode] = useState("");
  const [stats, setStats] = useState({ count: 0, earned: 0 });
  const [loading, setLoading] = useState(true);
  const [inputCode, setInputCode] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);

  // Initialize Firebase auth state
  useEffect(() => {
    try {
      const auth = getAuthInstance();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        if (user) {
          setReferralCode(user.uid);
          fetchStats(user.uid);
        } else {
          setLoading(false);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization error:", error);
      setLoading(false);
    }
  }, []);

  const fetchStats = async (userId: string) => {
    try {
      const db = getDbInstance();
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        const count = data.referralsCount || 0;
        setStats({
          count: count,
          earned: count * 5
        });
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const referralLink = typeof window !== "undefined" 
    ? `${window.location.origin}/register?ref=${referralCode}` 
    : `https://mzprimer.com/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copied!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MZPrimer AI Trading',
          text: 'Join me on MZPrimer and get free AI trading setups!',
          url: referralLink,
        });
      } catch (err) { console.log("Share failed", err); }
    } else {
      handleCopy();
    }
  };

  const handleRedeem = async () => {
    if(!inputCode || inputCode.length < 5) return toast.error("Invalid code");
    if (!user) return toast.error("You must be logged in");
    
    setRedeemLoading(true);

    try {
      const res = await fetch('/api/referral/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUserId: user.uid,
          referralCode: inputCode.trim()
        })
      });
      const data = await res.json();
      if(res.ok) {
        toast.success("🎉 Referral Redeemed!");
        fetchStats(user.uid); // Pass the userId parameter
      } else {
        toast.error(data.error || "Failed to redeem");
      }
    } catch(e) {
      toast.error("Network error");
    } finally {
      setRedeemLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  return (
    <div className="referral-container relative">
      
      {/* BACK BUTTON using Global CSS */}
      <div className="referral-back-wrapper">
        <button 
          onClick={() => router.push('/client/dashboard')}
          className="btn-referral-back"
        >
          <ArrowLeft size={18} />
          <span className="back-text">Dashboard</span>
        </button>
      </div>

      {/* HEADER */}
      <div className="referral-header mt-12 md:mt-0">
        <h1 className="referral-title">
          <Gift className="text-yellow-500" size={32} /> 
          Refer & Earn
        </h1>
        <p className="referral-subtitle">
          Invite friends. Get <span className="text-green-400 font-bold">+5 Setups</span> for each join.
        </p>
      </div>

      {/* 1. UNIQUE LINK CARD */}
      <div className="referral-hero-card">
        <h3 className="referral-hero-label">Your Unique Referral Link</h3>
        
        <div className="referral-link-box">
          <div className="referral-input-readonly">
            {referralLink}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={handleCopy} className="btn-referral-copy">
              <Copy size={18} /> <span className="hidden md:inline">Copy Link</span><span className="md:hidden">Copy</span>
            </button>
            <button onClick={handleShare} className="btn-referral-share">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="referral-stats-grid">
        <div className="stat-card">
          <div>
            <p className="stat-label">Friends Joined</p>
            <h2 className="stat-value">{stats.count}</h2>
          </div>
          <div className="stat-icon-circle icon-blue">
            <Users size={32} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="stat-label">Credits Earned</p>
            <h2 className="stat-value highlight">+{stats.earned}</h2>
          </div>
          <div className="stat-icon-circle icon-green">
            <Zap size={32} />
          </div>
        </div>
      </div>

      {/* 3. REDEEM SECTION */}
      <div className="referral-redeem-card">
        <h3 className="redeem-title">Received a code from a friend?</h3>
        <div className="redeem-form">
          <input 
            type="text" 
            placeholder="Enter Referral UID" 
            className="referral-input-field"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
          <button 
            onClick={handleRedeem}
            disabled={redeemLoading || !user}
            className="btn-redeem"
          >
            {redeemLoading ? '...' : 'Redeem'}
          </button>
        </div>
        {!user && (
          <p className="text-sm text-zinc-500 mt-2 text-center">
            You need to be logged in to redeem a referral code.
          </p>
        )}
      </div>
    </div>
  );
}