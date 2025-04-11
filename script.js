async function sendQuestion() {
  const question = document.getElementById("question").value;
  const responseEl = document.getElementById("response");
  responseEl.textContent = "考え中…";

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await res.json();
  responseEl.textContent = data.answer || "エラーがおきたよ！";
}
