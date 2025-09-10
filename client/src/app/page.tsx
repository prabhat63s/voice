"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/LogoutButton";
import { FiUser, FiInfo, FiPhone, FiHome, FiMessageCircle, FiX, FiMenu, FiMic } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getInitials = (nameOrEmail?: string | null) => {
    if (!nameOrEmail) return "";
    const parts = nameOrEmail.split(" ");
    if (parts.length >= 2) return parts[0][0] + parts[1][0];
    return nameOrEmail[0];
  };

  const userInitials = session?.user?.name
    ? getInitials(session.user.name)
    : session?.user?.email
      ? getInitials(session.user.email.split("@")[0])
      : null;

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-50">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <FiMic /> Voice Agent
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
            <FiMessageCircle /> Features
          </Link>
          <Link href="#about" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
            <FiInfo /> About
          </Link>
          <Link href="#contact" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
            <FiPhone /> Contact
          </Link>

          {userInitials ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer hover:brightness-90 transition">
                {userInitials.toUpperCase()}
              </div>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/login">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-1">
                <FiUser /> Login
              </button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu />
        </button>
      </header>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 z-50 p-4 h-dvh right-0 w-72 bg-white flex flex-col items-end justify-start gap-4 py-4 transition-transform duration-300 ease-in-out ${menuOpen ? "translate-y-0" : "-translate-y-full"} z-40`}
      >
        <button className="flex gap-2 w-fit max-w-xs justify-center bg-gray-100 hover:bg-blue-100 text-gray-800 font-medium p-3 rounded-lg transition" onClick={() => setMenuOpen(!menuOpen)}>
          <FiX />
        </button>
        
        {/* Menu Links */}
        <Link
          href="#features"
          className="flex gap-2 w-full max-w-xs justify-center bg-gray-100 hover:bg-blue-100 text-gray-800 font-medium py-3 rounded-lg transition"
          onClick={() => setMenuOpen(false)}
        >
          <FiMessageCircle className="text-blue-600 text-xl" /> Features
        </Link>
        <Link
          href="#about"
          className="flex gap-2 w-full max-w-xs justify-center bg-gray-100 hover:bg-blue-100 text-gray-800 font-medium py-3 rounded-lg transition"
          onClick={() => setMenuOpen(false)}
        >
          <FiInfo className="text-blue-600 text-xl" /> About
        </Link>
        <Link
          href="#contact"
          className="flex gap-2 w-full max-w-xs justify-center bg-gray-100 hover:bg-blue-100 text-gray-800 font-medium py-3 rounded-lg transition"
          onClick={() => setMenuOpen(false)}
        >
          <FiPhone className="text-blue-600 text-xl" /> Contact
        </Link>

        {/* User Section */}
        {userInitials ? (
          <div className="flex flex-col w-full items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
              {userInitials.toUpperCase()}
            </div>
              <span className="">{session?.user?.email}</span>
            </div>
            <LogoutButton />
          </div>
        ) : (
          <Link href="/login">
            <button className="flex items-center justify-center gap-2 w-11/12 max-w-xs bg-blue-600 text-white rounded-lg shadow py-3 hover:bg-blue-700 transition">
              <FiUser /> Login
            </button>
          </Link>
        )}
      </div>


      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 bg-gradient-to-b from-blue-100 to-blue-300 p-6 text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">Your AI-Powered Voice Assistant</h2>
        <p className="text-lg text-gray-700 max-w-xl mb-8">
          Automate tasks, get instant answers, and interact with AI using just your voice. Experience the future of intelligent assistance today.
        </p>

        {session ? (
          <Link href="/chat">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2">
              <FiMessageCircle /> Go to Chat
            </button>
          </Link>
        ) : (
          <div className="flex gap-4">
            <Link href="/login">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-1">
                <FiUser /> Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow hover:bg-blue-50 transition flex items-center gap-1">
                <FiUser /> Register
              </button>
            </Link>
          </div>
        )}
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 bg-white text-center">
        <h3 className="text-3xl font-bold mb-6 text-gray-800">Features</h3>
        <div className="text-neutral-800 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 border border-gray-100 rounded-lg hover:bg-blue-50 transition flex flex-col items-center gap-2">
            <FiMessageCircle className="text-3xl text-blue-600" />
            <h4 className="text-xl font-semibold mb-2">Voice Commands</h4>
            <p>Control apps and perform tasks just by speaking, saving you time and effort.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-lg hover:bg-blue-50 transition flex flex-col items-center gap-2">
            <FiInfo className="text-3xl text-blue-600" />
            <h4 className="text-xl font-semibold mb-2">Smart Responses</h4>
            <p>Get instant, AI-powered responses for questions and requests.</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-lg hover:bg-blue-50 transition flex flex-col items-center gap-2">
            <FiHome className="text-3xl text-blue-600" />
            <h4 className="text-xl font-semibold mb-2">Seamless Integration</h4>
            <p>Connect with apps, services, and devices for a fully integrated assistant experience.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-8 bg-blue-50 text-center">
        <h3 className="text-3xl font-bold mb-6 text-gray-800">About Voice Agent</h3>
        <p className="max-w-2xl mx-auto text-gray-700">
          Voice Agent leverages the latest AI technologies to provide an intuitive voice-based assistant.
          From scheduling tasks to answering queries, it makes your digital experience smarter and faster.
        </p>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white py-8 px-8 text-center">
        <h4 className="text-xl font-bold mb-2 flex items-center justify-center gap-2"><FiPhone /> Contact Us</h4>
        <p className="mb-4">Email: support@voiceagent.com | Phone: +91 123-456-7890</p>
        <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Voice Agent. All rights reserved.</p>
      </footer>
    </div>
  );
}
