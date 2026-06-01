// Data structures for the secure Contacts & Hidden Services app

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  group: "العائلة" | "العمل" | "الأصدقاء" | "عام" | "Family" | "Work" | "Friends" | "General";
  avatarColor: string;
}

export interface CallLog {
  id: string;
  contactId?: string;
  name: string; // fallback if not a contacts list
  phone: string;
  timestamp: string;
  type: "incoming" | "outgoing" | "missed";
  duration?: string; // e.g. "01:24"
  recordingId?: string; // points to simulated recording
}

export interface CallRecording {
  id: string;
  contactName: string;
  phone: string;
  duration: string; // e.g. "02:15"
  timestamp: string;
  notes?: string;
  melodyNotes: number[]; // notes frequencies for sound generator
}

export interface SecretNote {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  color: string; // tailwind color class
  category: string;
}

export interface SyntheticTrack {
  id: string;
  title: string;
  titleAr: string;
  artist: string;
  artistAr: string;
  notes: Array<{ note: string; dur: number }>; // notes representation (e.g. C4, E4, G4)
  tempo: number;
}

// Pre-seeded Contacts
export const INITIAL_CONTACTS: Contact[] = [
  {
    id: "c1",
    name: "أحمد العتيبي",
    phone: "0501234567",
    email: "ahmad.otaibi@gmail.com",
    group: "العائلة",
    avatarColor: "bg-blue-600"
  },
  {
    id: "c2",
    name: "سارة الأحمد",
    phone: "0559876543",
    email: "sara.ahmed@yahoo.com",
    group: "العمل",
    avatarColor: "bg-pink-600"
  },
  {
    id: "c3",
    name: "مهندس خالد الحربي",
    phone: "0112233445",
    email: "khalid.harbi@gmail.com",
    group: "العمل",
    avatarColor: "bg-indigo-600"
  },
  {
    id: "c4",
    name: "نورة القحطاني",
    phone: "0554433221",
    email: "noura.q@outlook.com",
    group: "الأصدقاء",
    avatarColor: "bg-emerald-600"
  },
  {
    id: "c5",
    name: "سعيد باوزير",
    phone: "0533344455",
    email: "saeed.bawazir@gmail.com",
    group: "العائلة",
    avatarColor: "bg-amber-600"
  },
  {
    id: "c6",
    name: "فاطمة الهاشمي",
    phone: "0561122334",
    email: "fatima.h@gmail.com",
    group: "الأصدقاء",
    avatarColor: "bg-violet-600"
  }
];

// Pre-seeded Recent Calls
export const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: "l1",
    contactId: "c1",
    name: "أحمد العتيبي",
    phone: "0501234567",
    timestamp: "اليوم، 12:44 م",
    type: "incoming",
    duration: "01:45",
    recordingId: "rec1"
  },
  {
    id: "l2",
    contactId: "c2",
    name: "سارة الأحمد",
    phone: "0559876543",
    timestamp: "اليوم، 10:15 ص",
    type: "missed"
  },
  {
    id: "l3",
    contactId: "c3",
    name: "مهندس خالد الحربي",
    phone: "0112233445",
    timestamp: "أمس، 8:30 م",
    type: "outgoing",
    duration: "03:12",
    recordingId: "rec2"
  },
  {
    id: "l4",
    name: "رقم غير معروف",
    phone: "0590001112",
    timestamp: "28 مايو، 4:10 م",
    type: "incoming",
    duration: "00:40"
  }
];

// Pre-seeded Call Recordings (with dynamic melody frequencies so Web Audio can play real sounds!)
export const INITIAL_RECORDINGS: CallRecording[] = [
  {
    id: "rec1",
    contactName: "أحمد العتيبي",
    phone: "0501234567",
    duration: "01:45",
    timestamp: "اليوم، 12:44 م",
    notes: "مناقشة بخصوص اجتماع العائلة وتنسيق الاستراحة نهاية الأسبوع.",
    melodyNotes: [261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 261.63] // C4, D4, E4, F4, G4, F4, E4, C4
  },
  {
    id: "rec2",
    contactName: "مهندس خالد الحربي",
    phone: "0112233445",
    duration: "03:12",
    timestamp: "أمس، 8:30 م",
    notes: "تسليم رخصة السيرفر البرمجية للمشروع الجديد والتأكيد على حماية الأكواد.",
    melodyNotes: [440.00, 493.88, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00] // A4, B4, C5, D5, E5, D5, C5, A4
  }
];

// Pre-seeded Secret Diaries inside Secured Area
export const INITIAL_SECRET_NOTES: SecretNote[] = [
  {
    id: "n1",
    title: "🔒 خطة الأكواد والمفاتيح السرية",
    content: "إن الكود السري الذي استعمله للدخول المزدوج هو *#777# لتخصيص الأرقام وإلغاء القيود. لا أحد يستطيع فتح هذه المذكرة دون نقر كود الاتصال على الواجهة الرئيسية. خطة التطوير القادمة هي نشر هذا الإصدار على خوادم آمنة بالكامل للاتصالات المشفرة.",
    timestamp: "2026-06-01 19:40",
    color: "from-zinc-900 to-amber-950 border-amber-600/30 text-amber-100",
    category: "سري للغاية"
  },
  {
    id: "n2",
    title: "💵 حساب البنك وبيانات الأمان",
    content: "الحساب البنكي السري لدى البنك الأهلي السعودي:\nالآيبان: SA938000001092837482938\nاسم المستخدم: security_vault_2026\nتأكد دائماً من تنشيط خاصية تسجيل المكالمات الأوتوماتيكي لحماية الاستفسارات الاستثمارية.",
    timestamp: "2026-05-31 08:12",
    color: "from-zinc-900 to-rose-950 border-rose-600/30 text-rose-150",
    category: "أعمال ماليّة"
  },
  {
    id: "n3",
    title: "🎧 مسودة أفكار الموسيقى الإلكترونية",
    content: "أرغب في تشبيك جهاز تجميع الصوت Synth مع كرت الصوت الأندرويد، وتجربة موجة مخصصة (Triangle Wave) بنطاق 120Hz للحصول على صوت جهير فائق العمق عند تفعيل مشغل الموسيقى السري.",
    timestamp: "2026-05-15 14:00",
    color: "from-zinc-900 to-emerald-950 border-emerald-600/30 text-emerald-100",
    category: "أفكار إبداعية"
  }
];

// 100% Genuine Synthesizer tracks playing real audio oscillators using Web Audio API!
export const SYNTHETIC_TRACKS: SyntheticTrack[] = [
  {
    id: "song1",
    title: "ألوان الاسترخاء - Lofi Study Oasis",
    titleAr: "ألحان الاسترخاء - نغمة لوفاي هادئة",
    artist: "Synth Dreamer",
    artistAr: "مُحاكي الأحلام الإلكتروني",
    tempo: 100,
    notes: [
      { note: "C4", dur: 1 }, { note: "E4", dur: 1 }, { note: "G4", dur: 1 }, { note: "B4", dur: 1 },
      { note: "A4", dur: 1 }, { note: "C4", dur: 1 }, { note: "E4", dur: 1 }, { note: "G4", dur: 1 },
      { note: "F4", dur: 1 }, { note: "A4", dur: 1 }, { note: "C5", dur: 1 }, { note: "E4", dur: 1 },
      { note: "G4", dur: 2 }, { note: "C4", dur: 1 }, { note: "G3", dur: 1 }
    ]
  },
  {
    id: "song2",
    title: "شلالات الكريستال السحرية - Magic Bells",
    titleAr: "شلالات الكريستال السحرية - نواقيس هادئة",
    artist: "Ambient Voyager",
    artistAr: "رحّالة الأكوان الرقمية",
    tempo: 120,
    notes: [
      { note: "E5", dur: 0.5 }, { note: "G5", dur: 0.5 }, { note: "A5", dur: 0.5 }, { note: "B5", dur: 1 },
      { note: "A5", dur: 0.5 }, { note: "G5", dur: 0.5 }, { note: "E5", dur: 0.5 }, { note: "D5", dur: 1 },
      { note: "C5", dur: 0.5 }, { note: "E5", dur: 0.5 }, { note: "A5", dur: 0.5 }, { note: "G5", dur: 1.5 }
    ]
  },
  {
    id: "song3",
    title: "الرحلة السيبرانية - Cyber Groove Trip",
    titleAr: "الرحلة السيبرانية - إيقاع نشط للمبرمجين",
    artist: "Kernel Operator",
    artistAr: "مُبرمج النواة الحصري",
    tempo: 140,
    notes: [
      { note: "A3", dur: 0.5 }, { note: "A3", dur: 0.5 }, { note: "E4", dur: 0.5 }, { note: "D4", dur: 0.5 },
      { note: "E4", dur: 0.5 }, { note: "G4", dur: 0.5 }, { note: "C4", dur: 0.5 }, { note: "A3", dur: 1 },
      { note: "D4", dur: 0.5 }, { note: "D4", dur: 0.5 }, { note: "F4", dur: 0.5 }, { note: "E4", dur: 1 }
    ]
  }
];

// Dictionary mapping note letters to frequencies
export const NOTE_FREQS: Record<string, number> = {
  "G3": 196.00, "A3": 220.00, "B3": 246.94,
  "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00, "B4": 493.88,
  "C5": 523.25, "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00, "B5": 987.77,
  "C6": 1046.50
};
