console.log("✅ APIキー読めてる？", process.env.OPENROUTER_API_KEY);

export default async function handler(req, res) {
  const { question } = req.body;

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY が未設定です！");
    return res.status(500).json({ error: "APIキーが設定されていません" });
  }

  const prompt = `
お笑い芸人・藤本の「逆言葉」ネタのフォーマットに従い、与えられたお題に対して、語感・意味・リズム・印象などを逆っぽくひねった言葉を1つだけ返してください。
前置き・説明・補足は一切不要。
一言だけ、逆言葉として成立する語句を提示してください。

例：
入力：さらば青春の光
出力：おいでよ老人の暗闇

入力：${question}
出力：
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://gyakubot.vercel.app", // ← 自分のサイトURLを入れる
        "X-Title": "Gyakubot"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // または別のモデル名に変更可
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 0.9,
      }),
    });

    const data = await response.json();
    console.log("📥 OpenRouter response:", data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("❌ GPTの返答が不正です:", data);
      return res.status(500).json({ error: "GPTの返答が不正です" });
    }

    const answer = data.choices[0].message.content.trim();
    return res.status(200).json({ answer });

  } catch (error) {
    console.error("❌ OpenRouter API呼び出し失敗:", error);
    return res.status(500).json({ error: "API呼び出しに失敗しました" });
  }
}
