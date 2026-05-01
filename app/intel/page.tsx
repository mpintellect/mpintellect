"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Cloud, 
  Shield, 
  Database, 
  Globe, 
  Code, 
  Users, 
  Lock, 
  Zap, 
  Server, 
  Network, 
  Smartphone,
  BarChart,
  Settings,
  Layers,
  GitBranch,
  Terminal,
  HardDrive,
  Wrench,
  Package,
  Box,
  RefreshCw,
  Monitor,
  Cpu as Processor,
  HardDrive as Hdd,
  MousePointer,
  Gauge,
  TrendingUp
} from 'lucide-react';

export default function IntelLanding() {
  // --- DOMAIN DETECTION ---
  const [isLandingDomain, setIsLandingDomain] = useState(false);
  
  useEffect(() => {
    const hostname = window.location.hostname;
    setIsLandingDomain(
      hostname === 'mzprimer.com' || 
      hostname === 'www.mzprimer.com' ||
      hostname.includes('mzprimer-landing')
    );
  }, []);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    companyName: '',
    regNo: '',
    contactPerson: '',
    position: '',
    email: '',
    phone: '',
    category: '',
    requirements: ''
  });
  const [hp, setHp] = useState(''); // Honeypot
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<null | {ok:boolean; error?:string}>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult(null);

    // Combine B2B data into a structured message for your existing email API
    const structuredMessage = `
      B2B INQUIRY DETAILS:
      --------------------
      Company: ${formData.companyName}
      Reg No: ${formData.regNo}
      Position: ${formData.position}
      Phone: ${formData.phone}
      Category: ${formData.category}
      
      REQUIREMENTS:
      ${formData.requirements}
    `;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.contactPerson, 
          email: formData.email, 
          message: structuredMessage, 
          hp 
        }),
      });
      
      const data = await res.json();
      if (data.ok) {
        setResult({ ok: true });
        setFormData({
          companyName: '', regNo: '', contactPerson: '',
          position: '', email: '', phone: '',
          category: '', requirements: ''
        });
      } else {
        setResult({ ok: false, error: data.error || 'Failed to send' });
      }
    } catch (err) {
      setResult({ ok: false, error: 'Network error' });
    } finally {
      setSending(false);
    }
  }

  // Original French service description translated to English
  const frenchServicesEnglish = [
    {
      icon: Package,
      name: 'Custom Software Solutions',
      desc: 'Development, supply and adaptation of IT solutions designed to optimize the use of digital technologies by both individuals and businesses.'
    },
    {
      icon: Box,
      name: 'Hardware Distribution & Implementation',
      desc: 'Distribution and implementation of hardware, software, peripherals and applications, with installation, configuration and maintenance services.'
    },
    {
      icon: Layers,
      name: 'System Integration',
      desc: 'Execution of activities focused on system integration, digital tool modernization and enhancement of technology services promoting user productivity and efficiency.'
    },
    {
      icon: Wrench,
      name: 'Installation & Configuration',
      desc: 'Professional setup and configuration of IT infrastructure, software deployment, and system optimization for peak performance.'
    },
    {
      icon: RefreshCw,
      name: 'Maintenance & Support',
      desc: 'Ongoing technical maintenance, troubleshooting, and regular updates to ensure continuous operation of all IT systems.'
    },
    {
      icon: Gauge,
      name: 'Digital Tool Modernization',
      desc: 'Upgrading legacy digital tools and implementing modern solutions to enhance operational efficiency and user experience.'
    },
    {
      icon: TrendingUp,
      name: 'Productivity Enhancement',
      desc: 'Strategic implementation of technology solutions specifically designed to boost organizational productivity and workflow efficiency.'
    },
    {
      icon: Monitor,
      name: 'Peripheral Integration',
      desc: 'Seamless integration of peripherals and hardware accessories with existing systems for expanded functionality.'
    }
  ];

  const softwareDevServices = [
    { icon: Code, name: 'Custom Software Development', desc: 'Bespoke enterprise applications tailored to specific business needs' },
    { icon: Smartphone, name: 'Mobile App Development', desc: 'Native and cross-platform mobile solutions for iOS and Android' },
    { icon: Terminal, name: 'API Development & Integration', desc: 'RESTful and GraphQL APIs with seamless third-party integration' },
    { icon: Database, name: 'Database Design & Management', desc: 'SQL, NoSQL, and proprietary database architecture' },
    { icon: Layers, name: 'Enterprise Resource Planning', desc: 'Custom ERP systems for business process automation' },
    { icon: BarChart, name: 'Business  Tools', desc: 'Analytics platforms and reporting dashboards' },
    
    { icon: Cpu, name: 'Embedded Systems Development', desc: 'Firmware and IoT device programming' },
    { icon: Users, name: 'CRM Systems', desc: 'Customer relationship management platforms' },
    { icon: Zap, name: 'Real-Time Trading Software', desc: 'Low-latency execution systems for financial markets' },
    { icon: Globe, name: 'E-Commerce Platforms', desc: 'Scalable online retail and payment solutions' },
    { icon: HardDrive, name: 'Legacy System Modernization', desc: 'Migration and upgrade of outdated systems' },
  ];

  const itServiceActivities = [
    { icon: Cloud, name: 'Cloud Infrastructure Management', desc: 'AWS, Azure, and Google Cloud platform optimization' },
    { icon: Shield, name: 'Cybersecurity Implementation', desc: 'Zero-trust architecture and threat detection' },
    { icon: Network, name: 'Network Architecture Design', desc: 'Enterprise-grade network infrastructure' },
    { icon: Server, name: 'IT Infrastructure Management', desc: 'Server maintenance and hardware optimization' },
    
    { icon: Globe, name: 'CDN & Edge Computing', desc: 'Global content delivery and edge optimization' },
    { icon: Users, name: 'IT Consulting & Strategy', desc: 'Technology roadmap and digital transformation' },
    { icon: Settings, name: '24/7 Technical Support', desc: 'Round-the-clock IT assistance and monitoring' },
    
    
    { icon: Cloud, name: 'Cloud Migration Services', desc: 'Seamless transition to cloud infrastructure' },
    { icon: Network, name: 'VPN & Remote Access Solutions', desc: 'Secure remote work infrastructure' },
    
    { icon: Code, name: 'System Integration', desc: 'Connecting disparate business systems' },
    { icon: Lock, name: 'Identity & Access Management', desc: 'Authentication and authorization systems' },
    { icon: BarChart, name: 'IT Audit & Assessment', desc: 'Comprehensive technology infrastructure review' },
    { icon: Globe, name: 'Domain & Hosting Management', desc: 'DNS, hosting, and email server administration' },
    
    
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* 1. INDEPENDENT HEADER - Hidden on landing domain */}
      {!isLandingDomain && (
        <nav className="border-b border-white/5 py-6 px-6 md:py-8 md:px-12 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50 bg-[#050505]/80">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-sm transform transition-transform group-hover:scale-110 group-hover:rotate-3">
              <span className="text-black font-black text-sm">MZ</span>
            </div>
            <div>
              <span className="text-sm md:text-xl font-bold tracking-[4px] md:tracking-[6px] uppercase">Intel</span>
              <span className="text-[#D4AF37] text-sm md:text-xl font-bold tracking-[4px] md:tracking-[6px] uppercase ml-1">Systems</span>
            </div>
          </div>
          <div className="hidden md:flex gap-10">
            <Link href="#solutions" className="text-xs tracking-[3px] uppercase text-[#94a3b8] hover:text-white transition-all hover:tracking-[4px]">
              Solutions
            </Link>
            <Link href="#software" className="text-xs tracking-[3px] uppercase text-[#94a3b8] hover:text-white transition-all hover:tracking-[4px]">
              Development
            </Link>
            <Link href="#it-services" className="text-xs tracking-[3px] uppercase text-[#94a3b8] hover:text-white transition-all hover:tracking-[4px]">
              Infrastructure
            </Link>
            <Link href="#contact" className="text-xs tracking-[3px] uppercase text-[#94a3b8] hover:text-white transition-all hover:tracking-[4px]">
              Contact
            </Link>
          </div>
          <div className="md:hidden flex gap-4">
            <Link href="#solutions" className="text-[10px] tracking-[3px] uppercase text-[#94a3b8]">Solutions</Link>
            <Link href="#contact" className="text-[10px] tracking-[3px] uppercase text-[#94a3b8]">Contact</Link>
          </div>
        </nav>
      )}

      {/* 2. HERO SECTION */}
      <section className="pt-20 md:pt-32 pb-16 md:pb-20 px-6 md:px-12 max-w-7xl mx-auto relative">
        <div className="absolute top-40 right-0 text-[200px] font-black text-white/5 select-none hidden lg:block">
          IT SOLUTIONS
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-8 md:mb-12 animate-fade-in">
          COMPLETE <br /> 
          <span className="text-[#D4AF37] relative inline-block">
            TECHNOLOGY
            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#D4AF37]/30"></span>
          </span> 
          <br />
          SOLUTIONS.
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-[#94a3b8] font-light leading-relaxed mb-8 md:mb-12 animate-fade-in-up animation-delay-300">
          From software development to hardware implementation. Complete IT solutions for businesses 
          and individuals, including installation, configuration, and maintenance services.
        </p>
        
        <div className="flex flex-wrap gap-4 mt-12 md:mt-16">
          <div className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full">
            <span className="text-[10px] font-mono text-[#D4AF37]">SOFTWARE</span>
          </div>
          <div className="px-4 py-2 bg-[#10B981]/10 border border-[#10B981]/20 rounded-full">
            <span className="text-[10px] font-mono text-[#10B981]">HARDWARE</span>
          </div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <span className="text-[10px] font-mono text-white/60">INTEGRATION</span>
          </div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <span className="text-[10px] font-mono text-white/60">MAINTENANCE</span>
          </div>
        </div>
      </section>

     {/* 2.5 AI BUSINESS AUTOMATION - CORE SERVICES */}
<section className="py-24 md:py-32 px-6 md:px-12 bg-[#080808]">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-xs font-bold tracking-[10px] uppercase text-[#D4AF37] mb-4">
        CORE COMPETENCY • AI BUSINESS AUTOMATION
      </h2>
      <h3 className="text-3xl md:text-5xl font-light mb-6">
        Transform Your Business with <span className="font-bold text-[#D4AF37]">Intelligent Automation</span>
      </h3>
      <p className="text-[#94a3b8] max-w-2xl mx-auto">
        We help enterprises automate processes, enhance quality, and drive efficiency through 
        advanced AI integration. Our core mission is to future-proof your operations.
      </p>
    </div>

    {/* Core Value Proposition */}
    <div className="grid md:grid-cols-2 gap-12 mb-16 p-8 md:p-12 bg-[#050505] border border-white/5">
      <div>
        <div className="text-xs font-bold tracking-[8px] uppercase text-[#D4AF37] mb-4">Why Choose Us</div>
        <h3 className="text-2xl md:text-3xl font-light mb-6">
          We Don't Just Implement IT — <span className="font-bold text-[#D4AF37]">We Automate Intelligence</span>
        </h3>
        <p className="text-[#94a3b8] leading-relaxed mb-8">
          At MZ Systems, our primary focus is helping businesses leverage AI to 
          automate complex processes, reduce operational costs, and elevate quality standards. 
          From manufacturing to finance, we deploy intelligent systems that learn, adapt, and 
          optimize your operations in real-time.
        </p>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-2xl font-black text-[#D4AF37] mb-1">87%</div>
            <div className="text-[10px] tracking-wider text-[#94a3b8]">EFFICIENCY GAIN</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-[#D4AF37] mb-1">99.9%</div>
            <div className="text-[10px] tracking-wider text-[#94a3b8]">QUALITY IMPROVEMENT</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-[#D4AF37] mb-1">24/7</div>
            <div className="text-[10px] tracking-wider text-[#94a3b8]">AI OPERATIONS</div>
          </div>
        </div>
      </div>
      <div className="bg-[#0a0a0a] border border-white/5 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-6 p-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-[#D4AF37] rounded-full animate-pulse" 
                 style={{ animationDelay: `${i * 0.2}s` }}></div>
          ))}
        </div>
      </div>
    </div>

    {/* AI Services Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          icon: Cpu,
          title: 'Intelligent Process Automation',
          desc: 'AI-powered automation for repetitive tasks, workflows, and business processes.',
          features: ['Workflow Optimization', 'Task Automation', 'Process Mining']
        },
        {
          icon: Zap,
          title: 'Quality Enhancement Systems',
          desc: 'Machine learning models that monitor, analyze, and improve output quality in real-time.',
          features: ['Real-time Monitoring', 'Defect Detection', 'Quality Analytics']
        },
        {
          icon: TrendingUp,
          title: 'Predictive Operations',
          desc: 'Anticipate issues before they occur with AI-driven predictive maintenance and forecasting.',
          features: ['Predictive Maintenance', 'Demand Forecasting', 'Risk Prevention']
        },
        {
          icon: GitBranch,
          title: 'Cognitive Automation',
          desc: 'Advanced AI that understands context, makes decisions, and executes complex tasks.',
          features: ['Decision Automation', 'Context Awareness', 'Self-optimizing Systems']
        },
        {
          icon: Cloud,
          title: 'AI Infrastructure',
          desc: 'Scalable cloud infrastructure optimized for AI/ML workloads and deployment.',
          features: ['ML Pipeline Setup', 'Model Deployment', 'Inference Optimization']
        },
        {
          icon: Users,
          title: 'Business Intelligence',
          desc: 'Transform data into actionable insights with AI-powered analytics and reporting.',
          features: ['Data Visualization', 'Trend Analysis', 'Automated Reporting']
        }
      ].map((service, index) => {
        const Icon = service.icon;
        return (
          <div key={index} 
               className="group p-8 border border-white/5 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all duration-500">
            <div className="p-3 bg-[#D4AF37]/10 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-lg font-bold mb-3 group-hover:text-[#D4AF37] transition-colors">
              {service.title}
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">
              {service.desc}
            </p>
            <ul className="space-y-1">
              {service.features.map((feature, i) => (
                <li key={i} className="text-xs text-[#D4AF37] pl-4 relative before:content-['→'] before:absolute before:left-0">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* 3. COMPREHENSIVE SOLUTIONS SECTION (French Services in English) */}
      <section id="solutions" className="py-24 md:py-32 px-6 md:px-12 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-[10px] uppercase text-[#D4AF37] mb-4">
              COMPLETE IT ECOSYSTEM
            </h2>
            <h3 className="text-3xl md:text-5xl font-light mb-6">End-to-End Technology Solutions</h3>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">
              Development, supply and adaptation of IT solutions for both individuals and enterprises
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {frenchServicesEnglish.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} 
                     className="group p-6 border border-white/5 hover:border-[#D4AF37]/30 hover:bg-gradient-to-br hover:from-[#D4AF37]/5 hover:to-transparent transition-all duration-500">
                  <div className="mb-4">
                    <div className="p-3 bg-[#D4AF37]/10 rounded-lg inline-block group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {service.name}
                  </h4>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SOFTWARE DEVELOPMENT SERVICES - SIC 62012 */}
      <section id="software" className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-[10px] uppercase text-[#D4AF37] mb-4">
              SIC 62012 • SOFTWARE DEVELOPMENT
            </h2>
            <h3 className="text-3xl md:text-5xl font-light mb-6">Development & Integration</h3>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">
              Complete software engineering services for business and domestic applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwareDevServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} 
                     className="group p-8 border border-white/5 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#D4AF37]/10 rounded-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-sm text-[#94a3b8] leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. IT SERVICE ACTIVITIES - SIC 62090 */}
      <section id="it-services" className="py-24 md:py-32 px-6 md:px-12 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-[10px] uppercase text-[#10B981] mb-4">
              SIC 62090 • IT INFRASTRUCTURE
            </h2>
            <h3 className="text-3xl md:text-5xl font-light mb-6">Hardware & Infrastructure</h3>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">
              Comprehensive technology infrastructure, hardware procurement, and support services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itServiceActivities.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} 
                     className="group p-8 border border-white/5 hover:border-[#10B981]/30 hover:bg-[#10B981]/5 transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#10B981]/10 rounded-lg group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-[#10B981]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2 group-hover:text-[#10B981] transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-sm text-[#94a3b8] leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. SERVICE CATEGORIES SUMMARY */}
      <section className="py-16 px-6 md:px-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-black text-[#D4AF37] mb-2">01</div>
              <div className="text-xs font-bold tracking-wider mb-1">DEVELOPMENT</div>
              <div className="text-[9px] text-white/40">Custom Software & Apps</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#10B981] mb-2">02</div>
              <div className="text-xs font-bold tracking-wider mb-1">HARDWARE</div>
              <div className="text-[9px] text-white/40">Procurement & Configuration</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#D4AF37] mb-2">03</div>
              <div className="text-xs font-bold tracking-wider mb-1">INTEGRATION</div>
              <div className="text-[9px] text-white/40">Systems & Peripherals</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#10B981] mb-2">04</div>
              <div className="text-xs font-bold tracking-wider mb-1">MAINTENANCE</div>
              <div className="text-[9px] text-white/40">Support & Optimization</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. B2B CONTACT SECTION - Professional Inquiry Form */}
<section id="contact" className="py-24 md:py-32 px-6 md:px-12 bg-[#080808]">
  <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <div className="text-center mb-16">
      <h2 className="text-xs font-bold tracking-[10px] uppercase text-[#D4AF37] mb-4">
        BUSINESS INQUIRIES
      </h2>
      <h3 className="text-3xl md:text-5xl font-light mb-6 text-white">Initiate a Partnership</h3>
      <p className="text-[#94a3b8] max-w-2xl mx-auto">
        Submit your corporate requirements and a dedicated account manager will respond within 24 hours.
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-16 items-start">
      {/* Contact Information */}
      <div className="space-y-8">
        <div className="border-l-4 border-[#D4AF37] pl-6">
          <h4 className="text-2xl font-bold mb-2 text-white">Corporate Headquarters</h4>
          <p className="text-[#94a3b8]">71-75 Shelton Street, Covent Garden<br />London, WC2H 9JQ, United Kingdom</p>
        </div>
        
        <div className="border-l-4 border-[#10B981] pl-6">
          <h4 className="text-2xl font-bold mb-2 text-white">Direct Contacts</h4>
          <p className="text-[#94a3b8]">📧 contact@mzprimer.com</p>
        </div>
        
        <div className="border-l-4 border-[#D4AF37] pl-6">
          <h4 className="text-2xl font-bold mb-2 text-white">Company Registration</h4>
          <p className="text-[#94a3b8] mb-1">MZPRIMER LTD</p>
          <p className="text-[#94a3b8]">SIC: 62012, 62090</p>
        </div>
      </div>

      {/* B2B Inquiry Form */}
      <div className="bg-[#050505] p-8 md:p-10 border border-white/5">
        <h4 className="text-2xl font-bold mb-6 text-white">Request a Proposal</h4>
        
        <form className="space-y-6" onSubmit={onSubmit}>
          {/* Honeypot */}
          <input type="text" value={hp} onChange={(e)=>setHp(e.target.value)} className="hidden" tabIndex={-1} />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#94a3b8] mb-2">COMPANY NAME *</label>
              <input 
                name="companyName" type="text" required value={formData.companyName} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] outline-none transition-colors text-white placeholder:text-white/30"
                placeholder="Your Company Ltd."
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#94a3b8] mb-2">REGISTRATION NO.</label>
              <input 
                name="regNo" type="text" value={formData.regNo} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] outline-none transition-colors text-white placeholder:text-white/30"
                placeholder="Company registration"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#94a3b8] mb-2">CONTACT PERSON *</label>
              <input 
                name="contactPerson" type="text" required value={formData.contactPerson} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] outline-none transition-colors text-white placeholder:text-white/30"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#94a3b8] mb-2">POSITION</label>
              <input 
                name="position" type="text" value={formData.position} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] outline-none transition-colors text-white placeholder:text-white/30"
                placeholder="e.g., IT Director, CTO"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#94a3b8] mb-2">BUSINESS EMAIL *</label>
              <input 
                name="email" type="email" required value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] outline-none transition-colors text-white placeholder:text-white/30"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#94a3b8] mb-2">PHONE NUMBER</label>
              <input 
                name="phone" type="tel" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] outline-none transition-colors text-white placeholder:text-white/30"
                placeholder="+44 20 1234 5678"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider text-[#94a3b8] mb-2">SERVICE CATEGORY *</label>
            <select 
              name="category" required value={formData.category} onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] outline-none transition-colors text-white"
            >
              <option value="" className="bg-[#0a0a0a]">Select a service category</option>
              <option value="software" className="bg-[#0a0a0a]">SIC 62012 - Software Development</option>
              <option value="infrastructure" className="bg-[#0a0a0a]">SIC 62090 - IT Infrastructure</option>
              <option value="consulting" className="bg-[#0a0a0a]">Technology Consulting</option>
              <option value="integration" className="bg-[#0a0a0a]">System Integration</option>
              <option value="procurement" className="bg-[#0a0a0a]">Hardware Procurement</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider text-[#94a3b8] mb-2">PROJECT SCOPE / REQUIREMENTS *</label>
            <textarea 
              name="requirements" required rows={5} value={formData.requirements} onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37] outline-none transition-colors text-white placeholder:text-white/30 resize-none"
              placeholder="Please describe your business requirements, timeline, and any specific technical needs..."
            ></textarea>
          </div>

          {/* Corporate Compliance */}
          <div className="flex items-start gap-3">
            <input type="checkbox" id="compliance" required className="mt-1 accent-[#D4AF37]" />
            <label htmlFor="compliance" className="text-sm text-[#94a3b8]">
              I confirm that I represent a registered business and agree to the 
              <Link href="/terms" className="text-[#D4AF37] hover:underline mx-1">Terms of Service</Link> 
              and
              <Link href="/privacy" className="text-[#D4AF37] hover:underline mx-1">Privacy Policy</Link>.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={sending}
            className="w-full py-4 bg-[#D4AF37] text-black font-bold tracking-widest hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
          >
            {sending ? 'TRANSMITTING...' : 'SUBMIT INQUIRY'}
          </button>

          {result && result.ok && (
            <div className="mt-4 p-4 border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-center">
              <p className="text-[#D4AF37] text-xs font-bold">✓ INQUIRY SENT SUCCESSFULLY</p>
            </div>
          )}
          
          {result && !result.ok && (
            <div className="mt-4 p-4 border border-red-500/20 bg-red-500/5 text-center">
              <p className="text-red-400 text-xs font-bold">✗ {result.error || 'ERROR SENDING INQUIRY'}</p>
            </div>
          )}

          <p className="text-xs text-[#94a3b8] text-center mt-4">
            All inquiries are handled by our B2B team. Your information will be processed according to GDPR.
          </p>
        </form>
      </div>
    </div>
  </div>
</section>

      {/* 9. FOOTER - Hidden on landing domain */}
      {!isLandingDomain && (
        <footer className="py-12 md:py-16 px-6 md:px-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[8px] md:text-[10px] tracking-[3px] uppercase text-zinc-600 text-center md:text-left">
              MZ  SYSTEMS • COMPLETE IT SOLUTIONS FOR INDIVIDUALS AND ENTREPRISES
            </div>
            <div className="flex gap-8">
              <Link href="/privacy" className="text-[8px] md:text-[10px] tracking-[3px] uppercase text-zinc-600 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-[8px] md:text-[10px] tracking-[3px] uppercase text-zinc-600 hover:text-white">
                Terms
              </Link>
              <Link href="/compliance" className="text-[8px] md:text-[10px] tracking-[3px] uppercase text-zinc-600 hover:text-white">
                Compliance
              </Link>
            </div>
            <div className="text-[8px] md:text-[10px] tracking-[3px] uppercase text-zinc-600">
              © 2026 MZPRIMER LTD
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}