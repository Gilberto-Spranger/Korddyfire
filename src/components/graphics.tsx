"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import api from "@/utils/api";

/* =======================
   Types
======================= */
type CombinedData = {
  name: string;
  sales: number;
  purchases: number;
};

type Sale = {
  year: number;
  month: number;
  price: number;
};

type Purchase = {
  year: number;
  month: number;
  amount: number;
};

/* =======================
   Utils
======================= */
const socketUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3500";

const formatNumber = (value?: number): string => {
  if (value === undefined) return "0";
  if (value >= 1e12) return (value / 1e12).toFixed(1) + "T";
  if (value >= 1e9) return (value / 1e9).toFixed(1) + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
  return value.toString();
};

/* =======================
   Tooltip
======================= */
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-white font-semibold mb-1">{label}</p>
      {payload.map((item, i) => (
        <p key={i} style={{ color: item.color }}>
          {item.name}: {formatNumber(item.value)}
        </p>
      ))}
    </div>
  );
};

/* =======================
   Component
======================= */
const Graph = () => {
  const [data, setData] = useState<CombinedData[]>([]);

  const fetchData = useCallback(async () => {
    const [salesRes, purchasesRes] = await Promise.all([
      api.get<Sale[]>("/sales"),
      api.get<Purchase[]>("/purchasing"),
    ]);

    const salesMap = new Map<string, number>();
    const purchasesMap = new Map<string, number>();

    salesRes.data.forEach(({ month, year, price }) => {
      const key = `${month}-${year}`;
      salesMap.set(key, (salesMap.get(key) || 0) + price);
    });

    purchasesRes.data.forEach(({ month, year, amount }) => {
      const key = `${month}-${year}`;
      purchasesMap.set(key, (purchasesMap.get(key) || 0) + amount);
    });

    const now = new Date();
    const result: CombinedData[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const key = `${month}-${year}`;

      result.push({
        name: date.toLocaleString("en-US", { month: "short" }) + `/${year}`,
        sales: salesMap.get(key) || 0,
        purchases: purchasesMap.get(key) || 0,
      });
    }

    setData(result);
  }, []);

  useEffect(() => {
    fetchData();

    const socket = io(socketUrl);
    socket.on("update-graph", fetchData);

    return () => {
      socket.disconnect();
    };
  }, [fetchData]);

  return (
    <div className="w-full h-[400px] bg-gray-950 rounded-xl shadow-xl p-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="purchases" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
          <XAxis dataKey="name" stroke="#e5e5e5" />
          <YAxis tickFormatter={formatNumber} stroke="#e5e5e5" />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#374151" }} />

          <Area
            type="monotone"
            dataKey="sales"
            stroke="#2563eb"
            fill="url(#sales)"
            animationDuration={800}
            name="Sales"
          />
          <Area
            type="monotone"
            dataKey="purchases"
            stroke="#16a34a"
            fill="url(#purchases)"
            animationDuration={800}
            name="Purchases"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;