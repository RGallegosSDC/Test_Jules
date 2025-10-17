'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  name: string;
  autos: number;
}

interface ClientCarChartProps {
  data: ChartData[];
}

export default function ClientCarChart({ data }: ClientCarChartProps) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid #ccc',
            }}
          />
          <Legend />
          <Bar dataKey="autos" fill="#8884d8" name="Número de Autos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}