// import * as React from 'react';
// import { BarChart } from '@mui/x-charts/BarChart';
// // import { dataset, valueFormatter } from './dummyWeather.js';

// const chartSetting = {
//   yAxis: [
//     {
//       label: 'rainfall (mm)',
//       width: 60,
//     },
//   ],
//   series: [{ dataKey: 'london', label: 'Seoul rainfall', valueFormatter }],
//   height:300,
// };

// export default function TickPlacementBars() {
//   const tickPlacement='middle';
//   const tickLabelPlacement='middle';

//   return (
//     <div style={{ width: '100%' }}>
//       <BarChart
//         dataset={dataset}
//         xAxis={[{ dataKey: 'month', tickPlacement, tickLabelPlacement }]}
//         {...chartSetting}
//       />
//     </div>
//   );
// }