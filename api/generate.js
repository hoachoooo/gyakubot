export default async function handler(req, res) {
  const { question } = req.body;

const prompt = `
お笑い芸人・藤本の「逆言葉」ネタのフォーマットに従い、与えられたお題に対して、語感・意味・リズム・印象などを逆っぽくひねった言葉を1つだけ返してください。
前置き・説明・補足は一切不要。
一言だけ、逆言葉として成立する語句を提示してください。

例：
入力：さらば青春の光
出力：おいでよ老人の暗闇

質問：「${question}」
返答：
`;

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
  const answer = data.choices?.[0]?.message?.content?.trim();

  res.status(200).json({ answer });
}

