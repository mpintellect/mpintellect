// app/client/dashboard/refer/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
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

  // Initialize Cloudflare auth state
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('cf_token');
      const userData = localStorage.getItem('cf_user');
      
      if (!token || !userData) {
        router.push("/client/login");
        return;
      }

      try {
        // Verify token with Cloudflare API
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const user = data.user;
            setUser(user);
            
            // Get referral code from user data
            if (user.referral_code) {
              setReferralCode(user.referral_code);
            } else if (user.id) {
              // Use part of user ID as fallback
              setReferralCode(user.id.substring(0, 8).toUpperCase());
            }
            
            // Fetch referral stats
            await fetchStats(user.id);
          } else {
            // Token invalid, redirect to login
            localStorage.removeItem('cf_token');
            localStorage.removeItem('cf_user');
            localStorage.removeItem('cf_session_id');
            router.push("/client/login");
          }
        } else {
          // Token invalid, redirect to login
          localStorage.removeItem('cf_token');
          localStorage.removeItem('cf_user');
          localStorage.removeItem('cf_session_id');
          router.push("/client/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/client/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchStats = async (userId: string) => {
    try {
      // Get referral stats from Cloudflare D1
      const response = await fetch(`/api/user/referral-stats?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats({
            count: data.referralCount || 0,
            earned: (data.referralCount || 0) * 5 // 5 setups per referral
          });
        }
      }
    } catch(e) {
      console.error("Error fetching referral stats:", e);
    }
  };

  const referralLink = typeof window !== "undefined" 
    ? `${window.location.origin}/client/register?ref=${referralCode}` 
    : `https://mpintellect.com/client/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copied!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MPIntellect Intelligence Trading',
          text: 'Join me on MPIntellect Intelligence and get free AI trading setups!',
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('cf_token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          referralCode: inputCode.trim()
        })
      });
      const data = await res.json();
      if(res.ok) {
        toast.success("🎉 Referral Redeemed!");
        fetchStats(user.id);
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
            placeholder="Enter Referral Code" 
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