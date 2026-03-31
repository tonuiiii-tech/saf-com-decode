import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Volume2, VolumeX, Leaf, Cloud, TrendingUp, BookOpen, Smartphone } from "lucide-react";
import { getChatResponse, generateSpeech, Message } from "../services/gemini";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Habari mkulima! Mimi ni Mkulima AI. Naweza kukusaidia kwa ushauri wa kilimo, bei za soko, au hali ya hewa. Ungependa kujua nini leo?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Web Speech API for STT
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "sw-KE"; // Kiswahili (Kenya)

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await getChatResponse([...messages, userMessage]);
      const modelMessage: Message = { role: "model", text: response };
      setMessages(prev => [...prev, modelMessage]);
      
      // Auto-speak if it's a short response or if user has voice enabled (simplified here)
      if (response.length < 300) {
        const url = await generateSpeech(response);
        if (url) {
          setAudioUrl(url);
          setIsSpeaking(true);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const quickActions = [
    { icon: <Leaf className="w-4 h-4" />, label: "Mahindi", query: "Nipande mahindi lini?" },
    { icon: <Cloud className="w-4 h-4" />, label: "Hali ya Hewa", query: "Hali ya hewa ikoje leo?" },
    { icon: <TrendingUp className="w-4 h-4" />, label: "Bei za Soko", query: "Bei ya nyanya sokoni ni ngapi?" },
    { icon: <BookOpen className="w-4 h-4" />, label: "Magonjwa", query: "Magonjwa ya kawaida ya viazi ni yapi?" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f5f5f0] font-serif">
      {/* Header */}
      <header className="bg-[#5A5A40] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-full">
            <Leaf className="w-6 h-6 text-[#00FF00]" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Mkulima AI</h1>
            <p className="text-xs opacity-80 italic">Ushauri wako wa kilimo</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Smartphone className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] p-4 rounded-3xl shadow-sm",
                  msg.role === "user" 
                    ? "bg-[#5A5A40] text-white rounded-tr-none" 
                    : "bg-white text-[#1a1a1a] rounded-tl-none border border-black/5"
                )}
              >
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                {msg.role === "model" && idx === messages.length - 1 && audioUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <button 
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.play();
                          setIsSpeaking(true);
                        }
                      }}
                      className="p-1.5 bg-[#5A5A40]/10 rounded-full hover:bg-[#5A5A40]/20 transition-colors"
                    >
                      {isSpeaking ? <Volume2 className="w-4 h-4 text-[#5A5A40]" /> : <VolumeX className="w-4 h-4 text-[#5A5A40]" />}
                    </button>
                    <audio 
                      ref={audioRef} 
                      src={audioUrl} 
                      onEnded={() => setIsSpeaking(false)}
                      autoPlay
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-black/5 flex gap-1">
              <div className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Footer / Input */}
      <footer className="bg-white border-t border-black/5 p-4 space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(action.query);
                handleSend();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f0] rounded-full text-sm font-medium text-[#5A5A40] whitespace-nowrap hover:bg-[#5A5A40] hover:text-white transition-all border border-[#5A5A40]/10"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={cn(
              "p-3 rounded-full transition-all",
              isRecording ? "bg-red-500 text-white animate-pulse" : "bg-[#f5f5f0] text-[#5A5A40] hover:bg-[#5A5A40]/10"
            )}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Uliza chochote..."
            className="flex-1 bg-[#f5f5f0] border-none rounded-full px-6 py-3 focus:ring-2 focus:ring-[#5A5A40] outline-none text-[#1a1a1a]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 bg-[#5A5A40] text-white rounded-full disabled:opacity-50 hover:bg-[#4a4a35] transition-all shadow-lg"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
}
