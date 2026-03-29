export async function onRequestPost(context) {
  const body = await context.request.json();

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${context.env.GROQ_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  return new Response(await res.text(), {
    headers: { "Content-Type": "application/json" }
  });
}
