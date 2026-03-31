import React, { useState, useEffect } from "react";
import { getChatResponse, Message } from "../services/gemini";
import { cn } from "../lib/utils";
import { Smartphone, Phone, X, Send } from "lucide-react";

export default function UssdSimulator() {
  const [session, setSession] = useState<"idle" | "active">("idle");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const startSession = () => {
    setSession("active");
    setHistory(["Mkulima AI\n1. Ushauri\n2. Bei za Soko\n3. Hali ya Hewa\n4. Maendeleo (Progress)\n5. Mwongozo wa Kupanda"]);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userIn = input;
    setInput("");
    setLoading(true);

    try {
      let prompt = `USSD Interaction: User selected ${userIn}. Provide a short USSD response (< 160 chars).`;
      
      // Special handling for Market Prices menu
      if (userIn === "2") {
        const marketText = "BEI ZA SOKO (90kg):\n1. Mahindi: KES 3,300\n2. Nyanya: KES 4,600\n3. Maharagwe: KES 8,100\nJibu namba kuona mwenendo wa mwaka.";
        setHistory(prev => [...prev, `> ${userIn}`, marketText]);
        setLoading(false);
        return;
      }

      // Special handling for Progress menu
      if (userIn === "4") {
        const progressText = "MAENDELEO:\n- Mafunzo: 72%\n- Mazao: 65% (Mahindi)\n- Fedha: 45% ya lengo\nJibu 1 kwa maelezo zaidi.";
        setHistory(prev => [...prev, `> ${userIn}`, progressText]);
        setLoading(false);
        return;
      }

      const messages: Message[] = [
        { role: "user", text: prompt }
      ];
      const response = await getChatResponse(messages, true);
      setHistory(prev => [...prev, `> ${userIn}`, response]);
    } catch (error) {
      setHistory(prev => [...prev, `> ${userIn}`, "Hitilafu ya mtandao."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 p-6">
      <div className="relative w-[320px] h-[600px] bg-black rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden">
        {/* Screen */}
        <div className="absolute inset-0 bg-[#f0f0f0] flex flex-col">
          {/* Status Bar */}
          <div className="h-6 bg-gray-200 flex items-center justify-between px-6 text-[10px] font-bold text-gray-500">
            <span>12:45 PM</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-center items-center">
            {session === "idle" ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-[#5A5A40] rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Phone className="text-white w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-800">Piga *456#</h3>
                  <p className="text-sm text-gray-500">Kupata huduma za Mkulima AI</p>
                </div>
                <button 
                  onClick={startSession}
                  className="px-8 py-3 bg-[#5A5A40] text-white rounded-full font-bold shadow-lg hover:bg-[#4a4a35] transition-all"
                >
                  PIGA SASA
                </button>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col bg-white border-2 border-gray-300 rounded-xl overflow-hidden shadow-inner">
                <div className="bg-gray-100 p-2 text-center text-xs font-bold border-b border-gray-300 flex justify-between items-center">
                  <span>USSD Session</span>
                  <button onClick={() => setSession("idle")}><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto text-sm font-mono whitespace-pre-wrap leading-relaxed">
                  {history.map((line, idx) => (
                    <div key={idx} className={cn("mb-2", line.startsWith(">") ? "text-blue-600 font-bold" : "text-gray-800")}>
                      {line}
                    </div>
                  ))}
                  {loading && <div className="animate-pulse text-gray-400">Inatuma...</div>}
                </div>
                <form onSubmit={handleSend} className="p-2 border-t border-gray-300 flex gap-2">
                  <input 
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Jibu hapa..."
                    className="flex-1 bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  />
                  <button 
                    type="submit"
                    className="p-2 bg-[#5A5A40] text-white rounded hover:bg-[#4a4a35]"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Home Button */}
          <div className="h-12 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-gray-300" />
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-white/60 text-sm text-center max-w-xs">
        <p className="font-bold text-white mb-2">USSD Compatibility</p>
        <p>Mkulima AI inatumia ujumbe mfupi (SMS) na USSD kusaidia wakulima wasio na smartphone au internet.</p>
      </div>
    </div>
  );
}
