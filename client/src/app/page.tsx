"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/LogoutButton";
import { FiUser, FiMessageCircle, FiChevronDown, FiCode, FiCopy } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export default function HomePage() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // API call example text
  // API call example text
  const apiCallText = `from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def get_response_from_openai(conversation_history: list) -> str:
    try:
        
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=conversation_history,
            temperature=0.7,
            max_tokens=200
        )
        
        result = response.choices[0].message.content.strip()
        print(f"OpenAI response: {result}")
        return result
        
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return f"I'm having trouble responding right now. Please try again."`;

  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiCallText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full bg-white p-4 md:px-8 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-medium text-blue-600 flex items-center gap-2">
          <FiMessageCircle /> Voice Agent
        </h1>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          {userInitials ? (
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer hover:brightness-90 transition">
                  {userInitials.toUpperCase()}
                </div>
                <FiChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-10 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{session?.user?.name || session?.user?.email}</p>
                  </div>
                  <Link
                    href="/chat"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiMessageCircle className="mr-2" /> Chat
                  </Link>
                  <div className="px-4 py-2">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1">
                <FiUser /> Login
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 bg-gradient-to-b from-blue-100 to-blue-300 p-6 py-12 text-center">
        <h2 className="text-3xl md:text-6xl font-bold text-gray-800 mb-6">Your AI-Powered Voice Agent</h2>
        <p className="text-gray-700 max-w-xl mb-10 text-lg">
          Automate tasks, get instant answers, and interact with AI using just your voice.
        </p>

        {session ? (
          <Link href="/chat">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-lg">
              <FiMessageCircle /> Start Chatting
            </button>
          </Link>
        ) : (
          <div className="flex gap-4">
            <Link href="/login">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1 text-lg">
                <FiUser /> Get Started
              </button>
            </Link>
          </div>
        )}
      </main>

      {/* API Call Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <FiCode className="text-blue-600 text-xl" />
            <h3 className="text-2xl font-bold text-gray-800">API Integration Example</h3>
          </div>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            {"Here's"} how you can integrate with our AI model in your application:
          </p>

          <div className="bg-gray-900 rounded-lg p-6 relative">
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md transition"
              title="Copy code"
            >
              {copied ? 'Copied!' : <FiCopy />}
            </button>

            <pre className="text-neutral-200 overflow-x-auto">
              <code className="text-sm">
                {apiCallText}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 text-center">
        <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Voice Agent. All rights reserved.</p>
      </footer>
    </div>
  );
}