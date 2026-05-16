import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieChartBalance({ income, expense }) {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: income,           label: 'Income', color: '#4ade80' }, // green-400
            { id: 1, value: expense,          label: 'Spent',  color: '#f87171' }, // red-400
            { id: 2, value: income - expense, label: 'Saving', color: '#60a5fa' }, // blue-400
          ],
        },
      ]}
      width={200}
      height={200}
    />
  );
}