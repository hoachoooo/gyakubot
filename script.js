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
// 音声読み上げ機能
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP"; // 日本語で
  utter.rate = 2.0;     // 読む速さ（0.1〜10）
  speechSynthesis.speak(utter);
}
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    responseEl.textContent = data.answer || "エラーが起きたよ！";
  // 逆言葉を音声で読み上げ
if (data.answer) {
  speak(data.answer);
}

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
