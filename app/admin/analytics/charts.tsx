"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#d4af37", "#10b981", "#3b82f6", "#f43f5e"];

export function AnalyticsCharts({ 
  userGrowthData, 
  charityDistribution 
}: { 
  userGrowthData: any[]; 
  charityDistribution: any[]; 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-card/80 border border-border/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-6">User Registrations (Last 6 Months)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#fff", borderRadius: "8px" }}
                itemStyle={{ color: "#d4af37" }}
              />
              <Area type="monotone" dataKey="users" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card/80 border border-border/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-6">Charity Allocations ($)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charityDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: "#ffffff05" }}
                contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#fff", borderRadius: "8px" }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {charityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
