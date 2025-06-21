import { useState } from "react";

export default function UserDashboard() {
  const [botCode, setBotCode] = useState("");
  const [token, setToken] = useState("");
  const [botId, setBotId] = useState<number | null>(null);
  const [status, setStatus] = useState("");

  const start = async () => {
    const res = await fetch("/api/user/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, botName: "MyBot", discordToken: token, botCode })
    });
    const bot = await res.json();
    setBotId(bot.id);
    setStatus("起動中");
  };

  const stop = async () => {
    if (!botId) return;
    await fetch("/api/user/stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botId })
    });
    setStatus("停止しました");
  };

  return (
    <div>
      <h1>ユーザーダッシュボード</h1>
      <textarea value={botCode} onChange={e => setBotCode(e.target.value)} placeholder="bot.jsのコード" rows={10} />
      <input value={token} onChange={e => setToken(e.target.value)} placeholder="Discord Bot Token" />
      <button onClick={start}>起動</button>
      <button onClick={stop}>停止</button>
      <p>状態: {status}</p>
    </div>
  );
}
