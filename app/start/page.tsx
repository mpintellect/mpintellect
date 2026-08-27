// app/start/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/app/hooks/useSession';

// CONFIG
const BROKER_LINK = "https://www.litefinance.org/fr/?uid=967798214&utm_source=mpintellect&utm_medium=refmp&utm_campaign=mpi";
const TOOLS_LINK = "/";

// WhatsApp support number
const WHATSAPP_NUMBER = "+212604065652";
const WHATSAPP_MESSAGE = "مرحبا، عندي سؤال بخصوص منصة";
const TELEGRAM_USERNAME = "mpintellect";

// useSession() returns English session names (matches the Hero/ticker
// convention) - this page is entirely in Darija, so map to Arabic instead
// of mixing scripts mid-sentence.
const SESSION_NAME_AR: Record<string, string> = {
  LONDON: 'لندن',
  'NEW YORK': 'نيويورك',
  TOKYO: 'طوكيو',
  SYDNEY: 'سيدني',
  ROLLOVER: 'التجديد',
  OFFLINE: 'مغلقة',
};

export default function StartPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [randomCount, setRandomCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'broker' | 'tools'>('broker');
  const { sessionName, isWeekend } = useSession();

  useEffect(() => {
    // Set random number for FOMO (client-side only)
    setRandomCount(Math.floor(Math.random() * 30) + 10);
    
    // Facebook Pixel tracking with retry logic
    const trackViewContent = () => {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'ViewContent', {
          content_name: 'Gateway Page - Moroccan',
          content_language: 'darija',
          target_audience: 'morocco'
        });
      } else {
        setTimeout(trackViewContent, 300);
      }
    };
    
    setTimeout(trackViewContent, 500);
    
    // Show popup after 2.5 seconds
    const popupTimer = setTimeout(() => {
      const popupClosed = sessionStorage.getItem('popup_closed');
      if (!popupClosed) {
        setShowPopup(true);
      }
    }, 2500);
    
    return () => {
      clearTimeout(popupTimer);
    };
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem('popup_closed', 'true');
  };

  const handlePopupTelegram = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'Popup_Telegram_Click', {
        action: 'popup_cta',
        destination: 'telegram'
      });
    }
    window.open('https://t.me/mpintellect', '_blank');
    closePopup();
  };

  const handleBrokerClick = () => {
    if ((window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'LiteFinance Registration',
        destination: 'broker'
      });
    }
    window.location.href = BROKER_LINK;
  };

  const handleToolsClick = () => {
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'Tools_Click', {
        content_name: 'MPIntellect Tools',
        destination: 'analysis'
      });
    }
  };

  const handleWhatsAppClick = () => {
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'WhatsApp_Support', {
        action: 'contact_support'
      });
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`, '_blank');
  };

  const handleContactClick = () => {
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'Linktree_Click', {
        action: 'contact_center',
        destination: 'linktree'
      });
    }
    window.open('https://linktr.ee/LiteFinanceMorocco', '_blank');
  };

  const handleTelegramClick = () => {
    if ((window as any).fbq) {
      (window as any).fbq('trackCustom', 'Telegram_Support', {
        action: 'contact_support'
      });
    }
    window.open(`https://t.me/${TELEGRAM_USERNAME}`, '_blank');
  };

  return (
    <>
      {/* FOMO Popup Modal - Small Corner Style */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-container-small" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-small" onClick={closePopup}>×</button>
            
            <div className="popup-icon-small">📱</div>
            
            <p className="popup-text-small">
              <strong>انضم للتيليغرام</strong><br />
              تحليل مجاني + إشارات يومية
            </p>
            
            <div className="popup-fomo-small">
  🇲🇦 انضم للمتداولين المغاربة
</div>
            
            <button onClick={handlePopupTelegram} className="popup-btn-small">
              انضم الآن ←
            </button>
          </div>
        </div>
      )}
      
      <div className="start-page">
        <div className="start-glow start-glow-top" />
        <div className="start-glow start-glow-bottom" />

        <div className="start-wrapper">
          {/* Header with Moroccan Flag */}
          <div className="start-header">
            <div className="start-flag-badge start-anim start-anim-1">
              <Image
                src="/logos/mo.webp"
                alt="Morocco Flag"
                width={22}
                height={22}
                className="start-flag-img"
                priority
                loading="eager"
              />
              <span>عرض حصري للمغرب</span>
            </div>

            <h1 className="start-h1 start-anim start-anim-2">
              أنت متداول مغربي؟<br />
              <span className="start-h1-accent">هاد الصفحة خصيصاً ليك</span>
            </h1>

            <p className="start-subtitle start-anim start-anim-3">
              اختر المسار المناسب ليك<br />
              بين التحليل والتعلم ولا التداول المباشر مع وسيط موثوق
            </p>

            {/* Trust strip: real live session status + FOMO activity counter */}
            <div className="start-trust-strip start-anim start-anim-3">
              <span className="start-trust-chip">
                <span className="navbar-live-dot">
                  <span className="navbar-live-dot-ping" />
                  <span className="navbar-live-dot-core" />
                </span>
                {isWeekend ? 'الأسواق مغلقة حالياً' : `جلسة ${SESSION_NAME_AR[sessionName] || sessionName} نشيطة الآن`}
              </span>
              {randomCount > 0 && (
                <span className="start-trust-chip">
                  🔥 +{randomCount} متداول مغربي فتحو حساب هاد الأسبوع
                </span>
              )}
            </div>
          </div>

          {/* Segmented switch - replaces the old "two competing cards"
              layout. One focused panel instead of a side-by-side (or, on
              mobile, stacked-and-duplicated) comparison: less to scan,
              feels like picking a path in an app rather than reading two
              ads, and gives the panel switch somewhere real to animate. */}
          <div className="start-switch start-anim start-anim-4">
            <div
              className="start-switch-indicator"
              style={{ insetInlineStart: activeTab === 'broker' ? '5px' : 'calc(50% + 2px)' }}
            />
            <button
              className={`start-switch-btn ${activeTab === 'broker' ? 'active' : ''}`}
              onClick={() => setActiveTab('broker')}
            >
              ⚡ تداول مباشر
            </button>
            <button
              className={`start-switch-btn ${activeTab === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('tools')}
            >
              📊 تحليل فني
            </button>
          </div>

          <div key={activeTab} className="start-panel">
            {activeTab === 'broker' ? (
              <>
                <div className="start-card-logo-row">
                  {/* lftrans.webp is a square 1024x1024 lockup (icon +
                      wordmark + "MOROCCO" stacked vertically), not a wide
                      wordmark - width/height props previously didn't match
                      its real aspect ratio, which made the browser fall
                      back to stretching it to the full row width instead
                      of the intended small logo mark. */}
                  <Image
                    src="/logos/lftrans.webp"
                    alt="LiteFinance Logo"
                    width={80}
                    height={80}
                    className="start-broker-logo"
                  />
                </div>

                <h3 className="start-card-title">
                  LiteFinance - تداول مباشر مع وسيط موثوق
                </h3>

                <p className="start-card-desc">
                  فتح حساب حقيقي، تنفيذ أوامر سريع، وسحب وإيداع سهل.
                  منصة احترافية للمتداولين المغاربة.
                </p>

                <div className="start-stat-row">
                  <div className="start-stat-chip">
                    <span className="start-stat-emoji">⏱</span>
                    <span>3 دقائق</span>
                  </div>
                  <div className="start-stat-chip">
                    <span className="start-stat-emoji">🇲🇦</span>
                    <span>بالدرهم</span>
                  </div>
                  <div className="start-stat-chip">
                    <span className="start-stat-emoji">💬</span>
                    <span>بالدارجة</span>
                  </div>
                </div>

                <ul className="start-feature-list">
                  <li>✅ فتح حساب خلال 3 دقائق فقط</li>
                  <li>✅ إيداع وسحب بالدرهم المغربي</li>
                  <li>✅ MetaTrader 4, MetaTrader 5, cTrader</li>
                  <li>✅ دعم بالدارجة والفرونسي والعربية</li>
                  <li>✅ أسواق عالمية: عملات، ذهب، مؤشرات</li>
                </ul>

                <div className="start-platform-badges">
                  <span className="start-platform-badge">MT4</span>
                  <span className="start-platform-badge">MT5</span>
                  <span className="start-platform-badge">cTrader</span>
                </div>

                <button onClick={handleBrokerClick} className="start-card-btn start-card-btn-primary">
                  افتح الحساب الآن 🚀 <span>→</span>
                </button>
              </>
            ) : (
              <>
                <div className="start-card-logo-row">
                  {/* mzlogo.webp is the square brand mark (same asset used
                      in the Navbar/StickyLogo) - forcing it into
                      LiteFinance's wide 160x48 box made it balloon into an
                      oversized square that dominated the card. A small
                      icon + text wordmark reads as a proper logo lockup
                      instead. */}
                  <Image
                    src="/logos/mzlogo.webp"
                    alt="MPIntellect"
                    width={36}
                    height={36}
                    className="start-mpi-icon"
                  />
                  <span className="start-mpi-wordmark">MPIntellect</span>
                </div>

                <h3 className="start-card-title">
                  أدوات MPIntellect – تحليل السوق
                </h3>

                <p className="start-card-desc">
                  تحليل فني وبيانات السوق.
                  مناسب للتعليم والبحث قبل ما تبدأ التداول.
                </p>

                <div className="start-stat-row">
                  <div className="start-stat-chip">
                    <span className="start-stat-emoji">🆓</span>
                    <span>100% مجاني</span>
                  </div>
                  <div className="start-stat-chip">
                    <span className="start-stat-emoji">📊</span>
                    <span>تحليل يومي</span>
                  </div>
                  <div className="start-stat-chip">
                    <span className="start-stat-emoji">🎓</span>
                    <span>من الصفر</span>
                  </div>
                </div>

                <ul className="start-feature-list">
                  <li>✅ شاهد تحليل الأسواق اليومي – عملات، ذهب، مؤشرات</li>
                  <li>✅ استراتيجيات تداول جاهزة ومجربة</li>
                  <li>✅ تعلم أساسيات التداول من الصفر</li>
                  <li>✅ أدوات تفاعلية لفهم اتجاهات السوق</li>
                  <li>✅ ممارسة بدون مخاطرة – مثالي للمبتدئين</li>
                </ul>

                <Link href={TOOLS_LINK} onClick={handleToolsClick} className="start-card-btn start-card-btn-secondary">
                  شوف التحليل الآن 📊 <span>→</span>
                </Link>
              </>
            )}
          </div>

          {/* Contact Support Buttons - Linktree & Telegram */}
          <div className="start-contact-row start-anim start-anim-7">
            {/* Linktree Button - All channels */}
            <button onClick={handleContactClick} className="start-contact-btn">
              <div className="start-contact-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div className="start-contact-text">
                <span className="start-contact-title">مركز الدعم</span>
                <span className="start-contact-subtitle">جميع القنوات</span>
              </div>
            </button>

            {/* Telegram Button - Direct Contact */}
            <button onClick={handleTelegramClick} className="start-contact-btn">
              <div className="start-contact-icon start-contact-icon-telegram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#26A5E4"/>
                  <path d="M16.5 8.5L7.5 12l3.5 1.5L14 15l1-3.5-1-3z" fill="white"/>
                  <path d="M11 13l-1 3-2-2 3-1z" fill="white" opacity="0.8"/>
                </svg>
              </div>
              <div className="start-contact-text">
                <span className="start-contact-title">تيليغرام</span>
                <span className="start-contact-subtitle">تواصل مباشر</span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="start-footer">
            <p className="start-disclaimer">
              <strong>تنبيه:</strong> أدوات MPIntellect ديال التحليل فقط للمعلومات والتعليم.
              الوسيط الخارجي (LiteFinance) مستقل وعندو شروطو الخاصة.
              التداول فيه مخاطرة مالية، تأكد باش تفهم المخاطر قبل ما تبدأ.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}