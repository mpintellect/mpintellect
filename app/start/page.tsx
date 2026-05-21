// app/start/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// CONFIG
const BROKER_LINK = "https://www.litefinance.org/fr/?uid=967798214&utm_source=mpintellect&utm_medium=refmp&utm_campaign=mpi";
const TOOLS_LINK = "/";

// WhatsApp support number (update with your number)
const WHATSAPP_NUMBER = "+212604065652"; 
const WHATSAPP_MESSAGE = "مرحبا، عندي سؤال بخصوص منصة";
const TELEGRAM_USERNAME = "mpintellect";

export default function StartPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Gateway Page - Moroccan',
        content_language: 'darija',
        target_audience: 'morocco'
      });
    }
  }, []);

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
    <div className="gateway-container">
      <div className="gateway-glow glow-top-left" />
      <div className="gateway-glow glow-bottom-right" />

      <div className="gateway-content-wrapper">
        {/* Header with Moroccan Flag */}
        <div className="gateway-header">
          <div className="flag-badge">
            <Image 
              src="/logos/mo.webp" 
              alt="Morocco Flag" 
              width={32} 
              height={32}
              className="moroccan-flag"
              priority
              loading="eager"
            />
            <span className="exclusive-badge">عرض حصري للمغرب</span>
          </div>
          
          <h1 className="gateway-h1">
            أنت متداول مغربي؟<br />
            <span>هاد الصفحة خصيصاً ليك</span>
          </h1>
          
          <p className="gateway-subtitle">
            اختر المسار المناسب ليك<br />
            بين التحليل والتعلم ولا التداول المباشر مع وسيط موثوق
          </p>
        </div>

        {/* MOBILE ONLY - Quick Action Buttons */}
        {isMobile && (
          <div className="mobile-quick-actions">
            <button onClick={handleBrokerClick} className="mobile-quick-btn broker-quick-btn">
              <span className="icon-emoji">⚡</span>
              <span>تداول مباشر</span>
              <span className="icon-emoji">→</span>
            </button>
            <button onClick={handleToolsClick} className="mobile-quick-btn tools-quick-btn">
              <span className="icon-emoji">📊</span>
              <span>تحليل فني</span>
              <span className="icon-emoji">→</span>
            </button>
          </div>
        )}

        {/* OPTIONS GRID */}
        <div className={`choice-grid ${isMobile ? 'mobile-stack' : ''}`}>

          {/* OPTION A: LiteFinance - Live Trading */}
          <div onClick={handleBrokerClick} className="choice-card choice-card-blue">
            <div className="card-badge broker-badge">
              <span className="icon-emoji">⚡</span> تداول مباشر
            </div>

            <div className="card-logo-top" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', direction: 'ltr' }}>
              <Image 
                src="/logos/lftrans.webp" 
                alt="LiteFinance Logo" 
                width={160} 
                height={48}
                className="broker-logo"
                loading="lazy"
              />
              <div className="flag-icon-small">
                <Image 
                  src="/logos/mo.webp" 
                  alt="" 
                  width={20} 
                  height={20}
                  loading="lazy"
                />
              </div>
            </div>

            {/* TEXT SECTION - LEFT ALIGNED */}
            <div style={{ textAlign: 'left' }}>
              <h3 className="choice-title title-blue">
               LiteFinance - تداول مباشر مع وسيط موثوق
              </h3>

              <p className="choice-desc">
                فتح حساب حقيقي، تنفيذ أوامر سريع، وسحب وإيداع سهل. 
                منصة احترافية للمتداولين المغاربة.
              </p>

              <ul className="feature-list">
                <li className="feature-item">
                  <span className="icon-emoji-small">✅</span> فتح حساب خلال 3 دقائق فقط
                </li>
                <li className="feature-item">
                  <span className="icon-emoji-small">✅</span> إيداع وسحب بالدرهم المغربي
                </li>
                <li className="feature-item">
                  <span className="icon-emoji-small">✅</span> MetaTrader 4, MetaTrader 5, cTrader
                </li>
                <li className="feature-item">
                  <span className="icon-emoji-small">✅</span> دعم بالدارجة والفرونسي والعربية
                </li>
                <li className="feature-item">
                  <span className="icon-emoji-small">✅</span> أسواق عالمية: عملات، ذهب، مؤشرات
                </li>
              </ul>
            </div>

            <button className="choice-btn choice-btn-primary">
              افتح الحساب الآن 🚀 <span className="icon-emoji">→</span>
            </button>
          </div>

          {/* OPTION B: MPIntellect - Analysis Tools */}
          <Link href={TOOLS_LINK} className="block h-full" onClick={handleToolsClick}>
            <div className="choice-card choice-card-green">
              <div className="card-badge free-badge">
                <span className="icon-emoji">📊</span> تحليل فني 
              </div>

              <div className="card-logo-top" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', direction: 'ltr' }}>
                <Image 
                  src="/logos/mzlogo.webp" 
                  alt="MPIntellect Logo" 
                  width={160} 
                  height={48}
                  className="mpi-logo"
                  loading="lazy"
                />
                <div className="flag-icon-small">
                  <Image 
                    src="/logos/mo.webp" 
                    alt="" 
                    width={20} 
                    height={20}
                    loading="lazy"
                  />
                </div>
              </div>

              {/* TEXT SECTION - LEFT ALIGNED */}
              <div style={{ textAlign: 'left', paddingLeft: '35px' }}>
                <h3 className="choice-title title-green">
                  أدوات MPIntellect – تحليل السوق
                </h3>

                <p className="choice-desc">
                  تحليل فني وبيانات السوق. 
                  مناسب للتعليم والبحث قبل ما تبدأ التداول.
                </p>

                <ul className="feature-list">
                  <li className="feature-item">
                    <span className="icon-emoji-small">✅</span> شاهد تحليل الأسواق اليومي – عملات، ذهب، مؤشرات
                  </li>
                  <li className="feature-item">
                    <span className="icon-emoji-small">✅</span> استراتيجيات تداول جاهزة ومجربة
                  </li>
                  <li className="feature-item">
                    <span className="icon-emoji-small">✅</span> تعلم أساسيات التداول من الصفر
                  </li>
                  <li className="feature-item">
                    <span className="icon-emoji-small">✅</span> أدوات تفاعلية لفهم اتجاهات السوق
                  </li>
                  <li className="feature-item">
                    <span className="icon-emoji-small">✅</span> ممارسة بدون مخاطرة – مثالي للمبتدئين
                  </li>
                </ul>
              </div>

              <button className="choice-btn choice-btn-secondary">
                شوف التحليل الآن 📊 <span className="icon-emoji">→</span>
              </button>
            </div>
          </Link>
        </div>

        {/* Contact Support Buttons - Linktree & Telegram */}
<div className="contact-buttons">
  {/* Linktree Button - All channels */}
  <button onClick={handleContactClick} className="contact-btn main-contact-btn">
    <div className="contact-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </div>
    <div className="contact-text">
      <span className="contact-title">مركز الدعم</span>
      <span className="contact-subtitle">جميع القنوات</span>
    </div>
  </button>

  {/* Telegram Button - Direct Contact */}
  <button onClick={handleTelegramClick} className="contact-btn telegram-btn">
    <div className="contact-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#26A5E4"/>
        <path d="M16.5 8.5L7.5 12l3.5 1.5L14 15l1-3.5-1-3z" fill="white"/>
        <path d="M11 13l-1 3-2-2 3-1z" fill="white" opacity="0.8"/>
      </svg>
    </div>
    <div className="contact-text">
      <span className="contact-title">تيليغرام</span>
      <span className="contact-subtitle">تواصل مباشر</span>
    </div>
  </button>
</div>

        {/* Footer */}
        <div className="gateway-footer">
          <p className="gateway-disclaimer">
            <strong>تنبيه:</strong> أدوات MPIntellect ديال التحليل فقط للمعلومات والتعليم. 
            الوسيط الخارجي (LiteFinance) مستقل وعندو شروطو الخاصة. 
            التداول فيه مخاطرة مالية، تأكد باش تفهم المخاطر قبل ما تبدأ.
          </p>
        </div>
      </div>
    </div>
  );
}