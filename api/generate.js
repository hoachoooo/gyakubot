// 環境変数の確認ログ
console.log("✅ APIキー読めてる？", process.env.OPENAI_API_KEY);

export default async function handler(req, res) {
  const { question } = req.body;

  // APIキーが設定されてなかったら即エラー返す
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY が undefined です！");
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

  // リクエスト内容の確認ログ
  console.log("📨 OpenAIに送る内容:", {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 50,
    temperature: 0.9,
  });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 0.9,
      }),
    });

    const data = await response.json();

    // OpenAIからの返答ログ
    console.log("📥 OpenAIのレスポンス:", data);

    // 想定外エラーパターン
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("❌ GPTの返答が不正です:", data);
      return res.status(500).json({ error: "GPTの返答が不正です" });
    }

    const answer = data.choices[0].message.content.trim();
    return res.status(200).json({ answer });

  } catch (error) {
    console.error("❌ OpenAI API呼び出し失敗:", error);
    return res.status(500).json({ error: "OpenAI API呼び出しに失敗しました" });
  }
}
