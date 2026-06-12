import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { day: string; requests: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-elevated border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-text-muted text-xs mb-1">{label}</p>
      <p className="text-amber font-semibold text-sm">
        {payload[0].value.toLocaleString()} requests
      </p>
    </div>
  );
}

export default function StatsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27273a" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: '#606070', fontSize: 12 }}
          axisLine={{ stroke: '#27273a' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#606070', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.06)' }} />
        <Bar
          dataKey="requests"
          fill="url(#amberGradient)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <defs>
          <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.4} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
