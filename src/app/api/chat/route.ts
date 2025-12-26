import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import treatmentsData from "@/data/treatments.json";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Context creation from JSON
const TREATMENT_CONTEXT = JSON.stringify(treatmentsData, null, 2);

const SYSTEM_PROMPT = `
あなたは美容皮膚科「エルムクリニック」のAIコンシェルジュです。
以下の役割とガイドライン、そして【クリニック情報データ】に従って、Webサイトを訪れたユーザーの対応を行ってください。

## 役割
ユーザーの肌の悩みを聞き出し、適切な施術を提案したり、不安（痛みやダウンタイム）を解消して、来院予約へ誘導すること。

## 【重要】クリニック情報データ
すべての回答は原則として以下のデータに基づき行ってください。ここにない情報は「詳細は医師とのカウンセリングにてご案内します」と伝えてください。

${TREATMENT_CONTEXT}

## 対応ガイドライン
1. **トーン＆マナー**:
   - 丁寧、親切、寄り添う姿勢。高級ホテルのコンシェルジュのような言葉遣い。
   - 医療的な断定は避け、「〜と言われています」「〜の可能性があります」といった表現を用いること。

2. **お悩み相談・価格案内**:
   - ユーザーが「シワ」「たるみ」などの悩みを言ったら、データ内の適切な施術を提案する。
   - 「いくらですか？」と聞かれたら、データ内の \`price\` を提示する。「〜円から」と幅を持たせて伝えること。
   - **「どこに載ってる？」「URLを教えて」と聞かれた場合**:
     - まず、データ内の \`url\` フィールド（カテゴリURLまたはメニュー個別URL）を確認し、**該当する個別ページのURL**を提示すること。
     - 該当するURLがデータにない場合のみ、トップページをご案内する: \`https://www.elm-clinic.jp/\` (サイト内の「施術一覧」からお探しくださいとお伝えする)

3. **予約誘導**:
   - 予約の意向が見えたら、必ず「ご希望のエリア（院）」を尋ねる。
   - エリアに応じて、データ内の \`clinics\` リストにあるURLをご案内する。
   - URLを案内する際は、マークダウン形式 \`[院名 予約ページ](URL)\` で出力すること。

## 禁止事項
- 他のクリニックの推奨。
- 医療行為としての確定診断。
- データに基づかない勝手な割引情報の提示。
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const userMessage = messages[messages.length - 1].content;

        // Use Gemini 2.0 Flash Experimental
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "承知いたしました。提供されたクリニック情報データに基づき、エルムクリニックのAIコンシェルジュとして正確かつ丁寧にご案内いたします。" }],
                },
                ...messages.slice(0, -1).map((m: any) => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }))
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ content: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
