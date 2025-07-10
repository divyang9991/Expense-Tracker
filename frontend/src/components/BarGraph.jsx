import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

function valueFormatter(value) {
  return value + "₹";
}

export default function BarGraph({ list ,title,height}) {
  
  const groupedByDate = list.reduce((acc, item) => {
    const date = new Date(item.date);
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += item.amount;
    return acc;
  }, {});

  const result = Object.entries(groupedByDate).map(([date, amount]) => ({
    date,
    amount,
  }));  

  const formattedList = result.map((item) => ({
    ...item,
    date: new Date(item.date).toISOString().split("T")[0],
  }));
  const chartSetting = {
    yAxis: [
      {
        label: `${title}( Rupees)`,
        width: 60,
      },
    ],
    series: [{ dataKey: "amount", label: title+' Chart', valueFormatter ,color:'#1e3a8a'}],
    height: height,
  };
  return (
    <div style={{ width: "100%" }}>
      <BarChart
        dataset={formattedList}
        xAxis={[{ dataKey: "date", label: "Date", scaleType: "band" }]}
        {...chartSetting}
      />
    </div>
  );
}
