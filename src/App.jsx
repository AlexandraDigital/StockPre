import { useEffect } from "react";

const CSS = `body{background:#080d14;color:#b8ccd8;font-family:monospace}`;

async function aiCall(prompt) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return <div className="app">Stock AI Dashboard Running 🚀</div>;
}
