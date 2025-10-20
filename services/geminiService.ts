import { GoogleGenAI, Type } from "@google/genai";
import type { Script } from "../types";

const TONE_DESCRIPTIONS: { [key: string]: string } = {
  'Năng động': 'Giọng điệu của bạn NĂNG ĐỘNG, nhiệt huyết, và đầy năng lượng. Bạn truyền cảm hứng cho người xem bằng sự sôi nổi và tích cực.',
  'Hài hước': 'Giọng điệu của bạn HÀI HƯỚC, dí dỏm và thông minh. Bạn sử dụng sự hài hước để làm cho sản phẩm trở nên gần gũi và đáng nhớ.',
  'Chuyên nghiệp': 'Giọng điệu của bạn CHUYÊN NGHIỆP, đáng tin cậy và mang tính chuyên gia. Bạn trình bày thông tin một cách rõ ràng, súc tích và thuyết phục, xây dựng niềm tin cho sản phẩm.',
  'Chân thực': 'Giọng điệu của bạn CHÂN THỰC, gần gũi và đồng cảm như một người bạn thân. Bạn chia sẻ trải nghiệm cá nhân một cách thật thà để kết nối với người xem.',
  'Giấu mặt': 'Phong cách của bạn là GIẤU MẶT (không lộ mặt). Kịch bản phải tập trung hoàn toàn vào sản phẩm. Các cảnh quay không cho thấy khuôn mặt người nói, thay vào đó là các góc quay cận cảnh sản phẩm, quay từ trên xuống (top-down), POV (Point of view), unboxing, hoặc chỉ thấy bàn tay đang thao tác. Điều này tạo sự bí ẩn và giúp người xem tập trung 100% vào lợi ích sản phẩm.',
  'Người dùng đã sử dụng': 'Giọng điệu của bạn là của một NGƯỜI DÙNG THẬT SỰ. Bạn chia sẻ câu chuyện và trải nghiệm của mình với sản phẩm một cách chân thành, không quá trau chuốt. Hãy tập trung vào những thay đổi thực tế mà sản phẩm mang lại cho cuộc sống của bạn.',
  'Truyền cảm hứng & Tích cực': 'Giọng điệu của bạn TRUYỀN CẢM HỨNG và TÍCH CỰC. Bạn không chỉ nói về sản phẩm mà còn liên kết nó với những giá trị sống tốt đẹp, khơi gợi hy vọng và động lực cho người xem. Hãy sử dụng ngôn từ bay bổng và đầy cảm xúc.',
  'Kể chuyện': 'Giọng điệu của bạn là của một NGƯỜI KỂ CHUYỆN. Bạn xây dựng một câu chuyện cảm xúc xung quanh sản phẩm, kết nối nó với một kỷ niệm, một ước mơ, hoặc một trải nghiệm sâu sắc. Hãy sử dụng ngôn từ giàu hình ảnh và khơi gợi cảm xúc.',
  'Cá tính & Bắt trend': 'Giọng điệu của bạn CÁ TÍNH và BẮT TREND. Bạn sử dụng ngôn ngữ mạng xã hội, tiếng lóng, meme và các tham chiếu văn hóa đại chúng (pop culture) đang thịnh hành để làm cho nội dung trở nên hiện đại và thu hút giới trẻ.',
  'Giáo dục & Tin tức': 'Giọng điệu của bạn mang tính GIÁO DỤC và CUNG CẤP THÔNG TIN. Bạn giải thích các tính năng phức tạp của sản phẩm một cách đơn giản, dễ hiểu. Hãy đóng vai một chuyên gia chia sẻ kiến thức, cung cấp các mẹo, \'hacks\', hoặc hướng dẫn \'how-to\'.'
};

const HOOK_STYLE_DESCRIPTIONS: { [key: string]: string } = {
  'Kích thích tò mò': 'Hãy tạo một câu mở đầu (hook) gây tò mò, đặt ra một câu hỏi bất ngờ hoặc đưa ra một tuyên bố gây sốc để người xem phải dừng lại.',
  'Gợi sự liên tưởng': 'Hãy tạo một câu mở đầu (hook) kết nối với một trải nghiệm, cảm xúc hoặc vấn đề chung mà đối tượng mục tiêu thường gặp phải.',
  'Tạo sự tranh luận': 'Hãy tạo một câu mở đầu (hook) đưa ra một quan điểm gây tranh cãi hoặc thách thức một niềm tin phổ biến để khuyến khích bình luận.',
  'Dựa trên kết quả': 'Hãy tạo một câu mở đầu (hook) hiển thị một kết quả ấn tượng, một sự thay đổi trước và sau, hoặc một bằng chứng xã hội (ví dụ: "Đây là lý do tại sao sản phẩm này bán hết veo").',
  'Kêu gọi hành động': 'Hãy tạo một câu mở đầu (hook) bắt đầu bằng một mệnh lệnh hoặc một lời kêu gọi trực tiếp (ví dụ: "Dừng ngay việc... nếu bạn...").'
};


export async function generateScripts(
  productLink: string,
  kolTone: string,
  includeCameraAngles: boolean,
  hookStyle: string,
  generatePost: boolean
): Promise<{ scripts: Script[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const textPart = {
    text: `Tạo 3 kịch bản video viral cho sản phẩm tại URL này: ${productLink}. Tập trung vào việc làm nổi bật các tính năng độc đáo và lợi ích cho khách hàng.`,
  };

  const selectedToneDescription = TONE_DESCRIPTIONS[kolTone] || TONE_DESCRIPTIONS['Năng động'];
  
  const cameraInstruction = includeCameraAngles
    ? "Trong phần 'visual' của mỗi cảnh, hãy gợi ý một góc máy quay cụ thể (ví dụ: Cận cảnh, Toàn cảnh, POV, Quay từ trên xuống) để tăng tính điện ảnh."
    : "";
  
  const hookInstruction = HOOK_STYLE_DESCRIPTIONS[hookStyle] 
    ? `Đối với phần "hook", hãy tuân thủ nghiêm ngặt phong cách sau: ${HOOK_STYLE_DESCRIPTIONS[hookStyle]}`
    : "";
  
  const postInstruction = generatePost
    ? "Ngoài ra, đối với mỗi kịch bản, hãy tạo một nội dung bài đăng ngắn gọn, hấp dẫn để đăng lên TikTok kèm theo video. Nội dung này phải bao gồm 5 hashtag có liên quan và đang thịnh hành."
    : "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [textPart] },
      config: {
        systemInstruction: `Bạn là một KOL (Key Opinion Leader) hàng đầu trên mạng xã hội, chuyên gia tạo video ngắn viral cho TikTok và Instagram Reels. ${selectedToneDescription} Bạn biết cách thu hút sự chú ý trong 3 giây đầu tiên và thúc đẩy doanh số bán hàng.

Nhiệm vụ: Dựa trên URL sản phẩm được cung cấp, hãy phân tích thông tin sản phẩm (tên, mô tả, hình ảnh, tính năng, lợi ích) và tạo ra 3 kịch bản video độc đáo và sáng tạo. Mỗi kịch bản phải ngắn gọn, hấp dẫn và được thiết kế để giới thiệu các tính năng và lợi ích tốt nhất của sản phẩm. ${cameraInstruction} ${hookInstruction} ${postInstruction}
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
                    description: `Câu mở đầu hoặc ý tưởng hình ảnh mạnh mẽ cho 3 giây đầu tiên. ${hookStyle !== 'Mặc định' && HOOK_STYLE_DESCRIPTIONS[hookStyle] ? HOOK_STYLE_DESCRIPTIONS[hookStyle] : ''}`,
                  },
                  scenes: {
                    type: Type.ARRAY,
                    description: "Một chuỗi các cảnh trong video.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        visual: {
                          type: Type.STRING,
                          description: `Mô tả những gì sẽ hiển thị trên màn hình. ${includeCameraAngles ? "Bao gồm cả gợi ý về góc máy quay." : ""}`,
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
                  postContent: {
                    type: Type.STRING,
                    description: "Nội dung bài đăng trên mạng xã hội cho video. Chỉ tạo nếu được yêu cầu.",
                  },
                  hashtags: {
                    type: Type.ARRAY,
                    description: "Danh sách 5 hashtag cho bài đăng. Chỉ tạo nếu được yêu cầu.",
                    items: {
                      type: Type.STRING,
                    },
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
      if (parsedJson.scripts && Array.isArray(parsedJson.scripts)) {
        const scriptsWithIds: Script[] = parsedJson.scripts.map((script: Omit<Script, 'id' | 'saved'>, index: number) => ({
          ...script,
          id: `script-${Date.now()}-${index}`,
        }));
        return { ...parsedJson, scripts: scriptsWithIds };
      }
      return parsedJson;
    } catch (error) {
      console.error("Failed to parse JSON response:", responseText);
      throw new Error("AI đã trả về một định dạng không hợp lệ. Vui lòng thử lại.");
    }
  } catch (e) {
    if (e instanceof Error && (
        e.message.includes("API key not valid") ||
        e.message.includes("permission denied") ||
        e.message.toLowerCase().includes("api key")
    )) {
        throw new Error("API_KEY_INVALID");
    }
    throw e;
  }
}


export async function generateVideoPreview(script: Script): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const prompt = `Tạo một video ngắn, điện ảnh dựa trên kịch bản sau. Tiêu đề: "${script.title}". Nội dung: ${script.scenes.map(s => s.visual).join('. ')}. Lời kêu gọi hành động: ${script.cta}.`;

  let operation;
  try {
    operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16' // Portrait for social media
      }
    });
  } catch(e) {
    if (e instanceof Error && e.message.includes("API key not valid")) {
       throw new Error("API key không hợp lệ hoặc chưa được kích hoạt thanh toán. Vui lòng chọn một key khác.");
    }
    throw e;
  }
  
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error('Không thể tạo video. Vui lòng thử lại.');
  }

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    if (response.status === 404 || response.status === 403) {
      const errorText = await response.text();
      if (errorText.includes("Requested entity was not found")) {
         throw new Error("API_KEY_NOT_FOUND");
      }
    }
    throw new Error(`Lỗi khi tải video: ${response.statusText}`);
  }

  const videoBlob = await response.blob();
  return URL.createObjectURL(videoBlob);
}