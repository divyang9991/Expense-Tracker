import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

const TITLE_COLORS = {
  income:   "#16a34a",  // green
  expense:  "#ef4444",  // red
  savings:  "#2563eb",  // blue
  budget:   "#7c3aed",  // purple
  profit:   "#0891b2",  // cyan
  loss:     "#dc2626",  // red-dark
};

function getBarColor(title) {
  if (!title) return "#1e3a8a";
  return TITLE_COLORS[title.toLowerCase()] ?? "#1e3a8a";
}

function valueFormatter(value) {
  return "₹" + value;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BarGraph({ list, title, height }) {
  const color = getBarColor(title);

  const groupedByDate = list.reduce((acc, item) => {
    const date = new Date(item.date).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = 0;
    acc[date] += item.amount;
    return acc;
  }, {});

  const formattedList = Object.entries(groupedByDate)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, amount]) => ({
      date: formatDate(date),
      amount,
    }));

  const BAR_WIDTH = 80;
  const Y_AXIS_WIDTH = 80;
  const chartWidth = Math.max(500, formattedList.length * BAR_WIDTH);
  const MARGIN = { left: 10, right: 20, top: 50, bottom: 60 };

  const sharedSeries = (barColor) => [
    {
      dataKey: "amount",
      label: `${title} Chart`,
      valueFormatter,
      color: barColor,
    },
  ];

  return (
    <div style={{ display: "flex", width: "100%" }}>

      {/* Pinned Y-axis */}
      <div style={{ flexShrink: 0 }}>
        <BarChart
          dataset={formattedList}
          series={sharedSeries("transparent")}
          xAxis={[{ dataKey: "date", scaleType: "band", tickSize: 0 }]}
          yAxis={[{ label: `${title} (Rupees)`, width: Y_AXIS_WIDTH }]}
          width={Y_AXIS_WIDTH + 20}
          height={height}
          margin={MARGIN}
          sx={{
            "& .MuiChartsAxis-bottom": { display: "none" },
            "& .MuiChartsLegend-root": { display: "none" },
            "& .MuiChartsAxis-left .MuiChartsAxis-line": {
              stroke: "var(--color-border-secondary)",
            },
          }}
        />
      </div>

      {/* Scrollable bars + x-axis */}
      <div style={{ overflowX: "auto", flex: 1 }}>
        <BarChart
          dataset={formattedList}
          xAxis={[{ dataKey: "date", scaleType: "band", label: "Date" }]}
          yAxis={[{ width: 0 }]}
          series={sharedSeries(color)}
          width={chartWidth}
          height={height}
          margin={MARGIN}
          sx={{
            "& .MuiChartsAxis-left": { display: "none" },
          }}
        />
      </div>

    </div>
  );
}