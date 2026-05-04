// ===== NOOR ALLAH - APARTMENTS & LANDS DATA =====

const COMMISSION_RATE = 0.05; // 5% عمولة نور الله

const APARTMENTS = [
  {
    id: 1,
    title: "شقة فاخرة على الكورنيش",
    city: "الإسكندرية", area: "سيدي بشر", type: "مصيف",
    price: 1200, priceUnit: "ليلة", size: 120, rooms: 3, bathrooms: 2, persons: 6, floor: 5,
    rating: 4.9, reviews: 124, available: true,
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80&auto=format&fit=crop",
    badges: ["مميزة", "إطلالة بحرية"],
    description: "شقة فاخرة بإطلالة بانورامية مباشرة على البحر المتوسط. مجهزة بالكامل بأعلى المواصفات مع تكييف مركزي وإنترنت فائق السرعة. مثالية للعائلات والمصيفين.",
    amenities: ["🌊 إطلالة بحرية", "❄️ تكييف مركزي", "📶 واي فاي مجاني", "🍳 مطبخ مجهز", "🅿️ موقف سيارة", "🔐 أمن 24/7", "🛗 مصعد", "🌿 شرفة"],
    extraServices: [{ name: "غسيل ملابس", price: 150 }, { name: "خدمة تنظيف يومية", price: 200 }, { name: "أثاث إضافي", price: 100 }]
  },
  {
    id: 2,
    title: "شقة الطلاب - قرب الجامعة",
    city: "القاهرة", area: "مدينة نصر", type: "طالب",
    price: 350, priceUnit: "ليلة", size: 75, rooms: 2, bathrooms: 1, persons: 4, floor: 2,
    rating: 4.7, reviews: 89, available: true,
    img: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80&auto=format&fit=crop",
    badges: ["للطلاب", "قريب من الجامعة"],
    description: "شقة مريحة ومجهزة خصيصاً للطلاب، قريبة من الجامعات والمواصلات. بيئة هادئة مناسبة للدراسة مع إنترنت سريع.",
    amenities: ["📶 واي فاي فائق السرعة", "❄️ تكييف", "🍳 مطبخ", "📚 مكتب دراسة", "🔐 أمن", "🚌 قريب من المواصلات"],
    extraServices: [{ name: "إنترنت إضافي", price: 50 }, { name: "تنظيف أسبوعي", price: 100 }]
  },
  {
    id: 3,
    title: "فيلا الساحل الشمالي",
    city: "الساحل الشمالي", area: "سيدي عبد الرحمن", type: "مصيف",
    price: 3500, priceUnit: "ليلة", size: 280, rooms: 5, bathrooms: 3, persons: 10, floor: 0,
    rating: 5.0, reviews: 56, available: true,
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format&fit=crop",
    badges: ["VIP", "حمام سباحة خاص"],
    description: "فيلا فاخرة في قلب الساحل الشمالي مع حمام سباحة خاص وحديقة واسعة. مناسبة للمجموعات الكبيرة والعائلات التي تبحث عن تجربة لا تُنسى.",
    amenities: ["🏊 حمام سباحة خاص", "🌴 حديقة", "❄️ تكييف مركزي", "📶 واي فاي", "🍳 مطبخ فاخر", "🅿️ موقف كبير", "🔐 أمن 24/7", "🌊 قريب من البحر", "🎮 ترفيه", "🛁 حمام جاكوزي"],
    extraServices: [{ name: "باربيكيو", price: 500 }, { name: "طباخ خاص", price: 1000 }, { name: "تنظيف يومي", price: 300 }]
  },
  {
    id: 4,
    title: "شقة عائلية هادئة",
    city: "الإسكندرية", area: "العجمي", type: "عائلي",
    price: 800, priceUnit: "ليلة", size: 140, rooms: 3, bathrooms: 2, persons: 7, floor: 3,
    rating: 4.8, reviews: 201, available: true,
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80&auto=format&fit=crop",
    badges: ["عائلي", "هادئة"],
    description: "شقة عائلية فسيحة في منطقة هادئة بالعجمي. مجهزة بالكامل وقريبة من الشاطئ والخدمات. مثالية للعائلات التي تبحث عن الراحة والخصوصية.",
    amenities: ["❄️ تكييف", "📶 واي فاي", "🍳 مطبخ كامل", "🌿 شرفة", "🅿️ موقف", "🔐 أمن"],
    extraServices: [{ name: "تنظيف مع الخروج", price: 150 }, { name: "أثاث إضافي للأطفال", price: 100 }]
  },
  {
    id: 5,
    title: "شقة الغردقة الفاخرة",
    city: "الغردقة", area: "الممشى السياحي", type: "مصيف",
    price: 1800, priceUnit: "ليلة", size: 100, rooms: 2, bathrooms: 2, persons: 4, floor: 7,
    rating: 4.6, reviews: 73, available: true,
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80&auto=format&fit=crop",
    badges: ["إطلالة بانورامية", "قريب من الشعب المرجانية"],
    description: "شقة فاخرة في قلب الغردقة مع إطلالة رائعة على البحر الأحمر. قريبة من أفضل مناطق الغوص والأنشطة المائية.",
    amenities: ["🌊 إطلالة بانورامية", "❄️ تكييف", "📶 واي فاي", "🍳 مطبخ", "🏊 حوض سباحة مشترك", "🔐 أمن"],
    extraServices: [{ name: "رحلة غوص", price: 400 }, { name: "نقل مطار", price: 300 }]
  },
  {
    id: 6,
    title: "شقة شرم الشيخ - نعمة باي",
    city: "شرم الشيخ", area: "نعمة باي", type: "مصيف",
    price: 2200, priceUnit: "ليلة", size: 90, rooms: 2, bathrooms: 1, persons: 4, floor: 4,
    rating: 4.9, reviews: 167, available: false,
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80&auto=format&fit=crop",
    badges: ["محجوزة", "الأكثر طلباً"],
    description: "شقة رائعة في قلب نعمة باي، قريبة من أفضل المطاعم والمراسي. تجربة مميزة في أجمل شواطئ العالم.",
    amenities: ["🌊 قريب من البحر", "❄️ تكييف", "📶 واي فاي", "🍳 مطبخ", "🔐 أمن", "🌴 حديقة مشتركة"],
    extraServices: [{ name: "رحلة بحرية", price: 600 }, { name: "سنوركل", price: 200 }]
  }
];

// ===== LANDS DATA =====
const LANDS = [
  {
    id: 101,
    title: "أرض زراعية على ترعة النيل",
    city: "دمياط", area: "كفر البطيخ", type: "زراعية",
    price: 85000, priceUnit: "الفدان", size: 3, sizeUnit: "فدان",
    rating: 4.8, reviews: 12, available: true,
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80&auto=format&fit=crop",
    badges: ["زراعية", "على ترعة"],
    description: "أرض زراعية خصبة على ترعة مياه. مناسبة لزراعة الخضروات والفاكهة. تربة جيدة ومياه وفيرة. تصلح للبيع أو الإيجار الزراعي.",
    features: ["💧 مياه ري وفيرة", "🌱 تربة خصبة", "🛣️ طريق ممهد", "📋 أوراق رسمية", "🌿 صالحة للخضروات", "🌾 صالحة للحبوب"]
  },
  {
    id: 102,
    title: "قطعة أرض بناء",
    city: "الإسكندرية", area: "برج العرب", type: "بناء",
    price: 450000, priceUnit: "القطعة", size: 300, sizeUnit: "م²",
    rating: 4.9, reviews: 8, available: true,
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format&fit=crop",
    badges: ["للبناء", "موقع مميز"],
    description: "قطعة أرض مميزة بمنطقة برج العرب المتوسعة. تصلح لبناء فيلا أو عمارة سكنية. تطل على طريق رئيسي.",
    features: ["🏗️ تصلح للبناء", "🛣️ على طريق رئيسي", "💡 كهرباء وصرف", "📋 رخصة بناء متاحة", "🌍 موقع استراتيجي"]
  },
  {
    id: 103,
    title: "أراضي نخيل وبستان",
    city: "دمياط", area: "دمياط الجديدة", type: "زراعية",
    price: 120000, priceUnit: "الفدان", size: 5, sizeUnit: "فدان",
    rating: 4.7, reviews: 15, available: true,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
    badges: ["نخيل", "استثمارية"],
    description: "أرض مزروعة بالنخيل والأشجار المثمرة. دخل سنوي ثابت من البلح والفاكهة. استثمار مضمون.",
    features: ["🌴 نخيل مثمر", "💰 دخل سنوي", "💧 ري بالتنقيط", "📋 عقد رسمي", "🚜 طريق للجرارات"]
  }
];

const EXTRAS = {
  "مكيف إضافي": 200, "ثلاجة إضافية": 100,
  "غسالة": 150, "بوتاجاز إضافي": 80, "أثاث إضافي": 120
};
