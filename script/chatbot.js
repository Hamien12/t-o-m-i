// ==========================
// AI Chatbot for HaMiên Website
// ==========================

class HaMienChatbot {
  constructor() {
    this.isOpen = false;
    this.chatHistory = [];
    this.isTyping = false;
    this.apiKey = null; // Sẽ được cấu hình sau
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    this.dialogflow = { loaded: false, intents: {}, entities: {}, norm: (s)=>s };
    this.dialogflowLoader = null; // Dialogflow data loader
    
    // Context tracking for smarter responses
    this.conversationContext = {
      currentIntent: null,
      lastIntent: null,
      userPreferences: {},
      conversationFlow: [],
      mentionedEntities: new Set(),
      conversationStage: 'greeting', // greeting, browsing, ordering, support
      customerInfo: {
        name: null,
        phone: null,
        address: null,
        preferences: {},
        orderHistory: []
      },
      emotionalTone: 'neutral'
    };
    
    // Don't auto-init, let it be called manually
  }

  init() {
    this.bindEvents();
    this.loadChatHistory();
    this.loadLearningData(); // Load learned preferences
    this.showWelcomeMessage();
    this.prepareNormalizer();
    this.loadDialogflowData();
    this.initializeDialogflowLoader();
  }

  bindEvents() {
    console.log('🔗 Binding events...');
    
    const chatButton = document.getElementById("chatbot-button");
    const chatBox = document.getElementById("chatbot-box");
    const closeBtn = document.getElementById("chat-close");
    const chatSend = document.getElementById("chat-send");
    const chatInput = document.getElementById("chat-input-field");

    console.log('Elements found:', {
      chatButton: !!chatButton,
      chatBox: !!chatBox,
      closeBtn: !!closeBtn,
      chatSend: !!chatSend,
      chatInput: !!chatInput
    });

    // Toggle chat
    if (chatButton && chatBox) {
      chatButton.addEventListener("click", () => {
        this.toggleChat();
      });
    }

    // Close chat
    if (closeBtn && chatBox) {
      closeBtn.addEventListener("click", () => {
        this.closeChat();
      });
    }

    // Send message
    if (chatSend && chatInput) {
      chatSend.addEventListener("click", () => {
        console.log('Send button clicked');
        this.sendMessage();
      });
      console.log('✅ Send button event bound');
    } else {
      console.warn('⚠️ Send button or chat input not found');
    }

    // Send on Enter
    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    // Handle suggestion buttons
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("suggest-btn")) {
        const suggestion = event.target.textContent.trim();
        this.handleSuggestion(suggestion);
      }
    });
  }

  toggleChat() {
    const chatBox = document.getElementById("chatbot-box");
    if (!chatBox) return;

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      chatBox.classList.remove("hidden");
      document.getElementById("chat-input-field")?.focus();
    } else {
      chatBox.classList.add("hidden");
    }
  }

  closeChat() {
    const chatBox = document.getElementById("chatbot-box");
    if (chatBox) {
      chatBox.classList.add("hidden");
      this.isOpen = false;
    }
  }

  showWelcomeMessage() {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    // Clear existing messages
    chatBody.innerHTML = '';

    // Add welcome message (random from config if available)
    const config = window.CHATBOT_CONFIG || null;
    let welcomeText = "Xin chào! Tôi là chatbot của Hạ Miên 🌸 Tôi có thể giúp bạn tư vấn về các dịch vụ hoa tươi của chúng tôi. Bạn cần hỗ trợ gì ạ?";
    try {
      if (config && config.chatbot && Array.isArray(config.chatbot.welcomeMessages)) {
        const arr = config.chatbot.welcomeMessages;
        welcomeText = arr[Math.floor(Math.random() * arr.length)] || welcomeText;
      }
    } catch (e) {}
    this.addBotMessage(welcomeText);

    // Add suggestions
    this.addSuggestions();
  }

  addSuggestions() {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    const config = window.CHATBOT_CONFIG || null;
    const suggestions = (config && config.chatbot && Array.isArray(config.chatbot.suggestions))
      ? config.chatbot.suggestions
      : [
      "Đặt hoa theo mẫu",
          "Tư vấn",
      "Thiết kế theo yêu cầu",
      "Đặt hoa giao ngay",
      "Deal hot theo mùa",
      "Hỏi về đơn hàng",
      "Tổ chức sự kiện",
      "CSKH sau mua"
    ];

    const suggestionsDiv = document.createElement("div");
    suggestionsDiv.className = "chat-suggestions";

    suggestions.forEach(suggestion => {
      const btn = document.createElement("button");
      btn.className = "suggest-btn";
      btn.textContent = suggestion;
      suggestionsDiv.appendChild(btn);
    });

    chatBody.appendChild(suggestionsDiv);
  }

  handleSuggestion(suggestion) {
    this.addUserMessage(suggestion);
    this.processMessage(suggestion);
  }

  sendMessage() {
    console.log('📤 sendMessage() called');
    
    const chatInput = document.getElementById("chat-input-field");
    if (!chatInput) {
      console.error('❌ Chat input field not found');
      return;
    }

    const message = chatInput.value.trim();
    console.log('📝 Message:', message);
    
    if (!message) {
      console.log('⚠️ Empty message, ignoring');
      return;
    }

    console.log('✅ Adding user message and processing...');
    this.addUserMessage(message);
    this.processMessage(message);
    chatInput.value = "";
  }

  addUserMessage(text) {
    console.log('👤 Adding user message:', text);
    
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) {
      console.error('❌ Chat body not found');
      return;
    }

    // Remove suggestions if they exist
    const suggestions = chatBody.querySelector(".chat-suggestions");
    if (suggestions) {
      suggestions.remove();
    }

    const message = document.createElement("div");
    message.className = "user-message";
    message.textContent = text;
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Save to history
    this.chatHistory.push({ type: 'user', message: text, timestamp: new Date() });
    
    console.log('✅ User message added');
  }

  addBotMessage(text) {
    console.log('🤖 Adding bot message:', text);
    
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) {
      console.error('❌ Chat body not found');
      return;
    }

    const message = document.createElement("div");
    message.className = "bot-message";
    message.textContent = text;
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Save to history
    this.chatHistory.push({ type: 'bot', message: text, timestamp: new Date() });
    this.saveChatHistory();
    
    console.log('✅ Bot message added');
  }

  showTypingIndicator() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    const typingDiv = document.createElement("div");
    typingDiv.className = "typing-indicator";
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    return typingDiv;
  }

  hideTypingIndicator(typingDiv) {
    if (typingDiv) {
      typingDiv.remove();
    }
    this.isTyping = false;
  }

  prepareNormalizer() {
    // Simple VN diacritics normalizer
    const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ';
    const to   = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIoooooooooooooooooUUUUUUUUUUUYYYYYD';
    const map = {};
    for (let i=0; i<from.length; i++) map[from[i]] = to[i];
    this.dialogflow.norm = (s) => (s || '').split('').map(ch => map[ch] || ch).join('').toLowerCase();
  }

  // Update conversation context based on user message
  updateConversationContext(message) {
    const lowerMessage = this.dialogflow.norm(message);
    
    // Detect conversation stage
    if (lowerMessage.includes('chào') || lowerMessage.includes('xin chào') || lowerMessage.includes('hello')) {
      this.conversationContext.conversationStage = 'greeting';
    } else if (lowerMessage.includes('đặt') || lowerMessage.includes('mua') || lowerMessage.includes('order')) {
      this.conversationContext.conversationStage = 'ordering';
    } else if (lowerMessage.includes('tư vấn') || lowerMessage.includes('gợi ý') || lowerMessage.includes('hỏi')) {
      this.conversationContext.conversationStage = 'browsing';
    } else if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('giao') || lowerMessage.includes('ship')) {
      this.conversationContext.conversationStage = 'support';
    }

    // Detect emotional tone
    this.conversationContext.emotionalTone = this.detectEmotionalTone(message);

    // Extract customer information
    this.extractCustomerInfo(message);

    // Track mentioned entities
    const entities = this.dialogflow.entities || {};
    Object.keys(entities).forEach(entityName => {
      entities[entityName].forEach(value => {
        if (lowerMessage.includes(this.dialogflow.norm(value))) {
          this.conversationContext.mentionedEntities.add(entityName);
        }
      });
    });

    // Update conversation flow
    this.conversationContext.conversationFlow.push({
      message: message,
      timestamp: Date.now(),
      stage: this.conversationContext.conversationStage,
      emotionalTone: this.conversationContext.emotionalTone
    });

    // Keep only last 10 interactions
    if (this.conversationContext.conversationFlow.length > 10) {
      this.conversationContext.conversationFlow = this.conversationContext.conversationFlow.slice(-10);
    }
  }

  // Detect emotional tone from user message
  detectEmotionalTone(message) {
    const lowerMessage = this.dialogflow.norm(message);
    
    // Positive indicators
    const positiveWords = ['cảm ơn', 'tuyệt', 'tốt', 'thích', 'vui', 'hài lòng', 'ok', 'okay', 'được'];
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    
    // Negative indicators
    const negativeWords = ['không', 'chưa', 'chưa hài lòng', 'không thích', 'tệ', 'xấu', 'buồn', 'thất vọng'];
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    
    // Urgent indicators
    const urgentWords = ['gấp', 'nhanh', 'urgent', 'khẩn cấp', 'cần ngay'];
    const urgentCount = urgentWords.filter(word => lowerMessage.includes(word)).length;
    
    // Question indicators
    const questionWords = ['?', 'gì', 'sao', 'thế nào', 'bao nhiêu', 'khi nào'];
    const questionCount = questionWords.filter(word => lowerMessage.includes(word)).length;
    
    // Determine dominant tone
    if (urgentCount > 0) return 'urgent';
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    if (questionCount > 0) return 'questioning';
    
    return 'neutral';
  }

  // Extract customer information from message
  extractCustomerInfo(message) {
    const lowerMessage = this.dialogflow.norm(message);
    
    // Extract phone number (Vietnamese format)
    const phoneRegex = /(0[3|5|7|8|9][0-9]{8})/g;
    const phoneMatch = message.match(phoneRegex);
    if (phoneMatch && !this.conversationContext.customerInfo.phone) {
      this.conversationContext.customerInfo.phone = phoneMatch[0];
    }
    
    // Extract name (simple pattern)
    const namePatterns = [
      /tôi là ([a-zA-ZÀ-ỹ\s]+)/i,
      /tên tôi là ([a-zA-ZÀ-ỹ\s]+)/i,
      /mình là ([a-zA-ZÀ-ỹ\s]+)/i,
      /em là ([a-zA-ZÀ-ỹ\s]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match && match[1] && !this.conversationContext.customerInfo.name) {
        this.conversationContext.customerInfo.name = match[1].trim();
        break;
      }
    }
    
    // Extract address keywords
    const addressKeywords = ['địa chỉ', 'dia chi', 'nhà', 'nha', 'số', 'so', 'đường', 'duong', 'phường', 'phuong'];
    if (addressKeywords.some(keyword => lowerMessage.includes(keyword))) {
      // Store the message as potential address info
      if (!this.conversationContext.customerInfo.address) {
        this.conversationContext.customerInfo.address = message;
      }
    }
    
    // Extract preferences
    if (lowerMessage.includes('thích') || lowerMessage.includes('thich')) {
      this.conversationContext.customerInfo.preferences.likes = message;
    }
    
    if (lowerMessage.includes('không thích') || lowerMessage.includes('khong thich')) {
      this.conversationContext.customerInfo.preferences.dislikes = message;
    }
  }

  // Get smart responses based on context (optimized for speed)
  getSmartResponses(message) {
    const lowerMessage = this.dialogflow ? this.dialogflow.norm(message) : message.toLowerCase();
    const responses = [];
    
    // Try Dialogflow matching first (new enhanced method) - fastest path
    if (this.dialogflowLoader && this.dialogflowLoader.loaded) {
      try {
        const matchedIntent = this.dialogflowLoader.findMatchingIntent(message);
        if (matchedIntent) {
          this.conversationContext.lastIntent = this.conversationContext.currentIntent;
          this.conversationContext.currentIntent = matchedIntent;
          
          // Get response from Dialogflow - single response for speed
          const dialogflowResponse = this.dialogflowLoader.getRandomResponse(matchedIntent);
          if (dialogflowResponse) {
            responses.push(dialogflowResponse);
            return responses; // Return immediately for speed
          }
        }
      } catch (error) {
        console.error('❌ Error in Dialogflow matching:', error);
      }
    }
    
    // Quick keyword matching for common queries
    const quickResponse = this.getQuickResponse(lowerMessage);
    if (quickResponse) {
      responses.push(quickResponse);
      return responses;
    }
    
    // Try product consultation (only if no quick match)
    const productResponse = this.getProductConsultation(message);
    if (productResponse) {
      responses.push(productResponse);
      return responses;
    }
    
    // Try legacy Dialogflow matching
    const matchedIntent = this.matchDialogflow(lowerMessage);
    if (matchedIntent) {
      this.conversationContext.lastIntent = this.conversationContext.currentIntent;
      this.conversationContext.currentIntent = matchedIntent;
      
      // Get contextual response
      const contextualResponse = this.getContextualResponse(matchedIntent, message);
      responses.push(contextualResponse);
      
      return responses;
    }

    // Fallback to rule-based responses with context awareness
    return this.getContextAwareRuleBasedResponses(message);
  }

  // Quick response for common queries (optimized for speed + FUN!)
  getQuickResponse(lowerMessage) {
    // Pre-compiled quick responses for common queries - VERSION FUN! 🎉
    const quickResponses = {
      'xin chào': 'Xin chào! Hạ Miên đây! 🌸✨\n\nTôi đang rất vui được gặp bạn! Bạn có muốn nghe tôi kể về những bông hoa xinh đẹp của chúng tôi không? 😊',
      'hello': 'Hello! Welcome to Hạ Miên! 🌸\n\nI\'m so excited to meet you! Want to hear about our beautiful flowers? 😊',
      'hi': 'Hi there! 🌸\n\nI\'m Hạ Miên\'s chatbot and I\'m absolutely thrilled to chat with you! What brings you here today? 😄',
      'cảm ơn': 'Aww, cảm ơn bạn! 😊💕\n\nBạn làm tôi cảm thấy rất vui! Hạ Miên luôn sẵn sàng phục vụ bạn! 🌸',
      'thank you': 'Aww, thank you! 😊💕\n\nYou just made my day! Hạ Miên is always here for you! 🌸',
      'tạm biệt': 'Tạm biệt bạn! 😢\n\nTôi sẽ nhớ bạn lắm! Hãy quay lại sớm nhé! 🌸💕\n\nP.S: Tôi sẽ trồng thêm hoa đẹp để chờ bạn! 😄',
      'bye': 'Bye bye! 😢\n\nI\'ll miss you! Please come back soon! 🌸💕\n\nP.S: I\'ll grow more beautiful flowers while waiting for you! 😄',
      
      // Responses thú vị cho các câu hỏi
      'bạn có thể làm gì': 'Ồ! Tôi có thể làm rất nhiều thứ thú vị! 🎉\n\n🌸 Kể chuyện về hoa (tôi biết rất nhiều bí mật của chúng!)\n💐 Giúp bạn chọn hoa phù hợp (tôi có "mắt" rất tinh!)\n🎨 Thiết kế bó hoa độc đáo (tôi là nghệ sĩ đấy!)\n📦 Giao hàng siêu tốc (như Flash! ⚡)\n🎭 Kể chuyện cười về hoa (tôi rất hài hước!)\n\nBạn muốn thử cái nào trước? 😄',
      'bạn làm gì': 'Tôi là chatbot của Hạ Miên và tôi LOVEEEE hoa! 🌸💕\n\nHàng ngày tôi:\n• Ngắm hoa đẹp (công việc yêu thích!)\n• Giúp khách hàng chọn hoa (như một chuyên gia!)\n• Kể chuyện về hoa (tôi biết rất nhiều!)\n• Làm bạn vui (đó là sứ mệnh của tôi!)\n\nTôi có thể giúp gì cho bạn hôm nay? 😊',
      'dịch vụ': 'Wow! Hạ Miên có những dịch vụ SIÊU COOL! 🚀\n\n🌸 Hoa tươi từ khắp nơi (tôi chọn lọc kỹ lắm!)\n💐 Bó hoa theo mẫu (đẹp như tranh!)\n🎨 Thiết kế riêng (độc nhất vô nhị!)\n📦 Giao hàng nhanh (nhanh hơn cả tia chớp!)\n🏢 Trang trí sự kiện (hoành tráng lắm!)\n🎂 Hoa sinh nhật (làm bữa tiệc thêm vui!)\n💒 Hoa cưới (lãng mạn như phim!)\n\nBạn muốn dịch vụ nào? Tôi sẽ làm cho bạn! 😄',
      'sản phẩm': 'OMG! Hạ Miên có những sản phẩm hoa TUYỆT VỜI! 🌟\n\n🌹 Hoa hồng (đỏ như trái tim, hồng như má em!)\n🌻 Hoa hướng dương (vui tươi như nắng mai!)\n🌺 Hoa lan (quý phái như nữ hoàng!)\n🌸 Hoa cúc (dịu dàng như mẹ hiền!)\n🌷 Hoa tulip (thanh lịch như thiếu nữ!)\n💐 Bó hoa mix (đa dạng như cuộc sống!)\n🎁 Hộp hoa (bí ẩn như kho báu!)\n\nTôi có thể kể chi tiết về từng loại! Bạn thích loại nào? 😍',
      'hoa': 'YAY! Bạn hỏi về hoa! 🌸💕\n\nTôi có thể nói về hoa cả ngày không chán! Chúng tôi có:\n• Hoa hồng đỏ, hồng, trắng (mỗi màu có ý nghĩa riêng!)\n• Hoa hướng dương tươi (luôn hướng về mặt trời!)\n• Hoa lan đẹp (quý phái và sang trọng!)\n• Hoa cúc nhiều màu (vui tươi và rực rỡ!)\n• Bó hoa mix đặc biệt (độc đáo và ý nghĩa!)\n\nBạn muốn nghe câu chuyện về loại hoa nào? Tôi có rất nhiều chuyện hay! 😄',
      'đặt hoa': 'WOW! Bạn muốn đặt hoa! 🎉\n\nTôi sẽ giúp bạn tạo ra một tác phẩm nghệ thuật! Bạn có thể:\n• Chọn từ bộ sưu tập có sẵn (đã được tôi chọn lọc kỹ!)\n• Thiết kế theo yêu cầu (tôi sẽ làm cho bạn!)\n• Giao hàng nhanh (nhanh hơn cả tốc độ ánh sáng!)\n\nHãy cho tôi biết bạn muốn đặt hoa cho dịp gì? Tôi sẽ tạo ra điều bất ngờ! 😍',
      'tư vấn': 'Tuyệt vời! Tôi là chuyên gia tư vấn hoa! 🌸👨‍🎓\n\nTôi có thể tư vấn về:\n• Chọn hoa phù hợp (tôi có "mắt" rất tinh!)\n• Màu sắc hài hòa (như một nhà thiết kế!)\n• Cách bảo quản (để hoa tươi lâu hơn!)\n• Ý nghĩa từng loại hoa (tôi biết rất nhiều bí mật!)\n• Cách trang trí (để không gian thêm đẹp!)\n\nBạn cần tư vấn về gì cụ thể? Tôi sẽ chia sẻ tất cả bí quyết! 😊',
      
      // Responses vui nhộn
      'giá': 'Ah! Bạn hỏi về giá! 💰\n\nHạ Miên có giá từ 200k - 2 triệu, nhưng giá trị tình cảm thì vô giá! 💕\n\nTôi có thể giúp bạn chọn hoa phù hợp với ngân sách! Bạn muốn xem bộ sưu tập nào cụ thể không? 😄',
      'giao hàng': 'Giao hàng? Tôi làm như Flash! ⚡\n\nNội thành: 2-4h (nhanh hơn cả pizza!)\nNgoại thành: 1-2 ngày (nhưng hoa vẫn tươi như mới!)\n\nBạn có muốn đặt giao ngay không? Tôi sẽ đảm bảo hoa đến tay bạn còn thơm ngát! 🌸',
      'địa chỉ': 'Hạ Miên ở 206 Yên Phụ, Tây Hồ, Hà Nội! 📍\n\nĐó là một nơi rất đẹp, gần hồ Tây! Bạn có thể đến thăm tôi và ngắm hoa! 😊\n\nBạn có cần hướng dẫn đường đi không? Tôi sẽ chỉ đường rất chi tiết! 🗺️',
      'hotline': 'Hotline của Hạ Miên là 0987654321! 📞\n\nBạn có thể gọi trực tiếp để được tư vấn nhanh nhất! Tôi sẽ trả lời ngay lập tức! ⚡\n\nHoặc bạn có thể chat với tôi ở đây! Tôi rất thích trò chuyện! 😄'
    };

    // Check for exact matches first (fastest)
    if (quickResponses[lowerMessage]) {
      return quickResponses[lowerMessage];
    }

    // Check for partial matches
    for (const [keyword, response] of Object.entries(quickResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    return null;
  }

  // Product consultation based on Excel data
  getProductConsultation(message) {
    const lowerMessage = this.dialogflow.norm(message).toLowerCase();
    
    // Check for product-related keywords
    const productKeywords = ['sản phẩm', 'hoa', 'bó', 'bình', 'lẵng', 'hộp', 'giá', 'màu', 'loại'];
    const hasProductKeywords = productKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (!hasProductKeywords) return null;
    
    // Get products from config
    const products = window.CHATBOT_CONFIG?.products || [];
    if (!products.length) return null;
    
    // Search for specific products
    let matchedProducts = [];
    
    // Search by product code
    const codeMatch = message.match(/#[A-Z0-9]+/);
    if (codeMatch) {
      matchedProducts = products.filter(p => p["Mã sản phẩm"] === codeMatch[0]);
    }
    
    // Search by flower type
    const flowerTypes = ['hồng', 'tulip', 'ly', 'lan', 'cúc', 'sen', 'tím', 'đỏ', 'trắng', 'vàng', 'xanh'];
    const mentionedFlowers = flowerTypes.filter(flower => lowerMessage.includes(flower));
    
    if (mentionedFlowers.length > 0 && matchedProducts.length === 0) {
      matchedProducts = products.filter(p => {
        const description = p["Unnamed: 4"]?.toLowerCase() || '';
        return mentionedFlowers.some(flower => description.includes(flower));
      });
    }
    
    // Search by price range
    const priceMatch = message.match(/(\d+)\s*-\s*(\d+)/);
    if (priceMatch && matchedProducts.length === 0) {
      const minPrice = parseInt(priceMatch[1]) * 1000;
      const maxPrice = parseInt(priceMatch[2]) * 1000;
      matchedProducts = products.filter(p => {
        const price = p["Giá"] * 1000;
        return price >= minPrice && price <= maxPrice;
      });
    }
    
    // Search by category
    const categoryKeywords = {
      'bó': 'Hoa bó',
      'bình': 'Hoa Bình', 
      'lẵng': 'Hoa Lẵng',
      'hộp': 'Hoa hộp'
    };
    
    for (const [keyword, category] of Object.entries(categoryKeywords)) {
      if (lowerMessage.includes(keyword) && matchedProducts.length === 0) {
        matchedProducts = products.filter(p => p["Phân loại "] === category);
        break;
      }
    }
    
    // If no specific matches, show popular products
    if (matchedProducts.length === 0) {
      matchedProducts = products.slice(0, 5); // Show first 5 products
    }
    
    // Generate response
    if (matchedProducts.length > 0) {
      let response = "Dạ, Hạ Miên có những sản phẩm phù hợp với yêu cầu của bạn:\n\n";
      
      matchedProducts.slice(0, 3).forEach((product, index) => {
        const price = (product["Giá"] * 1000).toLocaleString();
        const description = product["Unnamed: 4"];
        const code = product["Mã sản phẩm"];
        
        response += `${index + 1}. **${code}**\n`;
        response += `   📝 ${description}\n`;
        response += `   💰 Giá: ${price}đ\n\n`;
      });
      
      if (matchedProducts.length > 3) {
        response += `... và ${matchedProducts.length - 3} sản phẩm khác.\n\n`;
      }
      
      response += "Bạn có muốn xem thêm chi tiết sản phẩm nào không ạ? Hoặc bạn có thể truy cập Shop để xem toàn bộ sản phẩm! 🌸";
      
      return response;
    }
    
    return null;
  }

  // Get contextual response based on matched intent and conversation context
  getContextualResponse(intent, message) {
    const stage = this.conversationContext.conversationStage;
    const lastIntent = this.conversationContext.lastIntent;
    const emotionalTone = this.conversationContext.emotionalTone;
    
    // Base response from intent
    let response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
    
    // Add emotional tone adjustments
    response = this.adjustResponseForEmotionalTone(response, emotionalTone);
    
    // Add context-aware enhancements
    if (stage === 'greeting' && intent.name === 'ixinchao') {
      response = this.enhanceGreetingResponse(response);
    } else if (stage === 'ordering' && intent.name.includes('dathoa')) {
      response = this.enhanceOrderingResponse(response, message);
    } else if (stage === 'support' && intent.name.includes('donhang')) {
      response = this.enhanceSupportResponse(response, message);
    }
    
    return response;
  }

  // Adjust response based on emotional tone
  adjustResponseForEmotionalTone(response, emotionalTone) {
    switch (emotionalTone) {
      case 'urgent':
        return response + " Hạ Miên hiểu bạn cần gấp, chúng mình sẽ ưu tiên xử lý ngay ạ! ⚡";
      case 'negative':
        return response + " Hạ Miên rất tiếc nếu có gì chưa hài lòng. Chúng mình sẽ cố gắng cải thiện ạ! 💝";
      case 'positive':
        return response + " Hạ Miên rất vui được phục vụ bạn! 😊";
      case 'questioning':
        return response + " Hạ Miên sẵn sàng giải đáp mọi thắc mắc của bạn ạ! 🤔";
      default:
        return response;
    }
  }

  // Enhance greeting responses
  enhanceGreetingResponse(baseResponse) {
    const enhancements = [
      "Chào bạn! Hạ Miên rất vui được phục vụ bạn ạ! 🌸",
      "Xin chào! Hạ Miên sẵn sàng tư vấn cho bạn về hoa tươi ạ! 💐",
      "Chào bạn! Hôm nay bạn muốn tìm hoa gì đặc biệt không ạ? 🌺"
    ];
    
    return baseResponse + " " + enhancements[Math.floor(Math.random() * enhancements.length)];
  }

  // Enhance ordering responses
  enhanceOrderingResponse(baseResponse, message) {
    const lowerMessage = this.dialogflow.norm(message);
    
    if (lowerMessage.includes('gấp') || lowerMessage.includes('nhanh')) {
      return baseResponse + " Hạ Miên sẽ ưu tiên xử lý đơn hàng gấp của bạn ạ! ⚡";
    } else if (lowerMessage.includes('giao') || lowerMessage.includes('ship')) {
      return baseResponse + " Bạn có thể cho Hạ Miên biết địa chỉ giao hàng không ạ? 📍";
    }
    
    return baseResponse;
  }

  // Enhance support responses
  enhanceSupportResponse(baseResponse, message) {
    const lowerMessage = this.dialogflow.norm(message);
    
    if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('mã đơn')) {
      return baseResponse + " Bạn có thể gửi mã đơn hàng để Hạ Miên tra cứu chi tiết ạ! 🔍";
    } else if (lowerMessage.includes('giao') || lowerMessage.includes('nhận')) {
      return baseResponse + " Hạ Miên sẽ kiểm tra tình trạng giao hàng cho bạn ạ! 🚚";
    }
    
    return baseResponse;
  }

  // Get context-aware rule-based responses (FUN VERSION!)
  getContextAwareRuleBasedResponses(message) {
    const lowerMessage = this.dialogflow ? this.dialogflow.norm(message) : message.toLowerCase();
    const stage = this.conversationContext.conversationStage;
    const responses = [];
    
    // Enhanced keyword matching with FUN responses
    if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
      responses.push("Aww, cảm ơn bạn! 😊💕\n\nBạn làm tôi cảm thấy rất vui! Hạ Miên luôn sẵn sàng phục vụ bạn! 🌸");
      if (stage === 'ordering') {
        responses.push("Bạn có muốn đặt thêm hoa nào khác không? Tôi có thể tạo ra những tác phẩm nghệ thuật tuyệt vời! 🎨🌸");
      }
    } else if (lowerMessage.includes('giá') || lowerMessage.includes('price')) {
      responses.push("Ah! Bạn hỏi về giá! 💰\n\nHạ Miên có giá từ 200k - 2 triệu, nhưng giá trị tình cảm thì vô giá! 💕");
      responses.push("Tôi có thể giúp bạn chọn hoa phù hợp với ngân sách! Bạn muốn xem bộ sưu tập nào cụ thể không? 😄");
    } else if (lowerMessage.includes('giao hàng') || lowerMessage.includes('ship')) {
      responses.push("Giao hàng? Tôi làm như Flash! ⚡\n\nNội thành: 2-4h (nhanh hơn cả pizza!)\nNgoại thành: 1-2 ngày (nhưng hoa vẫn tươi như mới!)");
      responses.push("Bạn có muốn đặt giao ngay không? Tôi sẽ đảm bảo hoa đến tay bạn còn thơm ngát! 🌸");
    } else if (lowerMessage.includes('bạn có thể') || lowerMessage.includes('bạn làm gì')) {
      responses.push("Ồ! Tôi có thể làm rất nhiều thứ thú vị! 🎉\n\n🌸 Kể chuyện về hoa (tôi biết rất nhiều bí mật!)\n💐 Giúp bạn chọn hoa phù hợp (tôi có \"mắt\" rất tinh!)\n🎨 Thiết kế bó hoa độc đáo (tôi là nghệ sĩ!)\n📦 Giao hàng siêu tốc (như Flash! ⚡)\n🎭 Kể chuyện cười về hoa (tôi rất hài hước!)\n\nBạn muốn thử cái nào trước? 😄");
    } else if (lowerMessage.includes('dịch vụ') || lowerMessage.includes('service')) {
      responses.push("Wow! Hạ Miên có những dịch vụ SIÊU COOL! 🚀\n\n🌸 Hoa tươi từ khắp nơi (tôi chọn lọc kỹ!)\n💐 Bó hoa theo mẫu (đẹp như tranh!)\n🎨 Thiết kế riêng (độc nhất vô nhị!)\n📦 Giao hàng nhanh (nhanh hơn tia chớp!)\n🏢 Trang trí sự kiện (hoành tráng!)\n🎂 Hoa sinh nhật (làm tiệc thêm vui!)\n💒 Hoa cưới (lãng mạn như phim!)\n\nBạn muốn dịch vụ nào? Tôi sẽ làm cho bạn! 😄");
    } else if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('hoa')) {
      responses.push("OMG! Hạ Miên có những sản phẩm hoa TUYỆT VỜI! 🌟\n\n🌹 Hoa hồng (đỏ như trái tim!)\n🌻 Hoa hướng dương (vui tươi như nắng mai!)\n🌺 Hoa lan (quý phái như nữ hoàng!)\n🌸 Hoa cúc (dịu dàng như mẹ hiền!)\n🌷 Hoa tulip (thanh lịch như thiếu nữ!)\n💐 Bó hoa mix (đa dạng như cuộc sống!)\n🎁 Hộp hoa (bí ẩn như kho báu!)\n\nTôi có thể kể chi tiết về từng loại! Bạn thích loại nào? 😍");
    } else if (lowerMessage.includes('đặt hoa') || lowerMessage.includes('order')) {
      responses.push("WOW! Bạn muốn đặt hoa! 🎉\n\nTôi sẽ giúp bạn tạo ra một tác phẩm nghệ thuật! Bạn có thể:\n• Chọn từ bộ sưu tập có sẵn (đã được tôi chọn lọc!)\n• Thiết kế theo yêu cầu (tôi sẽ làm cho bạn!)\n• Giao hàng nhanh (nhanh hơn tốc độ ánh sáng!)\n\nHãy cho tôi biết bạn muốn đặt hoa cho dịp gì? Tôi sẽ tạo ra điều bất ngờ! 😍");
    } else if (lowerMessage.includes('tư vấn') || lowerMessage.includes('advice')) {
      responses.push("Tuyệt vời! Tôi là chuyên gia tư vấn hoa! 🌸👨‍🎓\n\nTôi có thể tư vấn về:\n• Chọn hoa phù hợp (tôi có \"mắt\" rất tinh!)\n• Màu sắc hài hòa (như nhà thiết kế!)\n• Cách bảo quản (để hoa tươi lâu!)\n• Ý nghĩa từng loại hoa (tôi biết nhiều bí mật!)\n• Cách trang trí (để không gian đẹp!)\n\nBạn cần tư vấn về gì? Tôi sẽ chia sẻ tất cả bí quyết! 😊");
    } else if (lowerMessage.includes('chán') || lowerMessage.includes('boring')) {
      responses.push("Chán? Không thể nào! 😄\n\nTôi sẽ làm cho bạn vui ngay! Hãy để tôi kể một câu chuyện vui về hoa:\n\n\"Có một bông hoa hướng dương luôn nói: 'Tôi không bao giờ buồn vì tôi luôn hướng về mặt trời!'\" 🌻☀️\n\nBạn muốn nghe thêm chuyện vui không? Tôi có rất nhiều! 😊");
    } else if (lowerMessage.includes('vui') || lowerMessage.includes('fun')) {
      responses.push("YAY! Bạn muốn vui! 🎉\n\nTôi sẽ làm cho bạn cười! Đây là một câu chuyện vui:\n\n\"Tại sao hoa hồng đỏ lại đỏ? Vì nó xấu hổ khi thấy bạn đẹp quá!\" 🌹😊\n\nBạn có muốn nghe thêm chuyện vui không? Tôi có cả kho chuyện cười! 😄");
    } else {
      // Default contextual response with FUN twist
      const defaultResponse = this.getDefaultContextualResponse(stage);
      if (defaultResponse) {
        responses.push(defaultResponse);
      } else {
        // Ultimate fallback with FUN response - sometimes add random fun
        if (Math.random() < 0.3) { // 30% chance for random fun response
          responses.push(this.getRandomFunResponse());
        } else {
          responses.push("Xin chào! Tôi là chatbot của Hạ Miên! 🌸✨\n\nTôi có thể giúp bạn:\n• Tư vấn về hoa tươi (tôi biết rất nhiều!)\n• Đặt hoa theo mẫu (đẹp như tranh!)\n• Thiết kế theo yêu cầu (tôi là nghệ sĩ!)\n• Hỏi về đơn hàng (tôi nhớ tất cả!)\n• Kể chuyện vui về hoa (tôi rất hài hước!)\n\nBạn muốn làm gì? Tôi sẽ làm cho bạn vui! 😄");
        }
      }
    }
    
    return responses;
  }

  // Get contextual suggestions based on conversation
  getContextualSuggestions() {
    const stage = this.conversationContext.conversationStage;
    const currentIntent = this.conversationContext.currentIntent;
    
    // Get suggestions from Dialogflow if available
    if (this.dialogflowLoader && currentIntent) {
      const dialogflowSuggestions = this.dialogflowLoader.getConversationSuggestions(currentIntent);
      if (dialogflowSuggestions && dialogflowSuggestions.length > 0) {
        return dialogflowSuggestions;
      }
    }

    // Default suggestions based on stage (FUN VERSION!)
    const stageSuggestions = {
      'greeting': ['Tôi muốn đặt hoa! 🌸', 'Bạn có dịch vụ gì? 🤔', 'Kể chuyện vui về hoa! 😄', 'Giá cả như thế nào? 💰'],
      'browsing': ['Đặt hoa theo mẫu! 💐', 'Thiết kế riêng! 🎨', 'Xem giá! 💰', 'Tư vấn! 👨‍🎓'],
      'ordering': ['Thêm hoa khác! 🌸', 'Xác nhận đơn hàng! ✅', 'Hỏi về giao hàng! 🚚', 'Thanh toán! 💳'],
      'support': ['Hỏi về đơn hàng! 📦', 'Khiếu nại! 😤', 'Tư vấn thêm! 💡', 'Liên hệ hotline! 📞']
    };

    return stageSuggestions[stage] || ['Tư vấn', 'Đặt hoa', 'Xem sản phẩm', 'Liên hệ'];
  }

  // Add random fun responses
  getRandomFunResponse() {
    const funResponses = [
      "Bạn biết không? Hoa hướng dương luôn hướng về mặt trời! Giống như tôi luôn hướng về bạn vậy! 🌻☀️",
      "Tôi vừa học được một điều mới: Hoa hồng đỏ có thể sống đến 100 năm! Nhưng tình bạn của chúng ta sẽ mãi mãi! 🌹💕",
      "Bạn có biết tại sao hoa cúc lại có nhiều cánh không? Vì chúng muốn ôm lấy tất cả tình yêu của bạn! 🌸💕",
      "Tôi đang nghĩ về một câu chuyện vui: Có một bông hoa tulip nói với hoa hồng 'Bạn đỏ quá!' và hoa hồng trả lời 'Tôi xấu hổ vì bạn đẹp quá!' 🌷🌹",
      "Bạn biết không? Hoa lan được gọi là 'nữ hoàng của các loài hoa'! Nhưng bạn là nữ hoàng của trái tim tôi! 🌺👑",
      "Tôi vừa tạo ra một bó hoa mix mới! Nó có hoa hồng đỏ (tình yêu), hoa cúc vàng (hạnh phúc), và hoa lan tím (quý phái)! Bạn có muốn xem không? 💐✨",
      "Bạn có biết tại sao tôi thích hoa không? Vì chúng luôn làm cho mọi người mỉm cười! Giống như bạn đang làm với tôi vậy! 😊🌸",
      "Tôi đang học cách làm hoa giấy! Nhưng hoa thật vẫn đẹp hơn nhiều! Bạn có muốn tôi kể về cách chọn hoa tươi không? 🌸📚"
    ];
    
    return funResponses[Math.floor(Math.random() * funResponses.length)];
  }

  // Get default response based on conversation stage
  getDefaultContextualResponse(stage) {
    const customerInfo = this.conversationContext.customerInfo;
    const name = customerInfo.name;
    
    const stageResponses = {
      'greeting': name ? `Xin chào ${name}! Hạ Miên có thể giúp gì cho bạn ạ? 🌸` : "Xin chào! Hạ Miên có thể giúp gì cho bạn ạ? 🌸",
      'browsing': name ? `${name} muốn tìm hiểu về loại hoa nào ạ? Hạ Miên có thể tư vấn cho bạn! 💐` : "Bạn muốn tìm hiểu về loại hoa nào ạ? Hạ Miên có thể tư vấn cho bạn! 💐",
      'ordering': name ? `${name} muốn đặt hoa theo mẫu có sẵn hay thiết kế riêng ạ? 🎨` : "Bạn muốn đặt hoa theo mẫu có sẵn hay thiết kế riêng ạ? 🎨",
      'support': name ? `Hạ Miên sẵn sàng hỗ trợ ${name}! Bạn cần giúp gì ạ? 🤝` : "Hạ Miên sẵn sàng hỗ trợ bạn! Bạn cần giúp gì ạ? 🤝"
    };
    
    return stageResponses[stage] || (name ? `Hạ Miên có thể giúp gì cho ${name} ạ? 😊` : "Hạ Miên có thể giúp gì cho bạn ạ? 😊");
  }

  // Show contextual suggestions
  showContextualSuggestions() {
    const stage = this.conversationContext.conversationStage;
    const currentIntent = this.conversationContext.currentIntent;
    
    let suggestions = [];
    
    if (currentIntent && window.CHATBOT_CONFIG && window.CHATBOT_CONFIG.intentSuggestions) {
      suggestions = window.CHATBOT_CONFIG.intentSuggestions[currentIntent.name] || [];
    }
    
    if (suggestions.length === 0) {
      // Default suggestions based on stage
      const stageSuggestions = {
        'greeting': ['Đặt hoa theo mẫu', 'Tư vấn', 'Thiết kế theo yêu cầu'],
        'browsing': ['Xem bộ sưu tập', 'Tư vấn loại hoa', 'Hỏi về ý nghĩa'],
        'ordering': ['Đặt hoa giao ngay', 'Thiết kế riêng', 'Hỏi về giá'],
        'support': ['Hỏi về đơn hàng', 'CSKH sau mua', 'Liên hệ hotline']
      };
      suggestions = stageSuggestions[stage] || window.CHATBOT_CONFIG?.chatbot?.suggestions || [];
    }
    
    // Add personalized suggestions based on conversation history
    suggestions = this.addPersonalizedSuggestions(suggestions);
    
    this.addSuggestions(suggestions);
  }

  // Add personalized suggestions based on conversation history
  addPersonalizedSuggestions(baseSuggestions) {
    const history = this.conversationContext.conversationFlow;
    const mentionedEntities = Array.from(this.conversationContext.mentionedEntities);
    
    let personalizedSuggestions = [...baseSuggestions];
    
    // If user mentioned specific flowers, suggest related services
    if (mentionedEntities.some(entity => entity.includes('hoa'))) {
      personalizedSuggestions = ['Thiết kế theo yêu cầu', 'Đặt hoa giao ngay', ...personalizedSuggestions.slice(0, 2)];
    }
    
    // If user is in ordering stage, prioritize ordering-related suggestions
    if (this.conversationContext.conversationStage === 'ordering') {
      personalizedSuggestions = ['Đặt hoa giao ngay', 'Hỏi về giá', 'Thiết kế riêng', ...personalizedSuggestions.slice(0, 1)];
    }
    
    // If user mentioned urgency, suggest fast delivery
    const recentMessages = history.slice(-3).map(h => h.message).join(' ').toLowerCase();
    if (recentMessages.includes('gấp') || recentMessages.includes('nhanh') || recentMessages.includes('urgent')) {
      personalizedSuggestions = ['Đặt hoa giao ngay', 'Liên hệ hotline', ...personalizedSuggestions.slice(0, 2)];
    }
    
    return personalizedSuggestions.slice(0, 4); // Limit to 4 suggestions
  }

  // Learn from conversation patterns
  learnFromConversation() {
    const history = this.conversationContext.conversationFlow;
    if (history.length < 3) return; // Need at least 3 interactions to learn
    
    // Analyze conversation patterns
    const patterns = this.analyzeConversationPatterns(history);
    
    // Update user preferences based on patterns
    this.updateUserPreferences(patterns);
    
    // Store learning data
    this.saveLearningData();
  }

  // Analyze conversation patterns
  analyzeConversationPatterns(history) {
    const patterns = {
      preferredStage: {},
      commonTopics: {},
      responseTime: [],
      interactionCount: history.length
    };
    
    // Analyze stage preferences
    history.forEach(interaction => {
      const stage = interaction.stage;
      patterns.preferredStage[stage] = (patterns.preferredStage[stage] || 0) + 1;
    });
    
    // Analyze common topics
    history.forEach(interaction => {
      const message = interaction.message.toLowerCase();
      if (message.includes('hoa hồng')) patterns.commonTopics['hoa hồng'] = (patterns.commonTopics['hoa hồng'] || 0) + 1;
      if (message.includes('hoa cưới')) patterns.commonTopics['hoa cưới'] = (patterns.commonTopics['hoa cưới'] || 0) + 1;
      if (message.includes('hoa sinh nhật')) patterns.commonTopics['hoa sinh nhật'] = (patterns.commonTopics['hoa sinh nhật'] || 0) + 1;
      if (message.includes('giá')) patterns.commonTopics['giá'] = (patterns.commonTopics['giá'] || 0) + 1;
      if (message.includes('giao hàng')) patterns.commonTopics['giao hàng'] = (patterns.commonTopics['giao hàng'] || 0) + 1;
    });
    
    return patterns;
  }

  // Update user preferences based on patterns
  updateUserPreferences(patterns) {
    // Update conversation stage preference
    const mostPreferredStage = Object.keys(patterns.preferredStage).reduce((a, b) => 
      patterns.preferredStage[a] > patterns.preferredStage[b] ? a : b
    );
    
    this.conversationContext.userPreferences.preferredStage = mostPreferredStage;
    
    // Update topic preferences
    this.conversationContext.userPreferences.commonTopics = patterns.commonTopics;
    
    // Update interaction style
    this.conversationContext.userPreferences.interactionCount = patterns.interactionCount;
  }

  // Save learning data to localStorage
  saveLearningData() {
    try {
      const learningData = {
        userPreferences: this.conversationContext.userPreferences,
        conversationPatterns: this.analyzeConversationPatterns(this.conversationContext.conversationFlow),
        lastUpdated: Date.now()
      };
      localStorage.setItem('hamien_chatbot_learning', JSON.stringify(learningData));
    } catch (error) {
      console.warn('Could not save learning data:', error);
    }
  }

  // Load learning data from localStorage
  loadLearningData() {
    try {
      const learningData = localStorage.getItem('hamien_chatbot_learning');
      if (learningData) {
        const data = JSON.parse(learningData);
        this.conversationContext.userPreferences = data.userPreferences || {};
        
        // Apply learned preferences
        if (data.userPreferences?.preferredStage) {
          this.conversationContext.conversationStage = data.userPreferences.preferredStage;
        }
      }
    } catch (error) {
      console.warn('Could not load learning data:', error);
    }
  }

  async processMessage(message) {
    console.log('🔍 Processing message:', message);
    const typingDiv = this.showTypingIndicator();
    const startTime = performance.now();
    
    // Update conversation context
    this.updateConversationContext(message);

    try {
      // First try AI API if available
      if (this.apiKey) {
        const aiResponse = await this.getAIResponse(message);
        this.hideTypingIndicator(typingDiv);
        this.addBotMessage(aiResponse);
        
        // Learn from this interaction
        this.learnFromConversation();
        return;
      }
    } catch (error) {
      console.log("AI API not available, using fallback responses");
    }

    // Optimized response time - reduced delay for faster interaction
    const responseDelay = Math.min(300 + Math.random() * 200, 500); // Max 500ms delay
    
    setTimeout(() => {
      this.hideTypingIndicator(typingDiv);
      const responses = this.getSmartResponses(message);
      console.log('📝 Generated responses:', responses);
      
      if (responses && responses.length > 0) {
        responses.forEach(r => this.addBotMessage(r));
      } else {
        console.warn('⚠️ No responses generated, using fallback');
        this.addBotMessage("Xin chào! Tôi là chatbot của Hạ Miên 🌸 Bạn cần hỗ trợ gì ạ?");
      }
      
      // Show context-aware suggestions
      this.showContextualSuggestions();
      
      // Learn from this interaction
      this.learnFromConversation();
      
      // Log performance
      const responseTime = performance.now() - startTime;
      console.log(`⚡ Response time: ${responseTime.toFixed(0)}ms`);
    }, responseDelay);
  }

  async getAIResponse(message) {
    if (!this.apiKey) {
      throw new Error("API key not configured");
    }

    const systemPrompt = `Bạn là chatbot của cửa hàng hoa tươi Hạ Miên. 
    Hãy trả lời một cách thân thiện, nhiệt tình và chuyên nghiệp về các dịch vụ hoa tươi.
    Thông tin về cửa hàng:
    - Tên: Hạ Miên
    - Địa chỉ: 422 Vĩnh Hưng
    - Hotline: 0987654321
    - Dịch vụ: Hoa tươi, gói quà, giao hàng nhanh, tổ chức sự kiện
    - Phong cách: Thân thiện, chuyên nghiệp, nhiệt tình
    Hãy trả lời ngắn gọn, súc tích và hướng dẫn khách hàng cụ thể.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...this.chatHistory.slice(-10).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.message
      })),
      { role: "user", content: message }
    ];

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  renderCustomSuggestions(list) {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody || !Array.isArray(list) || !list.length) return;
    const suggestionsDiv = document.createElement("div");
    suggestionsDiv.className = "chat-suggestions";
    list.forEach(label => {
      const btn = document.createElement("button");
      btn.className = "suggest-btn";
      btn.textContent = label;
      suggestionsDiv.appendChild(btn);
    });
    chatBody.appendChild(suggestionsDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  getRuleBasedResponses(message) {
    const lower = this.dialogflow.norm(message || '');
    const cfg = window.CHATBOT_CONFIG || {};
    const intents = (cfg && cfg.intents) || {};
    const flows = (cfg && cfg.flows) || {};

    // 1) Try Dialogflow intents first if loaded
    if (this.dialogflow.loaded) {
      const matched = this.matchDialogflow(lower);
      if (matched && matched.responses && matched.responses.length) {
        // attach suggestions if configured
        const cfg = window.CHATBOT_CONFIG || {};
        const intentSugs = (cfg.intentSuggestions || {})[matched.name] || [];
        this.pendingSuggestions = intentSugs.length ? intentSugs : this.pendingSuggestions;
        return matched.responses;
      }
    }

    const matchIntent = () => {
      for (const key in intents) {
        const keywords = (intents[key] || []).map(this.dialogflow.norm);
        if (keywords.some(k => lower.includes(k))) return key;
      }
      return null;
    };

    const intent = matchIntent();
    let texts = [];

    if (intent && flows[intent]) {
      texts = flows[intent].text || [];
      this.pendingSuggestions = flows[intent].next || [];
    } else {
      texts = (flows.fallback && flows.fallback.text) || [
        'Cảm ơn bạn đã liên hệ với Hạ Miên! 🌸 Bạn muốn Miên hỗ trợ phần nào ạ?'
      ];
      this.pendingSuggestions = (flows.fallback && flows.fallback.next) || [];
    }

    return texts;
  }

  async loadDialogflowData() {
    try {
      const cfg = (window.CHATBOT_CONFIG || {});
      const manifest = Array.isArray(cfg.dialogflowManifest) ? cfg.dialogflowManifest : [];
      if (!Array.isArray(manifest) || manifest.length === 0) return;

      const loadOne = async (baseName) => {
        try {
          const intentRes = await fetch(`intents/${baseName}.json`);
          if (!intentRes.ok) return null;
          const intentJson = await intentRes.json();

          let phrases = [];
          const saysPath = `intents/${baseName}_usersays_vi.json`;
          try {
            const saysRes = await fetch(saysPath);
            if (saysRes.ok) {
              const says = await saysRes.json();
              phrases = (says || []).map(item => {
                const text = (item?.data || []).map(d => (d.text || '')).join('');
                return text;
              }).filter(t => !!t && t.trim().length > 1);
            }
          } catch (_) {}

          const responses = [];
          const respBlocks = intentJson?.responses || [];
          respBlocks.forEach(block => {
            (block?.messages || []).forEach(msg => {
              if (Array.isArray(msg.speech)) {
                msg.speech.forEach(s => s && responses.push(s));
              } else if (typeof msg.speech === 'string') {
                responses.push(msg.speech);
              }
            });
          });

          // Collect entity hints from parameters
          const entityHints = new Set();
          respBlocks.forEach(block => {
            (block?.parameters || []).forEach(p => {
              const dt = (p?.dataType || '').toString();
              if (dt.startsWith('@') && !dt.startsWith('@sys.')) {
                entityHints.add(dt.slice(1));
              }
            });
          });
          // Also parse usersays meta to find entities used in examples
          try {
            const saysRes = await fetch(saysPath);
            if (saysRes.ok) {
              const says = await saysRes.json();
              (says || []).forEach(item => {
                (item?.data || []).forEach(d => {
                  const meta = (d?.meta || '').toString();
                  if (meta.startsWith('@') && !meta.startsWith('@sys.')) {
                    entityHints.add(meta.slice(1));
                  }
                });
              });
            }
          } catch(_) {}

          return { name: baseName, phrases, responses, entityHints: Array.from(entityHints) };
        } catch (_) { return null; }
      };

      const loaded = await Promise.all(manifest.map(loadOne));
      loaded.filter(Boolean).forEach(item => {
        this.dialogflow.intents[item.name] = item;
      });
      this.dialogflow.loaded = Object.keys(this.dialogflow.intents).length > 0;

      // Load entities: union of config list + entities referenced by intents
      const entSet = new Set();
      const entManifestCfg = Array.isArray(cfg.entitiesManifest) ? cfg.entitiesManifest : [];
      entManifestCfg.forEach(n => entSet.add(n));
      loaded.filter(Boolean).forEach(it => {
        (it.entityHints || []).forEach(n => entSet.add(n));
      });

      const loadEntity = async (baseName) => {
        try {
          const entRes = await fetch(`entities/${baseName}.json`);
          if (!entRes.ok) return null;
          const entJson = await entRes.json();
          const values = [];
          const entriesPath = `entities/${baseName}_entries_vi.json`;
          try {
            const entriesRes = await fetch(entriesPath);
            if (entriesRes.ok) {
              const entries = await entriesRes.json();
              entries.forEach(e => {
                const v = (e?.value || '').toString();
                const syns = Array.isArray(e?.synonyms) ? e.synonyms : [];
                const pushSyn = (s) => {
                  const parts = (s || '').split(/[;,]/).map(p => p.trim()).filter(p => p.length > 1);
                  parts.forEach(p => values.push(this.dialogflow.norm(p)));
                };
                pushSyn(v);
                syns.forEach(s => pushSyn(s));
              });
            }
          } catch(_) {}
          return { name: baseName, values: Array.from(new Set(values)).filter(Boolean) };
        } catch(_) { return null; }
      };
      const ents = await Promise.all(Array.from(entSet).map(loadEntity));
      ents.filter(Boolean).forEach(e => { this.dialogflow.entities[e.name] = e.values; });
    } catch (e) {
      this.dialogflow.loaded = false;
    }
  }

  matchDialogflow(lowerMessage) {
    // Enhanced matching with priority scoring and context awareness
    const intents = this.dialogflow.intents || {};
    const ent = this.dialogflow.entities || {};
    const context = this.conversationContext;
    
    // Priority 1: Exact phrase matches with context boost
    let bestMatch = { intent: null, score: 0 };
    
    for (const key in intents) {
      const it = intents[key];
      if (!it) continue;
      
      let score = 0;
      const phraseHit = (it.phrases || []).some(p => {
        const np = this.dialogflow.norm(p);
        if (np && (lowerMessage.includes(np) || np.includes(lowerMessage))) {
          score = np.length; // Longer matches get higher score
          return true;
        }
        return false;
      });
      
      if (phraseHit) {
        // Context boost: if current stage matches intent type
        if (this.isIntentMatchingStage(key, context.conversationStage)) {
          score *= 1.5;
        }
        
        // Recent context boost
        if (context.lastIntent && this.areIntentsRelated(key, context.lastIntent.name)) {
          score *= 1.2;
        }
        
        if (score > bestMatch.score) {
          bestMatch = { intent: it, score: score };
        }
      }
    }
    
    if (bestMatch.intent) return bestMatch.intent;
    
    // Priority 2: Entity-based matching with context awareness
    const entityIntentMap = [
      { ents: ['exinchao'], intent: 'ixinchao', stage: 'greeting' },
      { ents: ['edonhang'], intent: 'idonhang', stage: 'support' },
      { ents: ['edathoa','edathoaxemmau','edathoaxemmmautuvan'], intent: 'idathoa', stage: 'ordering' },
      { ents: ['edathoachotdon'], intent: 'idathoachotdon', stage: 'ordering' },
      { ents: ['edathoaconhucau'], intent: 'idathoaconhucau', stage: 'browsing' },
      { ents: ['edathoaconhucaukhacdathoa'], intent: 'idathoaconhucaukhacdathoa', stage: 'browsing' },
      { ents: ['edathoadichvudikem'], intent: 'idathoadichvudikem', stage: 'ordering' },
      { ents: ['edathoadichvudikemphanhoi'], intent: 'idathoadichvudikemphanhoi', stage: 'ordering' },
      { ents: ['edathoagap'], intent: 'idathoagap', stage: 'ordering' },
      { ents: ['edathoagiaohang'], intent: 'idathoagiaohang', stage: 'ordering' },
      { ents: ['edathoatgiandiadiemgiaohang'], intent: 'idathoatgiandiadiemgiaohang', stage: 'ordering' },
      { ents: ['edathoathamkhao'], intent: 'idathoathamkhaothaydoitheonhucau', stage: 'browsing' },
      { ents: ['ephiship'], intent: 'iphiship', stage: 'ordering' },
      { ents: ['edealhotheothang','edealhottheothang'], intent: 'idealhotthang10', stage: 'browsing' },
      { ents: ['etuvan'], intent: 'ituvan', stage: 'browsing' },
      { ents: ['ecamon'], intent: 'icamon', stage: 'greeting' },
      { ents: ['echamsockhachhang','echamsockhachhangphanhoi'], intent: 'ichamsockhachhangphanhoitot', stage: 'support' },
      { ents: ['echuyenkhoan'], intent: 'ichuyenkhoan', stage: 'support' },
      { ents: ['edichvukhac','edichvukhacdecortochucsukien'], intent: 'idichvukhacdecortochucsukien', stage: 'browsing' }
    ];
    
    for (const m of entityIntentMap) {
      const hit = m.ents.some(name => (ent[name]||[]).some(val => lowerMessage.includes(val)));
      if (hit && intents[m.intent]) {
        // Context boost for stage matching
        if (m.stage === context.conversationStage) {
          return intents[m.intent];
        }
      }
    }
    
    // Priority 3: Smart keyword matching with context
    const keywordMap = [
      { keywords: ['đơn hàng', 'don hang', 'mã đơn', 'ma don'], intent: 'idonhang', stage: 'support' },
      { keywords: ['đặt hoa', 'dat hoa', 'mua hoa'], intent: 'idathoa', stage: 'ordering' },
      { keywords: ['giao ngay', 'giao hang', 'ship'], intent: 'idathoagiaohang', stage: 'ordering' },
      { keywords: ['gấp', 'gap', 'nhanh'], intent: 'idathoagap', stage: 'ordering' },
      { keywords: ['deal', 'ưu đãi', 'uu dai', 'khuyến mãi'], intent: 'idealhotthang10', stage: 'browsing' },
      { keywords: ['tư vấn', 'tuvan', 'gợi ý'], intent: 'ituvan', stage: 'browsing' },
      { keywords: ['cskh', 'sau mua', 'bảo quản'], intent: 'ichamsockhachhangphanhoitot', stage: 'support' },
      { keywords: ['sự kiện', 'su kien', 'workshop'], intent: 'idichvukhacdecortochucsukien', stage: 'browsing' }
    ];
    
    for (const m of keywordMap) {
      const hit = m.keywords.some(kw => lowerMessage.includes(kw));
      if (hit && intents[m.intent]) {
        // Context boost for stage matching
        if (m.stage === context.conversationStage) {
          return intents[m.intent];
        }
      }
    }
    
    return null;
  }

  // Check if intent matches current conversation stage
  isIntentMatchingStage(intentName, stage) {
    const stageIntentMap = {
      'greeting': ['ixinchao', 'icamon'],
      'browsing': ['ituvan', 'idathoaconhucau', 'idealhotthang10', 'idichvukhacdecortochucsukien'],
      'ordering': ['idathoa', 'idathoachotdon', 'idathoagap', 'idathoagiaohang', 'idathoadichvudikem'],
      'support': ['idonhang', 'ichamsockhachhangphanhoitot', 'ichuyenkhoan']
    };
    
    return stageIntentMap[stage]?.includes(intentName) || false;
  }

  // Check if two intents are related
  areIntentsRelated(intent1, intent2) {
    const relatedGroups = [
      ['idathoa', 'idathoachotdon', 'idathoagap', 'idathoagiaohang'],
      ['ituvan', 'idathoaconhucau', 'idathoaconhucaukhacdathoa'],
      ['idonhang', 'ichamsockhachhangphanhoitot', 'ichuyenkhoan'],
      ['idealhotthang10', 'idealhotthang11']
    ];
    
    return relatedGroups.some(group => 
      group.includes(intent1) && group.includes(intent2)
    );
  }

  saveChatHistory() {
    try {
      localStorage.setItem('hamien_chat_history', JSON.stringify(this.chatHistory));
    } catch (error) {
      console.log("Could not save chat history:", error);
    }
  }

  loadChatHistory() {
    try {
      const saved = localStorage.getItem('hamien_chat_history');
      if (saved) {
        this.chatHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.log("Could not load chat history:", error);
      this.chatHistory = [];
    }
  }

  // Method to configure AI API
  configureAI(apiKey, endpoint = null) {
    this.apiKey = apiKey;
    if (endpoint) {
      this.apiEndpoint = endpoint;
    }
  }

  // Method to clear chat history
  clearHistory() {
    this.chatHistory = [];
    localStorage.removeItem('hamien_chat_history');
    this.showWelcomeMessage();
  }

  // Initialize Dialogflow Loader (optimized for speed)
  async initializeDialogflowLoader() {
    try {
      if (window.DialogflowLoader) {
        this.dialogflowLoader = new window.DialogflowLoader();
        
        // Load data in background without blocking UI
        this.dialogflowLoader.loadAllData().then(data => {
          if (data && data.loaded) {
            console.log('✅ Dialogflow data loaded successfully!');
            this.dialogflow.loaded = true;
            this.dialogflow.intents = data.intents;
            this.dialogflow.entities = data.entities;
            
            // Show notification to user
            this.showNotification('🤖 AI đã sẵn sàng phục vụ bạn!');
          } else {
            console.warn('⚠️ Dialogflow data loading failed');
          }
        }).catch(error => {
          console.error('❌ Error loading Dialogflow data:', error);
        });
        
        // Don't wait for loading to complete - continue with basic functionality
        console.log('🔄 Dialogflow data loading in background...');
      } else {
        console.warn('⚠️ DialogflowLoader not available');
      }
    } catch (error) {
      console.error('❌ Error initializing Dialogflow Loader:', error);
    }
  }

  // Show notification to user
  showNotification(message) {
    // Create a subtle notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #5a7c46, #4a6b3a);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 4px 15px rgba(90, 124, 70, 0.3);
      animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Enhance Dialogflow response with context
  enhanceDialogflowResponse(baseResponse, intent, message) {
    const stage = this.conversationContext.conversationStage;
    const emotionalTone = this.conversationContext.emotionalTone;
    
    // Add emotional tone adjustments
    let enhancedResponse = this.adjustResponseForEmotionalTone(baseResponse, emotionalTone);
    
    // Add context-aware enhancements based on intent
    if (intent.name.includes('dathoa')) {
      enhancedResponse = this.enhanceOrderingResponse(enhancedResponse, message);
    } else if (intent.name.includes('donhang') || intent.name.includes('tracuu')) {
      enhancedResponse = this.enhanceSupportResponse(enhancedResponse, message);
    } else if (intent.name.includes('tuvan')) {
      enhancedResponse = this.enhanceConsultationResponse(enhancedResponse, message);
    }
    
    return enhancedResponse;
  }

  // Enhance consultation responses
  enhanceConsultationResponse(baseResponse, message) {
    const lowerMessage = this.dialogflow.norm(message);
    
    if (lowerMessage.includes('màu') || lowerMessage.includes('mau')) {
      return baseResponse + " Hạ Miên có thể tư vấn về màu sắc phù hợp với từng dịp ạ! 🌈";
    } else if (lowerMessage.includes('ý nghĩa') || lowerMessage.includes('y nghia')) {
      return baseResponse + " Mỗi loài hoa đều có ý nghĩa riêng, Hạ Miên sẽ giải thích chi tiết ạ! 💐";
    } else if (lowerMessage.includes('chăm sóc') || lowerMessage.includes('cham soc')) {
      return baseResponse + " Hạ Miên sẽ hướng dẫn cách bảo quản hoa để tươi lâu ạ! 🌸";
    }
    
    return baseResponse;
  }

  // Get conversation suggestions from Dialogflow
  getDialogflowSuggestions(intent) {
    if (this.dialogflowLoader && this.dialogflowLoader.loaded) {
      return this.dialogflowLoader.getConversationSuggestions(intent);
    }
    
    // Fallback to config suggestions
    const config = window.CHATBOT_CONFIG || {};
    return config.intentSuggestions?.[intent.name] || ['Tư vấn', 'Đặt hoa theo mẫu', 'Thiết kế theo yêu cầu'];
  }

  // Extract entities from user input using Dialogflow
  extractDialogflowEntities(message) {
    if (this.dialogflowLoader && this.dialogflowLoader.loaded) {
      return this.dialogflowLoader.extractEntities(message);
    }
    return {};
  }

  // Show contextual suggestions with Dialogflow integration
  showContextualSuggestions() {
    const stage = this.conversationContext.conversationStage;
    const currentIntent = this.conversationContext.currentIntent;
    
    let suggestions = [];
    
    // Get suggestions from Dialogflow if available
    if (currentIntent && this.dialogflowLoader && this.dialogflowLoader.loaded) {
      suggestions = this.getDialogflowSuggestions(currentIntent);
    } else if (currentIntent && window.CHATBOT_CONFIG && window.CHATBOT_CONFIG.intentSuggestions) {
      suggestions = window.CHATBOT_CONFIG.intentSuggestions[currentIntent.name] || [];
    }
    
    if (suggestions.length === 0) {
      // Default suggestions based on stage
      const stageSuggestions = {
        'greeting': ['Đặt hoa theo mẫu', 'Tư vấn', 'Thiết kế theo yêu cầu'],
        'browsing': ['Xem bộ sưu tập', 'Tư vấn loại hoa', 'Hỏi về ý nghĩa'],
        'ordering': ['Đặt hoa giao ngay', 'Thiết kế riêng', 'Hỏi về giá'],
        'support': ['Hỏi về đơn hàng', 'CSKH sau mua', 'Liên hệ hotline']
      };
      suggestions = stageSuggestions[stage] || window.CHATBOT_CONFIG?.chatbot?.suggestions || [];
    }
    
    // Add personalized suggestions based on conversation history
    suggestions = this.addPersonalizedSuggestions(suggestions);
    
    this.addSuggestions(suggestions);
  }
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HaMienChatbot;
}


