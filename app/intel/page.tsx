import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'MZ Intelligence Systems | Enterprise IT Architecture & Software Development',
  description: 'Comprehensive IT services including software development, hardware procurement, system integration, and technology consulting for enterprises.',
};

export default function IntelLanding() {
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
    { icon: BarChart, name: 'Business Intelligence Tools', desc: 'Analytics platforms and reporting dashboards' },
    { icon: GitBranch, name: 'DevOps & CI/CD', desc: 'Automated deployment pipelines and version control' },
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
    { icon: Lock, name: 'Data Protection & GDPR Compliance', desc: 'Regulatory compliance and data governance' },
    { icon: Globe, name: 'CDN & Edge Computing', desc: 'Global content delivery and edge optimization' },
    { icon: Users, name: 'IT Consulting & Strategy', desc: 'Technology roadmap and digital transformation' },
    { icon: Settings, name: '24/7 Technical Support', desc: 'Round-the-clock IT assistance and monitoring' },
    { icon: Database, name: 'Data Backup & Disaster Recovery', desc: 'Business continuity and recovery solutions' },
    { icon: Shield, name: 'Penetration Testing', desc: 'Security auditing and vulnerability assessment' },
    { icon: Cloud, name: 'Cloud Migration Services', desc: 'Seamless transition to cloud infrastructure' },
    { icon: Network, name: 'VPN & Remote Access Solutions', desc: 'Secure remote work infrastructure' },
    { icon: Processor, name: 'Hardware Procurement & Setup', desc: 'Enterprise hardware sourcing and configuration' },
    { icon: Code, name: 'System Integration', desc: 'Connecting disparate business systems' },
    { icon: Lock, name: 'Identity & Access Management', desc: 'Authentication and authorization systems' },
    { icon: BarChart, name: 'IT Audit & Assessment', desc: 'Comprehensive technology infrastructure review' },
    { icon: Globe, name: 'Domain & Hosting Management', desc: 'DNS, hosting, and email server administration' },
    { icon: Settings, name: 'SLA Management', desc: 'Service level agreement monitoring and reporting' },
    { icon: Users, name: 'IT Training & Workshops', desc: 'Staff training on new technologies and systems' },
    { icon: Server, name: 'Virtualization Services', desc: 'VMware, Hyper-V, and containerization' },
    { icon: Hdd, name: 'Peripheral Integration', desc: 'Setup and configuration of printers, scanners, and external devices' },
    { icon: MousePointer, name: 'End-User Computing', desc: 'Workstation setup, software installation, and user support' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* 1. INDEPENDENT HEADER */}
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
        <div className="flex flex-wrap gap-4 md:gap-6 animate-fade-in-up animation-delay-600">
          <Link href="#contact" className="group relative px-8 py-4 bg-[#D4AF37] text-black font-bold text-sm tracking-widest overflow-hidden">
            <span className="relative z-10">DISCUSS YOUR PROJECT</span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </Link>
          <Link href="#solutions" className="px-8 py-4 border border-white/20 text-white/80 hover:text-white hover:border-[#D4AF37]/50 transition-all text-sm tracking-widest">
            EXPLORE SOLUTIONS
          </Link>
        </div>
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

      {/* 7. TECHNOLOGY STACK */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xs font-bold tracking-[10px] uppercase text-[#D4AF37] mb-12">
            Trusted Technologies
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {['Microsoft', 'Apple', 'Dell', 'HP', 'Lenovo', 'Cisco',
              'AWS', 'Azure', 'VMware', 'SAP', 'Oracle', 'Salesforce'].map((tech, i) => (
              <div key={i} className="group">
                <div className="text-xs md:text-sm font-mono text-white/20 group-hover:text-white/60 transition-colors">
                  {tech}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT SECTION */}
      <section id="contact" className="py-24 md:py-32 px-6 md:px-12 bg-white text-black text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-center gap-4 mb-8">
            <span className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-mono">SOFTWARE</span>
            <span className="px-4 py-2 bg-black text-white text-xs font-mono">HARDWARE</span>
            <span className="px-4 py-2 bg-[#10B981] text-black text-xs font-mono">INTEGRATION</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Transform Your IT
          </h2>
          <p className="mb-12 font-medium tracking-widest opacity-60 text-sm">
            FROM DEVELOPMENT TO DEPLOYMENT
          </p>
          
          <a href="mailto:contact@mzprimer.com" 
             className="text-xl md:text-3xl font-light border-b-2 border-black pb-2 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 inline-block break-all">
            contact@mzprimer.com
          </a>
          
          <div className="mt-16 flex flex-col md:flex-row justify-center gap-8 md:gap-12 text-xs tracking-widest">
            <div>+44 (0) 20 7946 0138</div>
            <div>71-75 Shelton Street, London</div>
            <div>WC2H 9JQ, United Kingdom</div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-12 md:py-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[8px] md:text-[10px] tracking-[3px] uppercase text-zinc-600 text-center md:text-left">
            MZ INTELLIGENCE SYSTEMS • COMPLETE IT SOLUTIONS FOR INDIVIDUALS AND ENTREPRISES
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
    </div>
  );
}