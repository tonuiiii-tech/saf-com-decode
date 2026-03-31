import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, MapPin, Calendar, Info } from "lucide-react";
import { cn } from "../lib/utils";

const MARKET_DATA = [
  { month: "Jan", maize: 3200, tomatoes: 4500, beans: 8000 },
  { month: "Feb", maize: 3400, tomatoes: 4800, beans: 8200 },
  { month: "Mar", maize: 3600, tomatoes: 5200, beans: 8500 },
  { month: "Apr", maize: 3800, tomatoes: 6000, beans: 8800 },
  { month: "May", maize: 4000, tomatoes: 6500, beans: 9000 },
  { month: "Jun", maize: 3900, tomatoes: 5800, beans: 8700 },
  { month: "Jul", maize: 3500, tomatoes: 5000, beans: 8200 },
  { month: "Aug", maize: 3100, tomatoes: 4200, beans: 7800 },
  { month: "Sep", maize: 2900, tomatoes: 3800, beans: 7500 },
  { month: "Oct", maize: 3000, tomatoes: 4000, beans: 7600 },
  { month: "Nov", maize: 3100, tomatoes: 4300, beans: 7900 },
  { month: "Dec", maize: 3300, tomatoes: 4600, beans: 8100 },
];

export default function MarketPrices() {
  const [selectedCrop, setSelectedCrop] = useState<"maize" | "tomatoes" | "beans">("maize");

  const getTrend = (crop: "maize" | "tomatoes" | "beans") => {
    const lastMonth = MARKET_DATA[MARKET_DATA.length - 2][crop];
    const currentMonth = MARKET_DATA[MARKET_DATA.length - 1][crop];
    const diff = currentMonth - lastMonth;
    return {
      value: diff,
      percent: ((diff / lastMonth) * 100).toFixed(1),
      isUp: diff > 0
    };
  };

  const trend = getTrend(selectedCrop);

  return (
    <div className="flex flex-col h-full bg-[#f5f5f0] overflow-y-auto p-4 space-y-6 pb-20">
      {/* Market Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#5A5A40] p-2 rounded-xl text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 font-serif">Bei za Soko</h2>
              <p className="text-xs text-gray-500">Bei ya wastani kwa kila gunia (90kg)</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#5A5A40] bg-[#5A5A40]/10 px-3 py-1 rounded-full">
            <MapPin className="w-3 h-3" />
            Nairobi
          </div>
        </div>

        {/* Crop Selector */}
        <div className="flex gap-2">
          {(["maize", "tomatoes", "beans"] as const).map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={cn(
                "flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all",
                selectedCrop === crop 
                  ? "bg-[#5A5A40] text-white shadow-md" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {crop === "maize" ? "Mahindi" : crop === "tomatoes" ? "Nyanya" : "Maharagwe"}
            </button>
          ))}
        </div>
      </div>

      {/* Price Chart */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 h-[300px]">
        <h3 className="text-sm font-bold text-gray-400 mb-4 px-2 uppercase tracking-wider">Mwenendo wa Mwaka</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MARKET_DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#999' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#999' }}
              tickFormatter={(value) => `KES ${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`KES ${value}`, "Bei"]}
            />
            <Line 
              type="monotone" 
              dataKey={selectedCrop} 
              stroke="#5A5A40" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#5A5A40', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 space-y-2">
          <p className="text-[10px] uppercase font-bold text-gray-400">Bei ya Sasa</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-800">KES {MARKET_DATA[MARKET_DATA.length - 1][selectedCrop]}</span>
          </div>
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold",
            trend.isUp ? "text-green-600" : "text-red-500"
          )}>
            {trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.isUp ? "+" : ""}{trend.percent}% tangu mwezi uliopita
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-black/5 space-y-2">
          <p className="text-[10px] uppercase font-bold text-gray-400">Utabiri wa Desemba</p>
          <span className="text-xl font-bold text-[#5A5A40]">KES 4,800</span>
          <p className="text-[10px] text-gray-400 italic">Bei inatarajiwa kupanda kidogo</p>
        </div>
      </div>

      {/* Monthly Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5A5A40]" />
            Mchanganuo wa Kila Mwezi
          </h3>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 sticky top-0">
              <tr>
                <th className="px-4 py-3">Mwezi</th>
                <th className="px-4 py-3">Bei (KES)</th>
                <th className="px-4 py-3">Hali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MARKET_DATA.map((item, idx) => {
                const prev = idx > 0 ? MARKET_DATA[idx-1][selectedCrop] : item[selectedCrop];
                const isUp = item[selectedCrop] > prev;
                const isSame = item[selectedCrop] === prev;
                
                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-700">{item.month}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{item[selectedCrop].toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {isSame ? (
                        <span className="text-[10px] text-gray-400 font-bold">STABO</span>
                      ) : (
                        <div className={cn(
                          "flex items-center gap-1 text-[10px] font-bold",
                          isUp ? "text-green-600" : "text-red-500"
                        )}>
                          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isUp ? "PANDA" : "SHUKA"}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Info Tip */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0" />
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Kumbuka:</strong> Bei hizi ni za wastani wa soko kuu la Nairobi. Bei za vijijini zinaweza kutofautiana kulingana na gharama ya usafirishaji.
        </p>
      </div>
    </div>
  );
}
