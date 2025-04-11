async function sendQuestion() {
  const question = document.getElementById("question").value;
  const responseEl = document.getElementById("response");
  const fujimoto = document.getElementById("fujimoto");

  // 表示リセット
  responseEl.style.opacity = 0;
  responseEl.textContent = "考え中…";

  // 藤本さん登場演出
  fujimoto.classList.add("show");
  setTimeout(() => {
    fujimoto.classList.remove("show");
  }, 2000);

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    responseEl.textContent = data.answer || "エラーが起きたよ！";

    // アニメーション再適用（強制再描画）
    responseEl.style.animation = "none";
    void responseEl.offsetWidth; // 強制リフロー
    responseEl.style.animation = "";
    responseEl.style.opacity = 1;

  } catch (error) {
    responseEl.textContent = "通信エラー！";
    console.error(error);
  }
}
