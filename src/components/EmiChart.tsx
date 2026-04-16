import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface EmiChartProps {
  principal: number;
  interest: number;
}

const EmiChart = ({ principal, interest }: EmiChartProps) => {
  // Use state to delay rendering slightly to prevent hydration/SSR issues 
  // with Recharts and Vite
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    { name: "Principal Amount", value: principal },
    { name: "Interest Amount", value: interest },
  ];

  // Theme matched colors
  // Primary (golden) and Muted
  const COLORS = ["hsl(40, 15%, 89%)", "hsl(36, 90%, 50%)"];

  if (!isMounted) {
    return <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">Loading chart...</div>;
  }

  return (
    <div className="h-[250px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: '0.5rem',
              color: 'hsl(var(--foreground))'
            }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
        <span className="text-lg font-bold">
          {new Intl.NumberFormat('en-IN', { notation: "compact", compactDisplay: "short" }).format(principal + interest)}
        </span>
      </div>
    </div>
  );
};

export default EmiChart;
