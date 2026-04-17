export const interpretCommand = (input) => {
  const text = input.toLowerCase();
  
  // Roman Urdu & Urdu Keywords
  const keywords = {
    backgroundRemoval: [
      'background hatao', 'bg remove', 'background khatam', 'piche se hatao', 
      'بیک گراؤنڈ ہٹاؤ', 'بیک گراؤنڈ ختم کرو', 'background saaf karo'
    ],
    generateImage: [
      'image banao', 'tasveer banao', 'generate', 'create image', 
      'تصویر بناؤ', 'نئی تصویر بناؤ', 'aik shandaar image dikhao'
    ],
    addText: [
      'likho', 'text dalo', 'add text', 'naam likho',
      'لکھو', 'ٹیکسٹ ڈالو', 'kuch likh do is pe'
    ],
    resize: [
      'chota karo', 'bara karo', 'size badlo', 'resize',
      'چھوٹا کرو', 'بڑا کرو', 'سائز بدلو', 'fit kar do'
    ],
    professionalStyle: [
      'professional banao', 'style badlo', 'shandaar banao',
      'پروفیشنل بناؤ', 'سٹائل بدلو', 'behtreen kar do', 'modern look do'
    ]
  };

  for (const [action, terms] of Object.entries(keywords)) {
    if (terms.some(term => text.includes(term))) {
      return { action, original: input };
    }
  }

  return { action: 'generalPrompt', original: input };
};

export const getResponse = (action, lang = 'en') => {
  const responses = {
    backgroundRemoval: {
      en: "Processing: Removing background professionally...",
      ur: "بیک گراؤنڈ ہٹایا جا رہا ہے...",
      roman: "Background hataya ja raha hai..."
    },
    generateImage: {
      en: "Generating your unlimited AI image...",
      ur: "آپ کی تصویر بنائی جا رہی ہے...",
      roman: "Aapki image generate ho rahi hai..."
    },
    addText: {
      en: "Adding text to your image...",
      ur: "ٹیکسٹ شامل کیا جا رہا ہے...",
      roman: "Text add kiya ja raha hai..."
    }
  };

  return responses[action] || { en: "Thinking...", ur: "سوچ رہا ہوں...", roman: "Soch raha hoon..." };
};
