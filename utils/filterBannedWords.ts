// utils/filterBannedWords.ts
import type { Script } from '../types';

// Ánh xạ từ các từ bị cấm sang các từ đồng nghĩa hoặc cụm từ thay thế an toàn hơn.
const BANNED_WORD_MAP: { [key: string]: string } = {
    'mua bán': 'trải nghiệm',
    'bán hàng': 'chia sẻ',
    'cam kết': 'tự tin',
    'đảm bảo 100%': 'hỗ trợ tối đa',
    'chắc chắn': 'tin rằng',
    'tuyệt đối': 'vô cùng hiệu quả',
    'liên hệ': 'thông tin ở bio',
    'địa chỉ': 'thông tin ở bio',
    'số điện thoại': 'thông tin ở bio',
    'sđt': 'thông tin ở bio',
    'zalo': 'app ZL',
    'inbox': 'nhắn tin cho mình',
    'miễn phí': '0 đồng',
    'free ship': 'hỗ trợ phí vận chuyển',
    'rẻ nhất': 'giá cực tốt',
    'giá rẻ': 'giá ưu đãi',
    'duy nhất': 'đặc biệt',
    'hàng đầu': 'nổi bật',
    'top 1': 'được ưa chuộng',
    'số một': 'được yêu thích',
    'khỏi bệnh': 'cải thiện',
    'chữa trị': 'hỗ trợ',
    'điều trị': 'hỗ trợ',
    'bệnh': 'vấn đề sức khỏe',
    'yếu sinh lý': 'hỗ trợ phái mạnh',
    'tăng cân': 'cải thiện cân nặng',
    'giảm cân': 'quản lý vóc dáng',
    'eo thon': 'vóc dáng cân đối',
    'dáng đẹp': 'dáng xinh',
    'mụn': 'làn da có khuyết điểm',
    'sẹo': 'vết thâm',
    'nám': 'da không đều màu',
    'trắng da': 'làm sáng da',
    'thẩm mỹ viện': 'trung tâm làm đẹp',
    'dao kéo': 'can thiệp thẩm mỹ',
    'phẫu thuật': 'can thiệp thẩm mỹ',
    'thuốc lá': 'sản phẩm có hại',
    'rượu': 'đồ uống có cồn',
    'bia': 'đồ uống có cồn',
    'chất kích thích': 'chất gây nghiện',
    'ma túy': 'chất cấm',
    'cờ bạc': 'trò chơi may rủi',
    'cá độ': 'đặt cược',
    'vay tiền': 'hỗ trợ tài chính',
    'tín dụng đen': 'vay nặng lãi',
    'vũ khí': 'vật nguy hiểm',
    'bạo lực': 'hành động mạnh',
    'giết người': 'hành vi nguy hiểm',
    'khiêu dâm': 'nội dung nhạy cảm',
    '18+': 'nội dung người lớn',
    'sexy': 'quyến rũ',
    'lừa đảo': 'hành vi không trung thực',
    'ăn cắp': 'lấy đồ',
    'hack': 'xâm nhập',
    'shopee': 'sàn Cam',
    'lazada': 'sàn Xanh',
    'tiki': 'sàn T',
    'facebook': 'nền tảng FB',
    'instagram': 'nền tảng IG',
    'youtube': 'nền tảng YT',
    'tiktok': 'nền tảng này',
};

/**
 * Escapes special characters in a string for use in a regular expression.
 * @param text The string to escape.
 * @returns The escaped string.
 */
const escapeRegExp = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};


/**
 * Lọc và thay thế các từ bị cấm bằng từ đồng nghĩa an toàn hơn.
 * @param text Văn bản đầu vào.
 * @returns Văn bản đã được lọc.
 */
const filterText = (text: string): string => {
    if (!text) return text;
    let filteredText = text;
    
    // Sắp xếp các từ khóa từ dài đến ngắn để tránh thay thế chồng chéo (ví dụ: "free ship" trước "free")
    const sortedKeys = Object.keys(BANNED_WORD_MAP).sort((a, b) => b.length - a.length);

    sortedKeys.forEach(bannedWord => {
        const replacement = BANNED_WORD_MAP[bannedWord];
        const escapedWord = escapeRegExp(bannedWord);
        // \b là ranh giới từ, giúp tránh thay thế một phần của từ khác.
        const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
        filteredText = filteredText.replace(regex, replacement);
    });

    return filteredText;
};

/**
 * Lặp qua tất cả các trường văn bản trong một mảng kịch bản và áp dụng bộ lọc.
 * @param scripts Mảng các đối tượng Script.
 * @returns Mảng các đối tượng Script đã được lọc.
 */
export const filterScripts = (scripts: Script[]): Script[] => {
    if (!scripts) return [];
    return scripts.map(script => ({
        ...script,
        title: filterText(script.title),
        hook: filterText(script.hook),
        cta: filterText(script.cta),
        scenes: script.scenes.map(scene => ({
            ...scene,
            visual: filterText(scene.visual),
            voiceover: filterText(scene.voiceover),
        })),
    }));
};
