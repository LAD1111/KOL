
import { GoogleGenAI, Type } from "@google/genai";
import type { Script } from "../types";

const TONE_DESCRIPTIONS: { [key: string]: string } = {
  'Năng động': 'Giọng điệu của bạn NĂNG ĐỘNG, nhiệt huyết, và đầy năng lượng. Bạn truyền cảm hứng cho người xem bằng sự sôi nổi và tích cực.',
  'Hài hước': 'Giọng điệu của bạn HÀI HƯỚC, dí dỏm và thông minh. Bạn sử dụng sự hài hước để làm cho sản phẩm trở nên gần gũi và đáng nhớ.',
  'Chuyên nghiệp': 'Giọng điệu của bạn CHUYÊN NGHIỆP, đáng tin cậy và mang tính chuyên gia. Bạn trình bày thông tin một cách rõ ràng, súc tích và thuyết phục, xây dựng niềm tin cho sản phẩm.',
  'Chân thực': 'Giọng điệu của bạn CHÂN THỰC, gần gũi và đồng cảm như một người bạn thân. Bạn chia sẻ trải nghiệm cá nhân một cách thật thà để kết nối với người xem.'
};


export async function generateScripts(
  productLink: string,
  kolTone: string
): Promise<{ scripts: Script[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const textPart = {
    text: `Tạo 3 kịch bản video viral cho sản phẩm tại URL này: ${productLink}. Tập trung vào việc làm nổi bật các tính năng độc đáo và lợi ích cho khách hàng.`,
  };

  const selectedToneDescription = TONE_DESCRIPTIONS[kolTone] || TONE_DESCRIPTIONS['Năng động'];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [textPart] },
    config: {
      systemInstruction: `Bạn là một KOL (Key Opinion Leader) hàng đầu trên mạng xã hội, chuyên gia tạo video ngắn viral cho TikTok và Instagram Reels. ${selectedToneDescription} Bạn biết cách thu hút sự chú ý trong 3 giây đầu tiên và thúc đẩy doanh số bán hàng.

Nhiệm vụ: Dựa trên URL sản phẩm được cung cấp, hãy phân tích thông tin sản phẩm (tên, mô tả, hình ảnh, tính năng, lợi ích) và tạo ra 3 kịch bản video độc đáo và sáng tạo. Mỗi kịch bản phải ngắn gọn, hấp dẫn và được thiết kế để giới thiệu các tính năng và lợi ích tốt nhất của sản phẩm.
`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scripts: {
            type: Type.ARRAY,
            description: "Một danh sách gồm 3 kịch bản video.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "Tiêu đề hấp dẫn cho ý tưởng video.",
                },
                hook: {
                  type: Type.STRING,
                  description: "Câu mở đầu hoặc ý tưởng hình ảnh mạnh mẽ cho 3 giây đầu tiên.",
                },
                scenes: {
                  type: Type.ARRAY,
                  description: "Một chuỗi các cảnh trong video.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      visual: {
                        type: Type.STRING,
                        description: "Mô tả những gì sẽ hiển thị trên màn hình.",
                      },
                      voiceover: {
                        type: Type.STRING,
                        description: "Lời thoại hoặc thuyết minh cho cảnh đó.",
                      },
                    },
                    required: ["visual", "voiceover"],
                  },
                },
                cta: {
                  type: Type.STRING,
                  description: "Lời kêu gọi hành động rõ ràng (Call to Action).",
                },
              },
              required: ["title", "hook", "scenes", "cta"],
            },
          },
        },
        required: ["scripts"],
      },
    },
  });

  const responseText = response.text;
  try {
    const parsedJson = JSON.parse(responseText);
    return parsedJson;
  } catch (error) {
    console.error("Failed to parse JSON response:", responseText);
    throw new Error("AI đã trả về một định dạng không hợp lệ. Vui lòng thử lại.");
  }
}
