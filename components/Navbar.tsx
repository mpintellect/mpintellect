import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar-desktop">
      <Link href="/" className="text-white hover:text-yellow-400 transition">Home</Link>
      <Link href="/AIChat" className="text-white hover:text-yellow-400 transition">AI Expert Chat</Link>
      <Link href="/#learning" className="text-white hover:text-yellow-400 transition">Learning</Link>
      <Link href="/#aitrading" className="text-white hover:text-yellow-400 transition">AI Trading</Link>
      <Link href="/ai-robot" className="text-white hover:text-yellow-400 transition">Trading Robots</Link>
      <Link href="/tools/ai-assistant" className="text-white hover:text-yellow-400 transition"> AI Assistant</Link>
      <Link href="/#contacts" className="text-white hover:text-yellow-400 transition">Contact</Link>
      <Link href="/legal" className="text-white hover:text-yellow-400 transition">Privacy</Link>
      <Link href="/blog" className="text-white hover:text-yellow-400 transition">Blog</Link>
    </nav>
  );
}