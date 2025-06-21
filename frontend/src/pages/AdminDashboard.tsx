import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [summary, setSummary] = useState<{ total: number; live: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin/summary").then(res => res.json()).then(setSummary);
  }, []);

  return (
    <div>
      <h1>管理者ダッシュボード</h1>
      <p>起動中のBot: {summary?.live} / {summary?.total}</p>
    </div>
  );
}
