/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FiMic, FiStopCircle, FiX } from "react-icons/fi";

declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

interface Message {
    id: number;
    type: "user" | "ai";
    content: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const recognitionRef = useRef<any>(null);
    const latestTranscriptRef = useRef("");
    const router = useRouter();
    const { data: session } = useSession();

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


    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const handleVoiceInput = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        if (isListening) return;

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsListening(true);
            latestTranscriptRef.current = "";
        };

        recognition.onresult = (event: any) => {
            const speech = event.results[0][0].transcript.trim();
            if (!speech) return;
            latestTranscriptRef.current = speech;
        };

        recognition.onend = () => {
            setIsListening(false);
            if (latestTranscriptRef.current) {
                addMessage("user", latestTranscriptRef.current);
                sendToAI(latestTranscriptRef.current);
            }
        };

        recognition.onerror = (event: any) => {
            if (event.error === "no-speech") {
                console.warn("No speech detected. Please try again.");
            } else {
                console.error("Speech recognition error:", event.error);
                alert(`Speech recognition error: ${event.error}`);
            }
            setIsListening(false);
        };


        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            if (latestTranscriptRef.current) {
                addMessage("user", latestTranscriptRef.current);
                sendToAI(latestTranscriptRef.current);
            }
        }
    };

    const addMessage = (type: "user" | "ai", content: string) => {
        setMessages((prev) => [...prev, { id: prev.length + 1, type, content }]);
    };

    const sendToAI = async (text: string) => {
        if (!text.trim()) return;

        // Stop mic while AI processes
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }

        setIsProcessing(true);
        addMessage("ai", "Thinking...");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/voice/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ prompt: text }),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (data.response) {
                updateLastAIMessage(data.response);

                // Speak AI response
                speakResponse(data.response, () => {
                    // Auto-restart mic after AI finishes speaking
                    if (!isListening) {
                        handleVoiceInput();
                    }
                });
            } else if (data.error) {
                updateLastAIMessage(`Error: ${data.error}`);
            } else {
                updateLastAIMessage("Error: No response from AI.");
            }
        } catch (err) {
            console.error("API Error:", err);
            updateLastAIMessage("Error getting response from AI.");
        } finally {
            setIsProcessing(false);
        }
    };


    const updateLastAIMessage = (content: string) => {
        setMessages((prev) => prev.map((msg, i) => i === prev.length - 1 && msg.type === "ai" ? { ...msg, content } : msg));
    };

    const speakResponse = (text: string, onEnd?: () => void) => {
        if ("speechSynthesis" in window) {
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            utterance.rate = 0.9;
            utterance.pitch = 1.0;

            if (onEnd) {
                utterance.onend = onEnd; // Called when AI finishes speaking
            }

            speechSynthesis.speak(utterance);
        } else {
            // If speechSynthesis not supported, fallback: directly call onEnd
            onEnd?.();
        }
    };


    const clearConversation = () => {
        setMessages([]);
        latestTranscriptRef.current = "";
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/voice/clear`, { method: "POST", credentials: "include" }).catch(console.error);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 w-full">
            <header className="bg-white flex items-center justify-center p-4 relative text-xl">
                {/* Close button */}
                <div
                    className="absolute left-4 cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <FiX className="text-gray-700 hover:text-blue-600 transition" size={24} />
                </div>

                {/* Title */}
                <div className="font-semibold text-center">Voice Agent</div>

                {/* User avatar / initials */}
                <div className="absolute right-4 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer hover:brightness-90 transition">
                    {userInitials?.toUpperCase() || "U"}
                </div>
            </header>


            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <p className="text-gray-400 text-center">Your conversation will appear here...</p>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`rounded-lg p-3 max-w-[50%] break-words relative ${msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </main>


            <footer className="relative bg-white shadow p-4 flex flex-col items-center">
                {/* Microphone and Stop buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleVoiceInput}
                        disabled={isListening || isProcessing}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-colors ${isListening ? "bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
                            } text-white`}
                    >
                        <FiMic />
                    </button>

                    {isListening && (
                        <button
                            onClick={stopListening}
                            className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-700 transition"
                        >
                            <FiStopCircle size={20} /> Stop
                        </button>
                    )}

                    {/* Clear Conversation as icon-style button */}
                    <button
                        onClick={clearConversation}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition"
                        title="Clear Conversation"
                    >
                        Clear
                    </button>
                </div>
            </footer>
        </div>
    );
}
