import React, { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import UssdSimulator from "./components/UssdSimulator";
import MarketPrices from "./components/MarketPrices";
import ProgressDashboard from "./components/ProgressDashboard";
import { Smartphone, Phone, Info, HelpCircle, LayoutDashboard, MessageSquare, TrendingUp } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [view, setView] = useState<"app" | "ussd">("app");
  const [appTab, setAppTab] = useState<"chat" | "progress" | "market">("chat");
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f0] overflow-hidden">
      {/* Navigation Toggle */}
      <nav className="bg-white border-b border-black/5 px-6 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView("app")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
              view === "app" ? "bg-[#5A5A40] text-white shadow-md" : "text-[#5A5A40] hover:bg-[#5A5A40]/10"
            )}
          >
            <Smartphone className="w-4 h-4" />
            Smartphone App
          </button>
          <button 
            onClick={() => setView("ussd")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all",
              view === "ussd" ? "bg-[#5A5A40] text-white shadow-md" : "text-[#5A5A40] hover:bg-[#5A5A40]/10"
            )}
          >
            <Phone className="w-4 h-4" />
            USSD (*456#)
          </button>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 text-[#5A5A40] hover:bg-[#5A5A40]/10 rounded-full transition-all"
        >
          <Info className="w-5 h-5" />
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative">
        {view === "app" ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              {appTab === "chat" ? <ChatInterface /> : appTab === "progress" ? <ProgressDashboard /> : <MarketPrices />}
            </div>
            {/* Bottom Tab Bar for App */}
            <div className="bg-white border-t border-black/5 px-6 py-3 flex justify-around items-center shadow-lg">
              <button 
                onClick={() => setAppTab("chat")}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  appTab === "chat" ? "text-[#5A5A40]" : "text-gray-400"
                )}
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Chat</span>
              </button>
              <button 
                onClick={() => setAppTab("market")}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  appTab === "market" ? "text-[#5A5A40]" : "text-gray-400"
                )}
              >
                <TrendingUp className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Market</span>
              </button>
              <button 
                onClick={() => setAppTab("progress")}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  appTab === "progress" ? "text-[#5A5A40]" : "text-gray-400"
                )}
              >
                <LayoutDashboard className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Progress</span>
              </button>
            </div>
          </div>
        ) : (
          <UssdSimulator />
        )}

        {/* Info Overlay */}
        {showInfo && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 border border-[#5A5A40]/20 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-[#5A5A40] font-serif">Mkulima AI Features</h2>
                <button onClick={() => setShowInfo(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <HelpCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <section>
                  <h3 className="font-bold text-[#5A5A40] uppercase tracking-wider text-xs mb-1">Dialect Support</h3>
                  <p>Mkulima AI understands and responds in <strong>Kimvita, Kiamu, Kipemba, Kingwana, and Sheng</strong>. It adapts its tone to match the user's cultural context.</p>
                </section>
                
                <section>
                  <h3 className="font-bold text-[#5A5A40] uppercase tracking-wider text-xs mb-1">Interactive Guides</h3>
                  <p>Step-by-step interactive guides for common tasks (e.g., planting maize). The AI prompts for confirmation after each step, ensuring the farmer follows along correctly.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#5A5A40] uppercase tracking-wider text-xs mb-1">Progress Tracking</h3>
                  <p>A comprehensive system to track <strong>Learning Progress</strong>, <strong>Crop Lifecycle</strong>, and <strong>Financial Goals</strong>. Integrated with the chatbot for real-time updates via voice or text.</p>
                </section>

                <section>
                  <h3 className="font-bold text-[#5A5A40] uppercase tracking-wider text-xs mb-1">Gamification</h3>
                  <p>Farmers earn points and badges (e.g., "Mkulima Shupavu") for completing tasks, finishing modules, and logging activities, encouraging consistent usage.</p>
                </section>
              </div>

              <button 
                onClick={() => setShowInfo(false)}
                className="w-full py-3 bg-[#5A5A40] text-white rounded-full font-bold hover:bg-[#4a4a35] transition-all"
              >
                Elewa & Funga
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
