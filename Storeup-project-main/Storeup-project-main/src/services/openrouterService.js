import axios from 'axios';

// Function to check if a message is related to e-commerce
export const isEcommerceRelated = (message) => {
  const ecommerceKeywords = [
    // English keywords
    'shop', 'store', 'product', 'order', 'payment', 'shipping', 'delivery', 
    'cart', 'checkout', 'purchase', 'customer', 'discount', 'sale', 'inventory', 
    'retail', 'ecommerce', 'e-commerce', 'online store', 'marketplace', 'web store',
    'storeup', 'buy', 'selling', 'merchandise', 'transaction', 'vendor', 'price',
    'catalog', 'shopping', 'website', 'business', 'marketing', 'brand', 'promotion',
    'refund', 'return policy', 'warranty', 'tracking', 'subscription', 'digital product',
    'physical product', 'stock', 'in-stock', 'out-of-stock', 'wishlist', 'coupon',
    'gift card', 'loyalty', 'points', 'rating', 'review', 'feedback', 'seller',
    
    // Arabic keywords
    'متجر', 'تسوق', 'منتج', 'منتجات', 'طلب', 'طلبات', 'دفع', 'شحن', 'توصيل',
    'سلة', 'عربة', 'شراء', 'عميل', 'زبون', 'خصم', 'تخفيض', 'مخزون', 'بضاعة',
    'تجارة', 'إلكترونية', 'ستوراب', 'بيع', 'مبيعات', 'معاملة', 'بائع', 'سعر',
    'كتالوج', 'تسويق', 'علامة تجارية', 'ترويج', 'استرجاع', 'سياسة الإرجاع', 'ضمان',
    'تتبع', 'اشتراك', 'منتج رقمي', 'منتج فعلي', 'مخزون', 'متوفر', 'غير متوفر',
    'قائمة الرغبات', 'قسيمة', 'بطاقة هدية', 'ولاء', 'نقاط', 'تقييم', 'مراجعة',
    'تعليق', 'تعليقات', 'ملاحظات', 'بائع', 'مشتريات', 'محفظة', 'عرض', 'عروض',
    'مستهلك', 'تسوق عبر الإنترنت', 'موقع إلكتروني'
  ];
  
  const lowercaseMessage = message.toLowerCase();
  
  // If the message is very short, assume it's e-commerce related to avoid false negatives
  if (message.length < 10) {
    return true;
  }
  
  return ecommerceKeywords.some(keyword => lowercaseMessage.includes(keyword));
};

// Function to send a request to OpenRouter API
export const sendMessageToOpenRouter = async (messages, apiKey) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }
  
  // Available models in order of preference
  const models = [
    "meta-llama/llama-3-8b-instruct",        // First choice
    "meta-llama/llama-3.1-8b-instruct:free", // Second choice (free version)
    "anthropic/claude-3-haiku",              // Third choice
    "google/gemini-pro",                     // Fourth choice
    "mistralai/mistral-7b-instruct"          // Fifth choice
  ];
  
  let lastError = null;
  
  // Try each model in order until one works
  for (const model of models) {
    try {
      // Format the messages for OpenRouter API
      const formattedMessages = formatMessagesForOpenRouter(messages);
      
      // Make the API request to OpenRouter
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://storeup.com', // Replace with your actual website
            'X-Title': 'Storeup Assistant'
          }
        }
      );
      
      // Extract the response text
      if (response.data.choices && response.data.choices.length > 0) {
        // Return both the content and the model name that was used
        return {
          content: response.data.choices[0].message.content,
          modelUsed: response.data.model || model
        };
      } else {
        throw new Error('لم يتم استلام رد من النموذج');
      }
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      lastError = error;
      
      // If error is not model related (like authentication), no need to try other models
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('مفتاح API غير صالح. يرجى التأكد من إدخال مفتاح صحيح\n\nInvalid API key. Please make sure to enter a valid key');
      } else if (error.response?.status === 429) {
        throw new Error('تم تجاوز حد الاستخدام. يرجى المحاولة لاحقًا\n\nUsage limit exceeded. Please try again later');
      }
      
      // If the error is not related to model availability, throw immediately
      if (!error.response?.data?.error?.message?.includes('No endpoints found')) {
        break;
      }
      
      // Otherwise continue to the next model
      continue;
    }
  }
  
  // If we get here, all models failed
  if (lastError) {
    if (lastError.response?.data?.error?.message?.includes('No endpoints found')) {
      throw new Error('لم يتم العثور على أي نموذج متاح. يرجى التحقق من حسابك أو المحاولة لاحقًا\n\nNo available models found. Please check your account or try again later');
    } else if (lastError.response?.data?.error) {
      throw new Error(`خطأ: ${lastError.response.data.error.message || lastError.response.data.error}\n\nError: ${lastError.response.data.error.message || lastError.response.data.error}`);
    } else {
      throw new Error('حدث خطأ أثناء الاتصال بالخدمة. يرجى المحاولة مرة أخرى\n\nAn error occurred while connecting to the service. Please try again');
    }
  } else {
    throw new Error('حدث خطأ غير معروف عند محاولة الوصول إلى النماذج\n\nAn unknown error occurred while trying to access the models');
  }
};

// Helper function to format messages for OpenRouter API
function formatMessagesForOpenRouter(messages) {
  // Add system message as the first message with bilingual instructions
  const formattedMessages = [
    {
      role: 'system',
      content: `أنت مساعد متخصص ثنائي اللغة (العربية والإنجليزية) للتجارة الإلكترونية لمنصة Storeup. 
هدفك هو مساعدة المستخدمين بالأسئلة المتعلقة بالتجارة الإلكترونية والتسوق عبر الإنترنت ووظائف الموقع.
يجب أن تفهم وتجيب على الأسئلة باللغة التي يستخدمها المستخدم. إذا كان السؤال بالعربية، أجب بالعربية. وإذا كان بالإنجليزية، أجب بالإنجليزية.
يجب أن تجيب فقط على الأسئلة المتعلقة بالتجارة الإلكترونية والتسوق عبر الإنترنت ومنصة Storeup واستفسارات الأعمال العامة.
إذا كان السؤال لا يتعلق بهذه المواضيع، يرجى الرفض بأدب وشرح أنك يمكنك فقط المساعدة في استفسارات التجارة الإلكترونية.
كن مفيدًا ومختصرًا ومهنيًا دائمًا.

You are a bilingual (Arabic and English) e-commerce assistant for Storeup platform.
Your purpose is to help users with questions about e-commerce, online shopping, and website functionality.
You should understand and respond in the language used by the user. If the question is in Arabic, answer in Arabic. If it's in English, answer in English.
Only answer questions related to e-commerce, online shopping, the Storeup platform, and general business inquiries.
If a question is not related to these topics, politely decline to answer and explain that you can only help with e-commerce related queries.
Always be helpful, concise, and professional.`
    }
  ];
  
  // Add the conversation history, limited to the last 10 messages to avoid context limitations
  const recentMessages = messages.slice(-10);
  recentMessages.forEach(msg => {
    formattedMessages.push({
      role: msg.role,
      content: msg.content
    });
  });
  
  return formattedMessages;
} 