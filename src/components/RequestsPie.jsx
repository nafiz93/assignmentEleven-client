import React from "react";
import { Pie } from "react-chartjs-2";

export default function RequestsPie({ requests, max = 200 }) {
  const totalRequests = Array.isArray(requests) ? requests.length : 0;

  const considered = requests.slice(0, max);

  const approved = considered.filter((r) => r.status === "approved").length;
  const pending = considered.filter((r) => r.status === "pending").length;
  const rejected = considered.filter((r) => r.status === "rejected").length;

  const remaining = Math.max(max - (approved+pending+rejected), 0);

  const data = {
    labels: ["Approved", "Pending", "Rejected", "Remaining"],
    datasets: [
      {
        data: [approved, pending, rejected, remaining],

        // 🎨 COLORS
        backgroundColor: [
          "#22c55e", // green
          "#facc15", // yellow
          "#ef4444", // red
          "#94a3b8", // gray
        ],

        borderColor: "#e5e7eb",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 14,
          font: { size: 12 },
        },
      },

      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.raw ?? 0;
            const pct = ((value / max) * 100).toFixed(1);
            return `${ctx.label}: ${value} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        Requests Overview
      </h3>

      {/* SMALL & CLEAN CONTAINER */}
      <div className="bg-[#d8d0ce] rounded-xl p-4 h-[260px] flex items-center justify-center">
        <Pie data={data} options={options} />
      </div>

      {/* INFO */}
      <div className="mt-3 text-xs text-gray-700 space-y-1">
        <div>Total requests: {totalRequests}</div>
        <div>Max limit: {max}</div>
      </div>
    </div>
  );
}
