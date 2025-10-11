/**
 * HaMienChatbot - Chatbot chỉ dựa trên dữ liệu Intents và Entities
 * Version: 2.0 - Pure Intent/Entity Based
 */

class HaMienChatbot {
  constructor() {
    this.intents = {};
    this.entities = {};
    this.loaded = false;
    this.conversationContext = {
      currentIntent: null,
      currentEntities: {},
      conversationHistory: []
    };
    
    this.init();
  }

  async init() {
    console.log('🤖 Initializing HaMienChatbot...');
    
    // Load intents and entities data
    await this.loadIntentsAndEntities();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Show welcome message
    this.showWelcomeMessage();
    
    console.log('✅ HaMienChatbot initialized successfully');
  }

  async loadIntentsAndEntities() {
    try {
      console.log('📚 Loading intents and entities...');
      
      // Load all intents
      await this.loadIntents();
      
      // Load all entities
      await this.loadEntities();
      
      this.loaded = true;
      console.log('✅ Intents and entities loaded successfully');
      console.log(`📊 Loaded ${Object.keys(this.intents).length} intents and ${Object.keys(this.entities).length} entities`);
      
      // Debug: Check if TTworkshop intent is loaded
      if (this.intents['ituvan - dichvu - TTworkshop']) {
        console.log('✅ TTworkshop intent loaded successfully');
        console.log('📝 TTworkshop response:', this.intents['ituvan - dichvu - TTworkshop'].responses?.[0]?.messages?.[0]?.speech?.[0]);
      } else {
        console.log('❌ TTworkshop intent NOT loaded');
      }
      
    } catch (error) {
      console.error('❌ Error loading intents and entities:', error);
    }
  }

  async loadIntents() {
    const intentFiles = [
      'ichaohoi', 'idathoa', 'ituvan', 'ituvan - sanpham', 'ituvan - dichvu',
      'ithongtinshop', 'iphiship', 'iPTTT', 'idealhot', 'ihuydon',
      'iketthuc', 'iphanhoitot', 'iphanhoixau', 'ithuthiep', 'itracuudonhang',
      'ituvan - dichvu - decorsukien', 'ituvan - dichvu - TGworkshop',
      'ituvan - dichvu - thietketheoyeucau', 'ituvan - dichvu - TTworkshop',
      'ituvan - sanpham - xemmau', 'Default Welcome Intent', 'Default Fallback Intent'
    ];

    for (const intentName of intentFiles) {
      try {
        const response = await fetch(`intents/${intentName}.json`);
        if (response.ok) {
          const intentData = await response.json();
          this.intents[intentName] = intentData;
          console.log(`✅ Loaded intent: ${intentName}`);
        }
      } catch (error) {
        console.warn(`⚠️ Could not load intent: ${intentName}`, error);
      }
    }
  }

  async loadEntities() {
    const entityFiles = [
      'echaohoi', 'edathoa', 'esanpham', 'edichvu', 'etuvan', 'ehotline',
      'eloaihoa', 'emauhoa', 'esoluong', 'ephuongthucthanhtoan', 'enoiban',
      'enoidatmua', 'engaygio', 'edonhang', 'ehuydon', 'ecamon', 'ecacdip',
      'edealhot', 'emasanpham', 'ethuthiep', 'ephanhoitot', 'ephanhoixau'
    ];

    for (const entityName of entityFiles) {
      try {
        // Load entity definition
        const entityResponse = await fetch(`entities/${entityName}.json`);
        if (entityResponse.ok) {
          const entityData = await entityResponse.json();
          
          // Load entity entries
          const entriesResponse = await fetch(`entities/${entityName}_entries_vi.json`);
          if (entriesResponse.ok) {
            const entriesData = await entriesResponse.json();
            this.entities[entityName] = {
              ...entityData,
              entries: entriesData
            };
            console.log(`✅ Loaded entity: ${entityName} with ${entriesData.length} entries`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Could not load entity: ${entityName}`, error);
      }
    }
  }

  setupEventListeners() {
    // Chatbot button click to toggle chatbox
    const chatButton = document.getElementById("chatbot-button");
    if (chatButton) {
      chatButton.addEventListener("click", () => this.toggleChat());
    }

    // Close button click
    const closeButton = document.getElementById("chat-close");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.toggleChat());
    }

    // Send message on Enter key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    });

    // Send message button click
    const sendButton = document.getElementById("chat-send");
    if (sendButton) {
      sendButton.addEventListener("click", () => this.sendMessage());
    }
  }

  showWelcomeMessage() {
    // Clear existing welcome message from HTML
    const chatBody = document.getElementById("chat-body");
    if (chatBody) {
      chatBody.innerHTML = "";
    }
    
    const welcomeIntent = this.intents['ichaohoi'] || this.intents['Default Welcome Intent'];
    if (welcomeIntent && welcomeIntent.responses && welcomeIntent.responses[0]) {
      const messages = welcomeIntent.responses[0].messages;
      if (messages && messages[0] && messages[0].speech) {
        const welcomeText = messages[0].speech[0];
        this.addBotMessage(welcomeText);
        return;
      }
    }
    
    // Fallback welcome message
    this.addBotMessage("Hạ Miên xin chào, cảm ơn bạn đã liên hệ. Hạ Miên có thể giúp gì cho bạn ạ?");
  }

  sendMessage() {
    const chatInput = document.getElementById("chat-input-field");
    if (!chatInput) return;

    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    this.addUserMessage(message);

    // Clear input
    chatInput.value = "";

    // Process message
    this.processMessage(message);
  }

  addUserMessage(message) {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "user-message";
    messageDiv.textContent = message;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  addBotMessage(message) {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = "bot-message";
    messageDiv.innerHTML = this.formatMessage(message);
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  formatMessage(message) {
    // Convert line breaks to <br>
    return message.replace(/\n/g, '<br>');
  }

  async processMessage(message) {
    console.log('🔍 Processing message:', message);
    
    const typingDiv = this.showTypingIndicator();
    
    try {
      // Find matching intent
      const matchedIntent = this.findMatchingIntent(message);
      
      if (matchedIntent) {
        console.log(`✅ Matched intent: ${matchedIntent.name}`);
        console.log(`📝 Message: "${message}"`);
        console.log(`🎯 Intent response:`, matchedIntent.responses?.[0]?.messages?.[0]?.speech?.[0]);
        this.conversationContext.currentIntent = matchedIntent;
        
        // Extract entities from message
        const entities = this.extractEntities(message);
        this.conversationContext.currentEntities = entities;
        
        // Get response from intent
        const response = this.getIntentResponse(matchedIntent, entities);
        this.hideTypingIndicator(typingDiv);
        this.addBotMessage(response);
        
      } else {
        console.log('⚠️ No intent matched, trying smart fallback');
        
        // Try to provide a smart response based on message content
        const smartResponse = this.getSmartFallbackResponse(message);
        this.hideTypingIndicator(typingDiv);
        this.addBotMessage(smartResponse);
      }
      
      // Add to conversation history
      this.conversationContext.conversationHistory.push({
        message: message,
        intent: this.conversationContext.currentIntent?.name,
        entities: this.conversationContext.currentEntities,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error('❌ Error processing message:', error);
      this.hideTypingIndicator(typingDiv);
      this.addBotMessage("Xin lỗi, có lỗi xảy ra. Bạn có thể thử lại không?");
    }
  }

  findMatchingIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Priority order: specific intents first, then general ones
    const priorityIntents = [
      // Most specific service intents first - TTworkshop has more specific keywords
      'ituvan - dichvu - TTworkshop',
      'ituvan - dichvu - TGworkshop',
      'ituvan - dichvu - decorsukien', 
      'ituvan - dichvu - thietketheoyeucau',
      'ituvan - sanpham - xemmau',
      
      // General service/product intents
      'ituvan - dichvu',
      'ituvan - sanpham',
      
      // Other specific intents
      'idathoa',
      'ithongtinshop',
      'iphiship',
      'iPTTT',
      'idealhot',
      'ihuydon',
      'iketthuc',
      'iphanhoitot',
      'iphanhoixau',
      'ithuthiep',
      'itracuudonhang',
      
      // General intents last
      'ituvan',
      'ichaohoi',
      'Default Welcome Intent',
      'Default Fallback Intent'
    ];
    
    // Check priority intents first
    for (const intentName of priorityIntents) {
      if (this.intents[intentName] && this.checkIntentMatch(intentName, lowerMessage)) {
        console.log(`🎯 Found matching intent: ${intentName} for message: "${lowerMessage}"`);
        return this.intents[intentName];
      }
    }
    
    // Fallback: check remaining intents
    for (const [intentName, intentData] of Object.entries(this.intents)) {
      if (!priorityIntents.includes(intentName) && this.checkIntentMatch(intentName, lowerMessage)) {
        return intentData;
      }
    }
    
    return null;
  }

  checkIntentMatch(intentName, message) {
    // Load training phrases for this intent
    const trainingPhrases = this.getTrainingPhrases(intentName);
    
    if (!trainingPhrases) return false;
    
    console.log(`🔍 Checking intent: ${intentName} with phrases:`, trainingPhrases);
    
    // Check if message contains any training phrase
    for (const phrase of trainingPhrases) {
      const lowerPhrase = phrase.toLowerCase();
      
      // Exact match for single words (like "workshop")
      if (lowerPhrase.length <= 10) {
        if (message === lowerPhrase || message.includes(` ${lowerPhrase} `) || 
            message.startsWith(`${lowerPhrase} `) || message.endsWith(` ${lowerPhrase}`)) {
          console.log(`✅ Exact match found: "${phrase}" in "${message}"`);
          return true;
        }
      } else {
        // Partial match for longer phrases
        if (message.includes(lowerPhrase)) {
          console.log(`✅ Partial match found: "${phrase}" in "${message}"`);
          return true;
        }
      }
    }
    
    return false;
  }

  getTrainingPhrases(intentName) {
    try {
      // Load training phrases from usersays file
      const response = fetch(`intents/${intentName}_usersays_vi.json`);
      // Note: This would need to be loaded asynchronously in a real implementation
      // For now, we'll use basic keyword matching
      return this.getBasicKeywords(intentName);
    } catch (error) {
      return this.getBasicKeywords(intentName);
    }
  }

  getBasicKeywords(intentName) {
    const keywordMap = {
      'ichaohoi': ['chào', 'hello', 'hi', 'xin chào', 'hé lô', 'hí lu', 'lô', 'alo'],
      'idathoa': ['đặt', 'mua', 'chốt', 'lấy', 'xuống tiền'],
      'ituvan': ['tư vấn', 'hỏi', 'cần tư vấn', 'muốn tư vấn'],
      'ituvan - sanpham': ['sản phẩm', 'hoa', 'sp', 'mặt hàng', 'bó hoa', 'lẵng hoa', 'bình hoa', 'hộp mica'],
      'ituvan - dichvu': ['dịch vụ', 'service', 'workshop', 'sự kiện', 'thiết kế', 'trang trí'],
      'ituvan - dichvu - TGworkshop': ['workshop', 'tham gia', 'học', 'lớp học'],
      'ituvan - dichvu - TTworkshop': ['workshop', 'bó hoa', 'dạy bó hoa', 'lớp bó hoa', 'học bó hoa', '650k', '15 hàng tháng'],
      'ituvan - dichvu - decorsukien': ['trang trí', 'sự kiện', 'event', 'decor'],
      'ituvan - dichvu - thietketheoyeucau': ['thiết kế', 'theo yêu cầu', 'custom', 'riêng'],
      'ithongtinshop': ['thông tin', 'shop', 'cửa hàng', 'địa chỉ', 'hotline'],
      'iphiship': ['giao hàng', 'ship', 'delivery', 'phí ship'],
      'iPTTT': ['thanh toán', 'payment', 'tiền', 'giá'],
      'idealhot': ['deal', 'hot', 'khuyến mãi', 'giảm giá'],
      'ihuydon': ['hủy', 'cancel', 'hủy đơn'],
      'iketthuc': ['tạm biệt', 'bye', 'goodbye', 'kết thúc'],
      'iphanhoitot': ['cảm ơn', 'thank', 'tốt', 'hay'],
      'iphanhoixau': ['tệ', 'xấu', 'không tốt', 'bad'],
      'ithuthiep': ['thiệp', 'thư', 'thư tay'],
      'itracuudonhang': ['tra cứu', 'đơn hàng', 'order', 'tìm đơn']
    };
    
    return keywordMap[intentName] || [];
  }

  extractEntities(message) {
    const lowerMessage = message.toLowerCase();
    const extractedEntities = {};
    
    // Check each entity
    for (const [entityName, entityData] of Object.entries(this.entities)) {
      if (entityData.entries) {
        for (const entry of entityData.entries) {
          // Check main value
          if (lowerMessage.includes(entry.value.toLowerCase())) {
            extractedEntities[entityName] = entry.value;
            break;
          }
          
          // Check synonyms
          for (const synonym of entry.synonyms) {
            if (lowerMessage.includes(synonym.toLowerCase())) {
              extractedEntities[entityName] = entry.value;
              break;
            }
          }
        }
      }
    }
    
    return extractedEntities;
  }

  getIntentResponse(intent, entities) {
    if (!intent.responses || !intent.responses[0]) {
      return this.getFallbackResponse();
    }
    
    const response = intent.responses[0];
    if (!response.messages || !response.messages[0]) {
      return this.getFallbackResponse();
    }
    
    const messages = response.messages[0].speech;
    if (!messages || messages.length === 0) {
      return this.getFallbackResponse();
    }
    
    // Get random response from available messages
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Enhance response with links based on intent
    return this.enhanceResponseWithLinks(randomMessage, intent, entities);
  }

  enhanceResponseWithLinks(response, intent, entities) {
    let enhancedResponse = response;
    
    // Add links based on intent type
    switch (intent.name) {
      case 'idathoa':
        enhancedResponse += "\n\n👉 <a href=\"shop.html\" target=\"_blank\">Xem sản phẩm và đặt hàng</a>";
        enhancedResponse += "\n👉 <a href=\"products.html\" target=\"_blank\">Xem danh sách sản phẩm chi tiết</a>";
        break;
        
      case 'ituvan - sanpham':
      case 'ituvan - sanpham - xemmau':
        enhancedResponse += "\n\n👉 <a href=\"products.html\" target=\"_blank\">Xem danh sách sản phẩm chi tiết</a>";
        enhancedResponse += "\n👉 <a href=\"shop.html\" target=\"_blank\">Xem shop online</a>";
        break;
        
      case 'ituvan - dichvu':
      case 'ituvan - dichvu - decorsukien':
      case 'ituvan - dichvu - TGworkshop':
      case 'ituvan - dichvu - TTworkshop':
      case 'ituvan - dichvu - thietketheoyeucau':
        enhancedResponse += "\n\n👉 <a href=\"services.html\" target=\"_blank\">Xem dịch vụ của chúng tôi</a>";
        break;
        
      case 'idealhot':
      case 'idealhotthang10':
        enhancedResponse += "\n\n👉 <a href=\"shop.html\" target=\"_blank\">Xem deal hot</a>";
        enhancedResponse += "\n👉 <a href=\"products.html\" target=\"_blank\">Xem tất cả sản phẩm</a>";
        break;
        
      case 'ithongtinshop':
        enhancedResponse += "\n\n👉 <a href=\"about.html\" target=\"_blank\">Giới thiệu về Hạ Miên</a>";
        enhancedResponse += "\n👉 <a href=\"contact.html\" target=\"_blank\">Thông tin liên hệ</a>";
        break;
        
      case 'iphiship':
      case 'iPTTT':
        enhancedResponse += "\n\n👉 <a href=\"contact.html\" target=\"_blank\">Thông tin giao hàng</a>";
        break;
        
      default:
        // For general intents, only add links if specifically about products or services
        // Check if the message content or entities indicate product interest
        const hasProductEntity = entities && (
          entities['esanpham'] || 
          entities['eloaihoa'] || 
          entities['emauhoa'] || 
          entities['esoluong']
        );
        
        // Check if the message content or entities indicate service interest  
        const hasServiceEntity = entities && (
          entities['edichvu'] || 
          entities['etuvan']
        );
        
        // Only add product links if specifically about products
        if (hasProductEntity || (enhancedResponse.toLowerCase().includes('sản phẩm') && !enhancedResponse.toLowerCase().includes('dịch vụ'))) {
          enhancedResponse += "\n\n👉 <a href=\"products.html\" target=\"_blank\">Xem danh sách sản phẩm</a>";
        }
        
        // Only add service links if specifically about services
        if (hasServiceEntity || (enhancedResponse.toLowerCase().includes('dịch vụ') && !enhancedResponse.toLowerCase().includes('sản phẩm'))) {
          enhancedResponse += "\n\n👉 <a href=\"services.html\" target=\"_blank\">Xem dịch vụ</a>";
        }
        break;
    }
    
    return enhancedResponse;
  }

  getSmartFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific keywords and provide targeted responses
    if (lowerMessage.includes('bó hoa') || lowerMessage.includes('dạy bó hoa') || lowerMessage.includes('lớp bó hoa') || lowerMessage.includes('học bó hoa') || lowerMessage.includes('650k') || lowerMessage.includes('15 hàng tháng')) {
      return "Dạ, Hiện tại bên tiệm có tổ chức Workshop dạy bó hoa vào ngày 15 hàng tháng với chi phí 650k/người (đã bao gồm: trà, bánh,...)\nĐến với Workshop, bạn không chỉ biết cách tự tay bó một bông hoa mà còn được trải nghiệm:\n- Không khí thư giãn, chữa lành\n- Được học và hướng dẫn trực tiếp bởi các florist chuyên nghiệp\n- Kết nối với người cùng đam mê \n- Vừa có hoa xinh, ảnh đẹp mang về; vừa học thêm được các kiến thức về hoa\nBạn có muốn Hạ Miên giúp bạn giữ một chỗ trong tháng này không ạ?";
    }
    
    if (lowerMessage.includes('workshop') || lowerMessage.includes('lớp học')) {
      return "Cảm ơn khách yêu đã quan tâm đến dịch vụ workshop bên tiệm, Hạ Miên rất vui khi có sự hiện diện của bạn.\nBạn vui lòng đặt cọc 50% tiền vé là 352k qua \n- stk: 12422555 ngân hàng: MT Bank\n- Nội dung ck: Tên người tham gia   ngày tham gia";
    }
    
    if (lowerMessage.includes('trang trí') || lowerMessage.includes('sự kiện') || lowerMessage.includes('event')) {
      return "Bạn vui lòng liên hệ tới số hotline: 0398068898 để được tiệm hỗ trợ sớm nhất và đồng hành trong quá trình sử dụng dịch vụ ạ.";
    }
    
    if (lowerMessage.includes('thiết kế') || lowerMessage.includes('theo yêu cầu')) {
      return "Bạn vui lòng liên hệ tới số hotline: 0398068898 để được tiệm hỗ trợ sớm nhất và đồng hành trong quá trình sử dụng dịch vụ ạ.";
    }
    
    if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('hoa')) {
      return "Hiện tại Hạ Miên có các sản phẩm: lẵng hoa, hoa bó, bình hoa, hộp mica hoa ạ.";
    }
    
    if (lowerMessage.includes('dịch vụ')) {
      return "Hạ Miên đang có các dịch vụ như: thiết kế hoa theo yêu cầu, workshop và liên kết tổ chức sự kiện. Bạn muốn tiệm mình tư vấn dịch vụ nào ạ?";
    }
    
    // Default fallback
    return this.getFallbackResponse();
  }

  getFallbackResponse() {
    const fallbackIntent = this.intents['Default Fallback Intent'];
    if (fallbackIntent && fallbackIntent.responses && fallbackIntent.responses[0]) {
      const messages = fallbackIntent.responses[0].messages;
      if (messages && messages[0] && messages[0].speech) {
        return messages[0].speech[0];
      }
    }
    
    return "Hạ Miên xin phép được hiểu ý bạn như sau, bạn đang cần tư vấn đặt hoa phải không ạ?";
  }

  showTypingIndicator() {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return null;

    const typingDiv = document.createElement("div");
    typingDiv.className = "typing-indicator";
    typingDiv.innerHTML = `
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    return typingDiv;
  }

  hideTypingIndicator(typingDiv) {
    if (typingDiv && typingDiv.parentNode) {
      typingDiv.parentNode.removeChild(typingDiv);
    }
  }

  toggleChat() {
    const chatBox = document.getElementById("chatbot-box");
    if (!chatBox) return;

    if (chatBox.classList.contains("hidden")) {
      chatBox.classList.remove("hidden");
    } else {
      chatBox.classList.add("hidden");
    }
  }

  // Public API methods
  getLoadedIntents() {
    return Object.keys(this.intents);
  }

  getLoadedEntities() {
    return Object.keys(this.entities);
  }

  getConversationHistory() {
    return this.conversationContext.conversationHistory;
  }

  resetConversation() {
    this.conversationContext = {
      currentIntent: null,
      currentEntities: {},
      conversationHistory: []
    };
    console.log('🔄 Conversation reset');
  }

  // Debug function to test intent matching
  testIntentMatching(message) {
    console.log(`🧪 Testing intent matching for: "${message}"`);
    const matchedIntent = this.findMatchingIntent(message);
    if (matchedIntent) {
      console.log(`✅ Matched intent: ${matchedIntent.name}`);
      console.log(`📝 Response:`, matchedIntent.responses?.[0]?.messages?.[0]?.speech?.[0]);
    } else {
      console.log(`❌ No intent matched`);
    }
    return matchedIntent;
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.haMienChatbot = new HaMienChatbot();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HaMienChatbot;
}