'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  year: string;
  "Precio Promedio": number | null;
}

export default function AveragePriceByYearChart({ data }: { data: ChartData[] }) {
    if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No hay datos para mostrar.</p>;
  }

  // Formatear el precio para el tooltip y el eje Y
  const formatPrice = (value: number) => `$${Math.round(value / 1000)}k`;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={formatPrice} />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          <Legend />
          <Line type="monotone" dataKey="Precio Promedio" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}