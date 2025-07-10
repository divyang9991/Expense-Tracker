import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieChartBalance({income,expense}) {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: income, label: 'Income' },
            { id: 1, value: expense, label: 'Spent' },
            { id: 2, value: income-expense, label: 'Balance' },
          ],
        },
      ]}
      width={200}
      height={200}
    />
  );
}
