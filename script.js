async function sendQuestion() {
  const question = document.getElementById("question").value;
  const responseEl = document.getElementById("response");
  responseEl.textContent = "考え中…";
  
 // 藤本登場
  fujimoto.classList.add("show");

  // 2秒後に消す
  setTimeout(() => {
    fujimoto.classList.remove("show");
  }, 2000);
  
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  const data = await res.json();
  responseEl.textContent = data.answer || "エラーがおきたよ！";
}
