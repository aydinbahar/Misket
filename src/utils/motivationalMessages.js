// Motivasyon mesajları - Serra için özel hazırlanmış
// Her mesaj Türkçe ve İngilizce olarak hazırlanmıştır

const getDayName = () => {
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  return { tr: days[today], en: dayNamesEn[today] };
};

// Genel motivasyon mesajları
const generalMessages = [
  {
    tr: "Merhaba Serra! Bugün harika bir gün olacak! 🌟",
    en: "Hello Serra! Today will be a great day! 🌟"
  },
  {
    tr: "Her kelime öğrendiğinde kendine bir adım daha yaklaşıyorsun! 💪",
    en: "Every word you learn brings you one step closer to yourself! 💪"
  },
  {
    tr: "Küçük adımlar büyük başarılar getirir. Sen zaten harika gidiyorsun! ✨",
    en: "Small steps lead to great achievements. You're already doing great! ✨"
  },
  {
    tr: "Bugün de yeni şeyler öğrenmeye hazır mısın? Seni bekliyorlar! 📚",
    en: "Are you ready to learn new things today? They're waiting for you! 📚"
  },
  {
    tr: "Her çalışma seansı seni hedefine biraz daha yaklaştırıyor. Devam et! 🎯",
    en: "Every study session brings you a little closer to your goal. Keep going! 🎯"
  },
  {
    tr: "Zorluklar seni durduramaz, sadece daha güçlü yapar! 💜",
    en: "Challenges can't stop you, they only make you stronger! 💜"
  },
  {
    tr: "Bugün de kendine yatırım yapma zamanı! Her kelime bir hazine! 💎",
    en: "Time to invest in yourself again today! Every word is a treasure! 💎"
  },
  {
    tr: "Senin potansiyelin sınırsız! Her gün bunu kanıtlıyorsun! 🚀",
    en: "Your potential is limitless! You prove it every day! 🚀"
  },
  {
    tr: "Başarı bir yolculuk, sen de harika bir yolcusun! 🌈",
    en: "Success is a journey, and you're an amazing traveler! 🌈"
  },
  {
    tr: "Her doğru cevap seni daha da güçlendiriyor. Devam et! ⭐",
    en: "Every correct answer makes you even stronger. Keep going! ⭐"
  }
];

// Günlere özel mesajlar
const daySpecificMessages = {
  0: [ // Pazar
    {
      tr: "Pazar günü! Haftanın başlangıcı için mükemmel bir gün. Yeni kelimeler seni bekliyor! 🌸",
      en: "Sunday! A perfect day to start the week. New words are waiting for you! 🌸"
    },
    {
      tr: "Pazar günü rahatlamak ve öğrenmek için harika bir gün! Hadi başlayalım! ☀️",
      en: "Sunday is a great day to relax and learn! Let's get started! ☀️"
    }
  ],
  1: [ // Pazartesi
    {
      tr: "Pazartesi! Haftaya harika bir başlangıç yapalım. Sen bunu yapabilirsin! 💪",
      en: "Monday! Let's make a great start to the week. You can do this! 💪"
    },
    {
      tr: "Pazartesi motivasyonu! Bugün yeni bir haftaya başlıyorsun. Her şey mümkün! 🌟",
      en: "Monday motivation! You're starting a new week today. Anything is possible! 🌟"
    }
  ],
  2: [ // Salı
    {
      tr: "Salı günü! Haftanın ikinci günü, momentum kazanma zamanı! 🚀",
      en: "Tuesday! Second day of the week, time to gain momentum! 🚀"
    },
    {
      tr: "Salı günü! Dün başladığın yolculuğa bugün devam et. Sen harikasın! ✨",
      en: "Tuesday! Continue the journey you started yesterday. You're amazing! ✨"
    }
  ],
  3: [ // Çarşamba
    {
      tr: "Çarşamba! Haftanın ortası, ama sen hala güçlüsün! Devam et! 💜",
      en: "Wednesday! Midweek, but you're still strong! Keep going! 💜"
    },
    {
      tr: "Çarşamba günü! Haftanın yarısını tamamladın. Geri kalanı da senin! 🎯",
      en: "Wednesday! You've completed half the week. The rest is yours too! 🎯"
    }
  ],
  4: [ // Perşembe
    {
      tr: "Perşembe! Haftanın sonlarına yaklaşıyoruz ama öğrenme hiç bitmez! 📚",
      en: "Thursday! We're approaching the end of the week, but learning never ends! 📚"
    },
    {
      tr: "Perşembe günü! Her gün yeni bir fırsat. Bugün de harika olacak! 🌈",
      en: "Thursday! Every day is a new opportunity. Today will be great too! 🌈"
    }
  ],
  5: [ // Cuma
    {
      tr: "Cuma! Haftanın son günü ama öğrenme her zaman devam eder! Seni tebrik ediyorum! 🎉",
      en: "Friday! Last day of the week, but learning always continues! Congratulations! 🎉"
    },
    {
      tr: "Cuma günü! Bu hafta harika işler çıkardın. Bugün de öyle olacak! ⭐",
      en: "Friday! You've done great work this week. Today will be the same! ⭐"
    }
  ],
  6: [ // Cumartesi
    {
      tr: "Cumartesi! Hafta sonu ama öğrenme tatili yok! Her gün bir fırsat! 🌸",
      en: "Saturday! Weekend, but no break from learning! Every day is an opportunity! 🌸"
    },
    {
      tr: "Cumartesi günü! Rahatlamak ve öğrenmek için mükemmel bir gün. Hadi başlayalım! ☀️",
      en: "Saturday! A perfect day to relax and learn. Let's get started! ☀️"
    }
  ]
};

// Liseye hazırlık ve dil öğrenme odaklı mesajlar
const highSchoolPrepMessages = [
  {
    tr: "Liseye hazırlanırken her kelime seni daha güçlü yapıyor! Sen harikasın! 🎓",
    en: "Every word makes you stronger as you prepare for high school! You're amazing! 🎓"
  },
  {
    tr: "Lisede bu kelimeler senin en iyi arkadaşların olacak! Şimdiden hazırlanıyorsun! 💪",
    en: "These words will be your best friends in high school! You're preparing now! 💪"
  },
  {
    tr: "Her öğrendiğin kelime lisede sana avantaj sağlayacak. Devam et! 🌟",
    en: "Every word you learn will give you an advantage in high school. Keep going! 🌟"
  },
  {
    tr: "Liseye başladığında bu çalışmaların meyvelerini toplayacaksın! 🍎",
    en: "When you start high school, you'll reap the fruits of this work! 🍎"
  },
  {
    tr: "Dil öğrenmek sadece ders değil, yeni dünyalar keşfetmektir! 🌍",
    en: "Learning a language isn't just a lesson, it's discovering new worlds! 🌍"
  },
  {
    tr: "Her İngilizce kelime seni dünyaya bir adım daha yaklaştırıyor! ✈️",
    en: "Every English word brings you one step closer to the world! ✈️"
  },
  {
    tr: "Lisede İngilizce derslerinde öne çıkacaksın çünkü şimdi hazırlanıyorsun! 🏆",
    en: "You'll stand out in English classes in high school because you're preparing now! 🏆"
  },
  {
    tr: "Ders çalışmak sadece sınav için değil, kendin için! Sen değerlisin! 💎",
    en: "Studying isn't just for exams, it's for yourself! You're valuable! 💎"
  },
  {
    tr: "Her gün biraz çalışmak, büyük başarıların anahtarı! Sen bunu biliyorsun! 🔑",
    en: "Studying a little every day is the key to great success! You know this! 🔑"
  },
  {
    tr: "Liseye hazırlanırken her gün biraz daha güçleniyorsun! Sen harikasın! 🌈",
    en: "You're getting stronger every day as you prepare for high school! You're amazing! 🌈"
  }
];

// Moral ve destek mesajları
const encouragementMessages = [
  {
    tr: "Bazen zorlanabilirsin ama unutma, her zorluk seni büyütür! 💜",
    en: "Sometimes it can be difficult, but remember, every challenge makes you grow! 💜"
  },
  {
    tr: "Kendine inan! Sen çok daha fazlasını yapabilirsin! 🌟",
    en: "Believe in yourself! You can do so much more! 🌟"
  },
  {
    tr: "Her küçük başarı büyük bir zafer! Seni kutluyorum! 🎉",
    en: "Every small success is a big victory! I'm proud of you! 🎉"
  },
  {
    tr: "Bugün zor bir gün olsa bile, yarın daha iyi olacak! Güneş her zaman doğar! ☀️",
    en: "Even if today is a difficult day, tomorrow will be better! The sun always rises! ☀️"
  },
  {
    tr: "Senin yanında olduğunu bil. Her zaman destekleniyorsun! 🤗",
    en: "Know that you're supported. You're always supported! 🤗"
  },
  {
    tr: "Mükemmel olmak zorunda değilsin, sadece elinden geleni yap! Bu yeterli! ✨",
    en: "You don't have to be perfect, just do your best! That's enough! ✨"
  },
  {
    tr: "Her hata bir öğrenme fırsatı. Cesaret etmeye devam et! 💪",
    en: "Every mistake is a learning opportunity. Keep being brave! 💪"
  },
  {
    tr: "Senin gücün sınırsız! Sadece kendine izin ver! 🚀",
    en: "Your strength is limitless! Just allow yourself! 🚀"
  },
  {
    tr: "Bugün de kendin için bir şeyler yapıyorsun. Bu harika! 🌸",
    en: "You're doing something for yourself today too. That's great! 🌸"
  },
  {
    tr: "Her gün biraz daha iyi oluyorsun. Seni görmek harika! ⭐",
    en: "You're getting a little better every day. It's great to see you! ⭐"
  }
];

// Tüm mesajları birleştir
const allMessages = [
  ...generalMessages,
  ...highSchoolPrepMessages,
  ...encouragementMessages
];

// Rastgele bir mesaj seç
export const getRandomMessage = () => {
  const today = new Date().getDay();
  const dayMessages = daySpecificMessages[today] || [];
  
  // %30 ihtimalle güne özel mesaj, %70 ihtimalle genel mesaj
  const useDayMessage = Math.random() < 0.3 && dayMessages.length > 0;
  
  if (useDayMessage) {
    const randomDayMessage = dayMessages[Math.floor(Math.random() * dayMessages.length)];
    return randomDayMessage;
  }
  
  const randomMessage = allMessages[Math.floor(Math.random() * allMessages.length)];
  return randomMessage;
};

// Gün adını döndür
export const getCurrentDay = () => {
  return getDayName();
};
