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
const TELEGRAM_USERNAME = "LFMaroc";

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

        {/* Contact Support Buttons - WhatsApp & Telegram */}
        <div className="contact-buttons">
          <button onClick={handleWhatsAppClick} className="contact-btn whatsapp-btn">
            <div className="contact-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 2.45.97 4.76 2.55 6.46L3 22l3.54-.96C8.24 22.03 10.09 23 12 23c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#25D366"/>
                <path d="M16.92 15.48c-.28.79-1.65 1.46-2.42 1.51-.65.04-1.22-.13-1.83-.34-1.06-.37-2.21-1.06-3.04-1.89-.83-.83-1.52-1.98-1.89-3.04-.21-.61-.38-1.18-.34-1.83.05-.77.72-2.14 1.51-2.42.23-.08.47-.05.67.11.32.26.66.6.92.95.17.23.33.5.44.79.11.29.07.61-.1.85-.17.24-.38.48-.54.73-.16.25-.34.49-.23.75.26.59.84 1.24 1.43 1.83.59.59 1.24 1.17 1.83 1.43.26.11.5-.07.75-.23.25-.16.49-.37.73-.54.24-.17.56-.21.85-.1.29.11.56.27.79.44.35.26.69.6.95.92.16.2.19.44.11.67z" fill="white"/>
              </svg>
            </div>
            <div className="contact-text">
              <span className="contact-title">واتساب</span>
              <span className="contact-subtitle">دعم بالدارجة</span>
            </div>
          </button>

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