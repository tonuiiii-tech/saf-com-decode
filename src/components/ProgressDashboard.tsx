import React from "react";
import { CheckCircle2, TrendingUp, Sprout, GraduationCap, Trophy, ArrowRight, DollarSign } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface ProgressItemProps {
  title: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
  status: string;
}

function ProgressItem({ title, progress, icon, color, status }: ProgressItemProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl", color)}>
            {icon}
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-800">{title}</h4>
            <p className="text-xs text-gray-500">{status}</p>
          </div>
        </div>
        <span className="text-sm font-bold text-[#5A5A40]">{progress}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", color.replace("bg-", "bg-opacity-100 ").split(" ")[0])}
          style={{ backgroundColor: color.includes("bg-[#") ? color.replace("bg-[", "").replace("]", "") : undefined }}
        />
      </div>
    </div>
  );
}

export default function ProgressDashboard() {
  const learningModules = [
    { title: "Soil Health 101", progress: 100, status: "Completed", icon: <GraduationCap className="w-5 h-5 text-blue-600" />, color: "bg-blue-50" },
    { title: "Pest Management", progress: 45, status: "In Progress", icon: <GraduationCap className="w-5 h-5 text-orange-600" />, color: "bg-orange-50" },
  ];

  const crops = [
    { title: "Maize (Mahindi)", progress: 65, status: "Vegetative Stage", icon: <Sprout className="w-5 h-5 text-green-600" />, color: "bg-green-50" },
    { title: "Tomatoes", progress: 20, status: "Seedling Stage", icon: <Sprout className="w-5 h-5 text-red-600" />, color: "bg-red-50" },
  ];

  const finance = {
    expenses: 12500,
    revenue: 45000,
    goal: 100000,
    progress: 45
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f0] overflow-y-auto p-4 space-y-6 pb-20">
      {/* Gamification Header */}
      <div className="bg-[#5A5A40] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-serif">Mkulima Shupavu</h2>
              <p className="text-sm opacity-80">Level 4 • 2,450 Points</p>
            </div>
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Soil Master</div>
            <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Early Bird</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
      </div>

      {/* Learning Progress */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-[#5A5A40] flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Mafunzo (Learning)
          </h3>
          <button className="text-xs font-bold text-[#5A5A40] hover:underline">Ona Yote</button>
        </div>
        <div className="grid gap-3">
          {learningModules.map((m, i) => (
            <ProgressItem key={i} {...m} />
          ))}
        </div>
      </section>

      {/* Crop Progress */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-[#5A5A40] flex items-center gap-2">
            <Sprout className="w-5 h-5" />
            Mazao (Crops)
          </h3>
          <button className="text-xs font-bold text-[#5A5A40] hover:underline">Ongeza Zao</button>
        </div>
        <div className="grid gap-3">
          {crops.map((c, i) => (
            <ProgressItem key={i} {...c} />
          ))}
        </div>
      </section>

      {/* Financial Progress */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-[#5A5A40] flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Fedha (Finance)
          </h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Gharama</p>
              <p className="text-lg font-bold text-red-500">KES {finance.expenses.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Mapato</p>
              <p className="text-lg font-bold text-green-600">KES {finance.revenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-500">Lengo la Faida (Goal)</span>
              <span className="text-[#5A5A40]">{finance.progress}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5A5A40] rounded-full" 
                style={{ width: `${finance.progress}%` }}
              />
            </div>
            <p className="text-[10px] text-center text-gray-400 italic">Bado KES {(finance.goal - finance.revenue).toLocaleString()} kufikia lengo lako!</p>
          </div>
        </div>
      </section>

      {/* Interactive Guide CTA */}
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl text-white">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-orange-800">Mwongozo wa Kupanda</h4>
            <p className="text-xs text-orange-600">Hatua kwa hatua: Mahindi</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-orange-500" />
      </div>
    </div>
  );
}
