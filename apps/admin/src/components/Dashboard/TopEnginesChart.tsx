import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  data: { name: string; value: number }[];
}

const COLORS = ['#f59e0b', '#ec4899', '#00d4ff', '#22c55e', '#8b5cf6', '#ef4444'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-elevated border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-text-muted text-xs mb-1">{label}</p>
      <p className="text-cyan font-semibold text-sm">
        {payload[0].value.toLocaleString()} requests
      </p>
    </div>
  );
}

export default function TopEnginesChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
      >
        <XAxis
          type="number"
          tick={{ fill: '#606070', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}K`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: '#9090a0', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 212, 255, 0.06)' }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
