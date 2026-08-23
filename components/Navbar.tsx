import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar-desktop">
      <Link href="/" className="text-gray-800 hover:text-blue-500 transition">Home</Link>
      <Link href="/AIChat" className="text-gray-800 hover:text-blue-500 transition">AI Chat</Link>
      <Link href="/news" className="text-gray-800 hover:text-blue-500 transition">News</Link>
      <Link href="/markets" className="text-gray-800 hover:text-blue-500 transition">🔴 LIVE MARKETS</Link>
      <Link href="/prop-firm" className="text-gray-800 hover:text-blue-500 transition">AI Funded</Link>
      <Link href="/ai-robot" className="text-gray-800 hover:text-blue-500 transition">EA</Link>
      <Link href="/tools/ai-assistant" className="text-gray-800 hover:text-blue-500 transition"> AI Assistant</Link>
      <Link href="/#contacts" className="text-gray-800 hover:text-blue-500 transition">Contact</Link>
      <Link href="/legal" className="text-gray-800 hover:text-blue-500 transition">Privacy</Link>
      <Link href="/blog" className="text-gray-800 hover:text-blue-500 transition">Blog</Link>
      <Link href="/client/login" className="text-gray-800 hover:text-blue-500 transition">LOGIN</Link>
    </nav>
  );
}