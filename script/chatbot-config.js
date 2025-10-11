// ==========================
// Chatbot Configuration
// ==========================

// Cấu hình chatbot AI cho Hạ Miên
const CHATBOT_CONFIG = {
  // Cấu hình AI API (tùy chọn)
  ai: {
    enabled: false, // Đặt thành true nếu bạn có API key
    apiKey: '', // Thêm API key của bạn ở đây
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    maxTokens: 200,
    temperature: 0.7
  },

  // Cấu hình chatbot
  chatbot: {
    name: 'Hạ Miên Chatbot',
    welcomeMessages: [
      'Xin chào, chúng mình là Hạ Miên, cảm ơn bạn đã liên hệ, bạn muốn tư vấn về dịch vụ nào?',
      'Hạ Miên xin chào anh/chị, cảm ơn đã ghé qua shop chúng em. Không biết anh/chị quan tâm đến sản phẩm nào ạ?',
      'Hạ Miên xin chào, cảm ơn bạn yêu đã liên hệ. Miên có thể giúp gì được cho bạn ạ?'
    ],
    suggestions: [
      'Đặt hoa theo mẫu',
      'Tư vấn',
      'Thiết kế theo yêu cầu',
      'Đặt hoa giao ngay',
      'Deal hot theo mùa',
      'Hỏi về đơn hàng',
      'Tổ chức sự kiện',
      'CSKH sau mua'
    ]
  },

  // Thông tin cửa hàng
  store: {
    name: 'Hạ Miên',
    address: '422 Vĩnh Hưng',
    phone: '0987654321',
    services: [
      'Hoa tươi mỗi ngày',
      'Gói quà sang trọng',
      'Giao hàng nhanh',
      'Tổ chức sự kiện'
    ]
  },

  // Cấu hình giao diện
  ui: {
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    theme: 'light', // light, dark, auto
    animation: true,
    sound: false
  },

  // Quy tắc – Từ khóa nhận diện ý định
  intents: {
    mau: ['đặt hoa theo mẫu', 'mẫu', 'theo mẫu', 'catalog', 'bộ sưu tập'],
    tuvan: ['tư vấn', 'tuvan', 'gợi ý', 'gợi y', 'nên chọn', 'hợp với', 'ý nghĩa', 'nghĩa hoa', 'chăm sóc', 'giấy gói', 'giay goi'],
    thietke: ['thiết kế', 'thiet ke', 'theo yêu cầu', 'yêu cầu', 'yeu cau', 'custom', 'đặt thiết kế'],
    giaongay: ['giao ngay', 'lấy luôn', 'lay luon', 'gấp', 'gap', 'nhanh'],
    deal: ['deal', 'ưu đãi', 'uu dai', 'khuyến mãi', 'khuyen mai', 'theo mùa', 'mùa'],
    donhang: ['đơn hàng', 'don hang', 'mã đơn', 'ma don', 'tra cứu', 'tra cuu'],
    sukien: ['sự kiện', 'su kien', 'workshop', 'trang trí', 'trang tri'],
    cskh: ['cskh', 'sau mua', 'bảo quản', 'bao quan', 'đã nhận hoa', 'da nhan hoa', 'hướng dẫn', 'huong dan']
  },

  // Nội dung phản hồi theo nhánh
  flows: {
    mau: {
      text: [
        'Dạ, Hạ Miên xin gửi bạn các mẫu hoa đã có tại tiệm ạ. (đính kèm link bộ sưu tập)',
        'Bạn ưng ý mẫu nào thì đừng quên nói cho Hạ Miên nhé!'
      ],
      next: ['Thiết kế theo yêu cầu', 'Đặt hoa giao ngay', 'Tư vấn']
    },
    tuvan: {
      text: [
        'Bạn muốn Hạ Miên tư vấn về phần nào ạ? (ý nghĩa hoa, đối tượng, dịp tặng, chăm sóc, giấy gói, gợi ý mẫu cho không gian...)',
        'Bạn có thể nói từ khóa như: “nhẹ nhàng”, “tình đầu”, “sang trọng”, “chung thủy”... để Miên gợi ý nhanh nhé!'
      ],
      next: ['Đặt hoa theo mẫu', 'Thiết kế theo yêu cầu']
    },
    thietke: {
      text: [
        'Mình giúp bạn đặt hoa theo thiết kế nha. Bạn vui lòng cho Hạ Miên biết:',
        '- Bố cục/hình thức (trái tim, tròn, bó, hộp, giỏ, lẵng, ...)',
        '- Màu chủ đạo',
        '- Giấy gói mong muốn',
        '- Số lượng và ngân sách dự kiến',
        'Bạn yêu vui lòng xác nhận lại yêu cầu giúp Hạ Miên nhé! Nếu cần gấp, vui lòng liên hệ hotline để được hỗ trợ nhanh.'
      ],
      next: ['Đặt hoa giao ngay', 'Tư vấn']
    },
    giaongay: {
      text: [
        'Bạn yêu vui lòng liên hệ tới hotline: 0987654321 để đặt hoa trong thời gian nhanh nhất nhé.'
      ],
      next: ['Đặt hoa theo mẫu']
    },
    deal: {
      text: [
        'Hạ Miên có các deal hot theo mùa nè! Mình cập nhật theo những loài hoa đang vào vụ với số lượng dồi dào, giá đẹp.',
        'Bạn quan tâm loại hoa hoặc tone nào để Miên gửi ưu đãi phù hợp nhé.'
      ],
      next: ['Đặt hoa theo mẫu', 'Thiết kế theo yêu cầu']
    },
    donhang: {
      text: [
        'Bạn vui lòng gửi cho Hạ Miên mã đơn hàng để tiệm tiện tra cứu thông tin cho bạn nè.'
      ],
      next: []
    },
    sukien: {
      text: [
        'Để tư vấn tổ chức sự kiện, bạn giúp Miên biết quy mô, concept, số lượng hoa, thời gian... nha.',
        'Bạn yêu vui lòng xác nhận lại thông tin giúp Hạ Miên.'
      ],
      next: []
    },
    cskh: {
      text: [
        'Hạ Miên nhận được thông tin hoa đã giao đến bạn rồi ạ, hoa đến tay bạn có đúng giờ và còn giữ độ tươi không ạ?',
        'Nếu cần, Miên gửi lại hướng dẫn bảo quản để hoa bền đẹp hơn nha.',
        'Cảm ơn bạn đã tin tưởng lựa chọn Hạ Miên giữa vô vàn shop hoa khác. Miên xin gửi bạn chút quà nhỏ cho lần sử dụng dịch vụ tiếp theo (voucher).'
      ],
      next: []
    },
    fallback: {
      text: [
        'Hạ Miên xin phép được hiểu ý bạn như sau, bạn đang cần tư vấn đặt hoa phải không ạ?',
        'Bạn có thể chọn nhanh một trong các nội dung bên dưới để Miên hỗ trợ tốt hơn nha.'
      ],
      next: ['Đặt hoa theo mẫu', 'Tư vấn', 'Thiết kế theo yêu cầu', 'Đặt hoa giao ngay', 'Hỏi về đơn hàng']
    }
  },

  // Dialogflow intents manifest (base names) - ALL INTENTS
  dialogflowManifest: [
    'Default Fallback Intent', 'Default Welcome Intent', 'ichaohoi', 'idathoa', 'idealhot',
    'ihuydon', 'iketthuc', 'iphanhoitot', 'iphanhoixau', 'iphiship', 'iPTTT', 'ithongtinshop',
    'ithuthiep', 'itracuudonhang', 'ituvan - dichvu - decorsukien', 'ituvan - dichvu - TGworkshop',
    'ituvan - dichvu - thietketheoyeucau', 'ituvan - dichvu - TTworkshop', 'ituvan - dichvu',
    'ituvan - sanpham - xemmau', 'ituvan - sanpham', 'ituvan'
  ],

  // Dialogflow entities manifest (base names)
  entitiesManifest: [
    'ecacdip', 'ecamon', 'echaohoi', 'edathoa', 'edealhot', 'edichvu', 'edonhang', 'ehotline',
    'ehuydon', 'eloaihoa', 'emasanpham', 'emauhoa', 'engaygio', 'enoiban', 'enoidatmua',
    'ephanhoitot', 'ephanhoixau', 'ephuongthucthanhtoan', 'esanpham', 'esoluong', 'ethuthiep', 'etuvan'
  ],

  // Gợi ý tiếp theo cho từng intent Dialogflow
  intentSuggestions: {
    'Default Welcome Intent': ['Đặt hoa theo mẫu', 'Tư vấn', 'Thiết kế theo yêu cầu'],
    'ichaohoi': ['Đặt hoa theo mẫu', 'Tư vấn', 'Thiết kế theo yêu cầu'],
    'idathoa': ['Thiết kế theo yêu cầu', 'Đặt hoa giao ngay', 'Tư vấn'],
    'idealhot': ['Đặt hoa theo mẫu', 'Thiết kế theo yêu cầu'],
    'ihuydon': ['Hỏi về đơn hàng', 'CSKH sau mua'],
    'iketthuc': ['Tư vấn', 'Đặt hoa theo mẫu'],
    'iphanhoitot': ['CSKH sau mua', 'Đặt hoa theo mẫu'],
    'iphanhoixau': ['CSKH sau mua', 'Tư vấn'],
    'iphiship': ['Đặt hoa giao ngay', 'Hỏi về đơn hàng'],
    'iPTTT': ['Đặt hoa giao ngay', 'Hỏi về đơn hàng'],
    'ithongtinshop': ['Tư vấn', 'Đặt hoa theo mẫu'],
    'ithuthiep': ['Thiết kế theo yêu cầu', 'Tư vấn'],
    'itracuudonhang': ['Hỏi về đơn hàng', 'CSKH sau mua'],
    'ituvan - dichvu - decorsukien': ['Tổ chức sự kiện', 'Tư vấn'],
    'ituvan - dichvu - TGworkshop': ['Tổ chức sự kiện', 'Tư vấn'],
    'ituvan - dichvu - thietketheoyeucau': ['Thiết kế theo yêu cầu', 'Tư vấn'],
    'ituvan - dichvu - TTworkshop': ['Tổ chức sự kiện', 'Tư vấn'],
    'ituvan - dichvu': ['Tư vấn', 'Đặt hoa theo mẫu'],
    'ituvan - sanpham - xemmau': ['Đặt hoa theo mẫu', 'Thiết kế theo yêu cầu'],
    'ituvan - sanpham': ['Tư vấn', 'Đặt hoa theo mẫu'],
    'ituvan': ['Tư vấn', 'Đặt hoa theo mẫu'],
    'Default Fallback Intent': ['Đặt hoa theo mẫu', 'Tư vấn', 'Thiết kế theo yêu cầu', 'Đặt hoa giao ngay', 'Hỏi về đơn hàng']
  },

  // Dữ liệu sản phẩm từ Excel để chatbot tư vấn
  products: [
    {"STT": 1, "Mã sản phẩm": "#DR210", "Phân loại ": "Hoa bó", "Ý nghĩa": "https://kodo.vn/y-nghia-cac-loai-hoa/", "Unnamed: 4": "Hoa hồng vàng, cúc mẫu đơn cam nhạt, baby trắng, hoa thạch thảo", "Giá": 150.0},
    {"STT": 2, "Mã sản phẩm": "#DR276", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa lưu ly xanh, baby trắng, lá bạc", "Giá": 150.0},
    {"STT": 3, "Mã sản phẩm": "#DR150", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa đồng tiền hồng pastel, hoa hồng phấn, cúc họa mi trắng, lá phụ xanh.", "Giá": 200.0},
    {"STT": 4, "Mã sản phẩm": "#DR252", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Thược dược hồng cam, hoa hồng pastel, đồng tiền hồng nhạt, hoa ly trắng, cỏ pampas.", "Giá": 250.0},
    {"STT": 5, "Mã sản phẩm": "#DR261", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Cẩm tú cầu xanh, lá bạch đàn", "Giá": 250.0},
    {"STT": 6, "Mã sản phẩm": "#DR636", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng đỏ, cúc họa mi, lá phụ xanh", "Giá": 250.0},
    {"STT": 7, "Mã sản phẩm": "#DR296", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa tulip hồng pastel", "Giá": 200.0},
    {"STT": 8, "Mã sản phẩm": "#DR901", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa cúc họa mi trắng, mao lương cam và hồng nhạt, tulip vàng, baby xanh", "Giá": 300.0},
    {"STT": 9, "Mã sản phẩm": "#NT358", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa cẩm chướng trắng, hoa đồng tiền hồng nhạt, hoa thanh tú xanh nhạt, hoa calla trắng", "Giá": 450.0},
    {"STT": 10, "Mã sản phẩm": "#NT448", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Cúc mẫu đơn cam, thược dược vàng, hoa cúc tây, baby trắng, lá xanh", "Giá": 600.0},
    {"STT": 11, "Mã sản phẩm": "#NT729", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hồng phấn, đồng tiền hồng nhạt, baby trắng, cúc họa mi", "Giá": 700.0},
    {"STT": 12, "Mã sản phẩm": "#NT426", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng kem, hồng pastel, cẩm chướng hồng, hoa lan mini", "Giá": 600.0},
    {"STT": 13, "Mã sản phẩm": "#NT792", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Đồng tiền tím, hồng tím pastel, baby trắng, cúc tây tím, lá bạc", "Giá": 400.0},
    {"STT": 14, "Mã sản phẩm": "#NT412", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hồng tím, cẩm chướng tím, baby trắng, hoa ly, lan tường", "Giá": 700.0},
    {"STT": 15, "Mã sản phẩm": "#NT840", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa ly trắng kép, lá phụ xanh nhạt", "Giá": 600.0},
    {"STT": 16, "Mã sản phẩm": "#NT237", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Cúc mẫu đơn vàng, hồng kem, hoa bi trắng, lá bạc", "Giá": 500.0},
    {"STT": 17, "Mã sản phẩm": "#NT209", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa tulip cam, hồng đỏ cam, lá bạc", "Giá": 400.0},
    {"STT": 18, "Mã sản phẩm": "#NT113", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng phấn, cúc mẫu đơn hồng, đồng tiền trắng, baby trắng", "Giá": 350.0},
    {"STT": 19, "Mã sản phẩm": "#NT386", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Tulip hồng pastel, hoa hồng phấn, cúc họa mi trắng", "Giá": 500.0},
    {"STT": 20, "Mã sản phẩm": "#NT741", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Cúc vàng, hồng cam, thược dược vàng, baby trắng", "Giá": 500.0},
    {"STT": 21, "Mã sản phẩm": "#NT210", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hồng đỏ, cẩm chướng kem, baby trắng, lá bạc", "Giá": 400.0},
    {"STT": 22, "Mã sản phẩm": "#NT546", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa thược dược hồng, hoa lan trắng, hồng pastel, calla trắng", "Giá": 700.0},
    {"STT": 23, "Mã sản phẩm": "#EL111", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa ly hồng, hoa hồng pastel, baby trắng, lá phụ xanh", "Giá": 500.0},
    {"STT": 24, "Mã sản phẩm": "#EL222", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa ly hồng pastel, cẩm chướng trắng, baby trắng, lá bạc", "Giá": 600.0},
    {"STT": 25, "Mã sản phẩm": "#EL333", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa lan hồ điệp trắng, hoa hồng kem, hồng pastel, cẩm chướng hồng, calla trắng, baby trắng", "Giá": 700.0},
    {"STT": 26, "Mã sản phẩm": "#EL444", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa cẩm tú cầu xanh, baby trắng, lá bạch đàn", "Giá": 800.0},
    {"STT": 27, "Mã sản phẩm": "#EL555", "Phân loại ": "Hoa bó", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng tím, cẩm tú cầu xanh tím, lan tím, baby trắng, lá phụ xanh", "Giá": 650.0},
    {"STT": 28, "Mã sản phẩm": "#MD666", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa lan mokara hồng, lan hồ điệp, lá bạc", "Giá": 6000.0},
    {"STT": 29, "Mã sản phẩm": "#MD448", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng đỏ, cẩm chướng hồng, nhài Clematis trắng, lan hồ điệp trắng, lá phụ xanh", "Giá": 8200.0},
    {"STT": 30, "Mã sản phẩm": "#MD731", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa lily, tulip, hoa hồng, cẩm chướng nhỏ, lá bạc", "Giá": 2000.0},
    {"STT": 31, "Mã sản phẩm": "#MD572", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa rum, hoa hồng, lan hồ điệp trắng, cúc mẫu đơn vàng, lan vũ nữ nhỏ, lá phụ ", "Giá": 4000.0},
    {"STT": 32, "Mã sản phẩm": "#MD361", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": " tulip vàng, cúc đồng tiền vàng, thược dược, lan hồ điệp, lan vũ nữ, lan mokara, hoa nhài", "Giá": 2000.0},
    {"STT": 33, "Mã sản phẩm": "#MD210", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa hướng dương, hoa hồng vàng, cúc mẫu đơn vàng nhạt", "Giá": 1200.0},
    {"STT": 34, "Mã sản phẩm": "#MD471", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa mẫu đơn hồng, hoa anh đào, hoa lan hồng, hoa hồng pastel", "Giá": 1000.0},
    {"STT": 35, "Mã sản phẩm": "#MD900", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa lan hồ điệp trắng – tím, hoa hồng , hoa mao lương", "Giá": 4800.0},
    {"STT": 36, "Mã sản phẩm": "#MD520", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa cúc mẫu đơn xanh nhạt, hoa hồng đào, hoa mao lương, hoa cúc xanh, lá xanh và nụ sen trang trí", "Giá": 4500.0},
    {"STT": 37, "Mã sản phẩm": "#MD131", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa rum trắng, hoa cúc xanh, hoa hồng xanh nhạt", "Giá": 1000.0},
    {"STT": 38, "Mã sản phẩm": "#MD682", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa sen hồng nhạt, hoa sen trắng pha hồng, nụ sen, lá sen xanh và đài sen trang trí.", "Giá": 4800.0},
    {"STT": 39, "Mã sản phẩm": "#MD359", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng hồng pastel, hoa tulip hồng nhạt, hoa cúc mẫu đơn hồng, hoa baby trắng và tím nhạt, hoa cẩm chướng", "Giá": 4500.0},
    {"STT": 40, "Mã sản phẩm": "#MD846", "Phân loại ": "Hoa Bình", "Ý nghĩa": null, "Unnamed: 4": "Hoa sen trắng, nụ sen xanh, đài sen, hoa hồng trắng, hoa cát tường trắng", "Giá": 10000.0},
    {"STT": 41, "Mã sản phẩm": "#MP276", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa mẫu đơn cam, hoa hồng đỏ và hồng cam, hoa cúc ping pong vàng, hoa dahlia đỏ, hoa cúc mẫu đơn hồng", "Giá": 500.0},
    {"STT": 42, "Mã sản phẩm": "#MP101", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa tulip hồng, hoa hồng pastel, hoa mẫu đơn hồng nhạt, hoa lan mokara hồng", "Giá": 720.0},
    {"STT": 43, "Mã sản phẩm": "#MP102", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa tulip trắng, hoa cúc mẫu đơn hồng nhạt, hoa cẩm chướng trắng, hoa baby trắng", "Giá": 450.0},
    {"STT": 44, "Mã sản phẩm": "#MP103", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa mẫu đơn hồng, hoa cúc ping pong hồng, hoa anthurium (môn hồng), hoa cẩm chướng trắng", "Giá": 900.0},
    {"STT": 45, "Mã sản phẩm": "#MP104", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng tím, hoa cát tường tím, hoa cẩm chướng tím và lá phụ xanh", "Giá": 800.0},
    {"STT": 46, "Mã sản phẩm": "#MP105", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa cẩm chướng, hoa mẫu đơn hồng nhạt, hoa cúc ping pong trắng, hoa lan hồ điệp trắng và lá eucalyptus xanh bạc", "Giá": 450.0},
    {"STT": 47, "Mã sản phẩm": "#MP106", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa lan hồ điệp tím, hoa tulip hồng, hoa cúc mẫu đơn, hoa baby trắng", "Giá": 2000.0},
    {"STT": 48, "Mã sản phẩm": "#MP107", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng xanh lá, hoa lan mokara xanh, hoa cúc ping pong xanh, hoa mao lương xanh nhạt", "Giá": 800.0},
    {"STT": 49, "Mã sản phẩm": "#MP108", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng pastel, hoa cát tường trắng, hoa mẫu đơn hồng nhạt, hoa cúc mẫu đơn nhỏ", "Giá": 700.0},
    {"STT": 50, "Mã sản phẩm": "#MP109", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng hồng pastel, hoa cúc mẫu đơn hồng, hoa baby trắng, hoa sao tím", "Giá": 3000.0},
    {"STT": 51, "Mã sản phẩm": "#MP110", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa đồng tiền cam nhạt, hoa hồng pastel, hoa cúc họa mi nhỏ, hoa baby hồng", "Giá": 150.0},
    {"STT": 52, "Mã sản phẩm": "#MP111", "Phân loại ": "Hoa Lẵng", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng vàng, hoa hồng kem, hoa cúc mẫu đơn trắng, hoa cúc nhỏ vàng nhạt", "Giá": 500.0},
    {"STT": 53, "Mã sản phẩm": "#GZ971", "Phân loại ": "Hoa hộp", "Ý nghĩa": null, "Unnamed: 4": "Hoa lan hồ điệp tím, hoa baby tím", "Giá": 500.0},
    {"STT": 54, "Mã sản phẩm": "#GZ630", "Phân loại ": "Hoa hộp", "Ý nghĩa": null, "Unnamed: 4": "Hoa hồng cam và hồng nhạt, hoa cẩm tú cầu xanh trắng, hoa cúc nhỏ", "Giá": 600.0}
  ]
};

// Hàm để cấu hình AI API
function configureAI(apiKey, endpoint = null) {
  if (window.hamienChatbot) {
    window.hamienChatbot.configureAI(apiKey, endpoint);
    CHATBOT_CONFIG.ai.enabled = true;
    CHATBOT_CONFIG.ai.apiKey = apiKey;
    if (endpoint) {
      CHATBOT_CONFIG.ai.endpoint = endpoint;
    }
    console.log('AI API đã được cấu hình thành công!');
  } else {
    console.error('Chatbot chưa được khởi tạo');
  }
}

// Hàm để bật/tắt AI
function toggleAI(enabled) {
  CHATBOT_CONFIG.ai.enabled = enabled;
  console.log(`AI ${enabled ? 'đã được bật' : 'đã được tắt'}`);
}

// Hàm để xóa lịch sử chat
function clearChatHistory() {
  if (window.hamienChatbot) {
    window.hamienChatbot.clearHistory();
    console.log('Lịch sử chat đã được xóa');
  }
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CHATBOT_CONFIG;
}

// Expose to browser global
try { window.CHATBOT_CONFIG = CHATBOT_CONFIG; } catch (_) {}
