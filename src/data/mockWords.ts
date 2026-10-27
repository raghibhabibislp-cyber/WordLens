// Dictionary entries extracted from the original WordLens application.
// This module is the temporary local source behind src/services/dictionary.ts.

export type DictionaryExample = {
  en: string;
  id: string;
};

export type DictionaryMeaning = {
  partOfSpeech: string;
  translation: string;
  definition: string;
  context: string;
  examples: DictionaryExample[];
};

export type DictionaryEntry = {
  word: string;
  phonetic: string;
  catalogNo: string;
  tier: number;
  meanings: DictionaryMeaning[];
};

export const MOCK_WORDS: Record<string, DictionaryEntry> = {
  "run": {
    word: "run",
    phonetic: "/rʌn/",
    catalogNo: "WL-001",
    tier: 1,
    meanings: [
      {
        partOfSpeech: "verb",
        translation: "berlari",
        definition: "To move swiftly on foot at a speed faster than walking.",
        context: "Physical Movement & Sports",
        examples: [
          {
            en: "She likes to run around the park every morning.",
            id: "Dia suka berlari mengelilingi taman setiap pagi."
          },
          {
            en: "We had to run to catch the last train home.",
            id: "Kami harus berlari untuk mengejar kereta terakhir pulang."
          }
        ]
      },
      {
        partOfSpeech: "verb",
        translation: "mengelola / menjalankan",
        definition: "To be in charge of, manage, or direct a business, organization, or project.",
        context: "Business & Management",
        examples: [
          {
            en: "He helps his parents run a small coffee shop in Bandung.",
            id: "Dia membantu orang tuanya mengelola kedai kopi kecil di Bandung."
          }
        ]
      },
      {
        partOfSpeech: "verb",
        translation: "beroperasi / berjalan (program/mesin)",
        definition: "To function, operate, or execute continuously as a machine or computer program.",
        context: "Technology & Machinery",
        examples: [
          {
            en: "This application can run smoothly in any modern browser.",
            id: "Aplikasi ini dapat berjalan lancar di peramban modern mana pun."
          }
        ]
      },
      {
        partOfSpeech: "noun",
        translation: "lari / sesi olahraga lari",
        definition: "An act or spell of running for exercise or leisure.",
        context: "Fitness & Daily Routine",
        examples: [
          {
            en: "Let's go for a quick run before dinner.",
            id: "Mari kita pergi lari sebentar sebelum makan malam."
          }
        ]
      }
    ]
  },
  "light": {
    word: "light",
    phonetic: "/laɪt/",
    catalogNo: "WL-002",
    tier: 1,
    meanings: [
      {
        partOfSpeech: "noun",
        translation: "cahaya / lampu",
        definition: "The natural agent that stimulates sight and makes things visible, or an electric lamp.",
        context: "Physics & Everyday Objects",
        examples: [
          {
            en: "Please turn off the light before leaving the room.",
            id: "Tolong matikan lampu sebelum meninggalkan ruangan."
          }
        ]
      },
      {
        partOfSpeech: "adjective",
        translation: "ringan",
        definition: "Of little weight; not heavy and easy to lift or carry.",
        context: "Weight & Physical Properties",
        examples: [
          {
            en: "This laptop is very light and easy to carry everywhere.",
            id: "Laptop ini sangat ringan dan mudah dibawa ke mana saja."
          }
        ]
      },
      {
        partOfSpeech: "adjective",
        translation: "muda / terang (warna)",
        definition: "Pale or having a considerable amount of white; not dark in shade.",
        context: "Colors & Appearance",
        examples: [
          {
            en: "He wore a light blue shirt to the interview.",
            id: "Dia mengenakan kemeja biru muda ke wawancara tersebut."
          }
        ]
      },
      {
        partOfSpeech: "verb",
        translation: "menyalakan",
        definition: "To make something start burning or shine with fire or electricity.",
        context: "Daily Actions",
        examples: [
          {
            en: "We decided to light a candle during the power outage.",
            id: "Kami memutuskan untuk menyalakan lilin saat listrik padam."
          }
        ]
      }
    ]
  },
  "break": {
    word: "break",
    phonetic: "/breɪk/",
    catalogNo: "WL-003",
    tier: 2,
    meanings: [
      {
        partOfSpeech: "verb",
        translation: "memecahkan / merusak",
        definition: "To separate into pieces as a result of a blow, shock, or strain.",
        context: "Physical Action",
        examples: [
          {
            en: "Be careful not to break the glass vase.",
            id: "Hati-hati jangan sampai memecahkan vas kaca itu."
          }
        ]
      },
      {
        partOfSpeech: "noun",
        translation: "istirahat / jeda",
        definition: "A pause in work or during an activity or event.",
        context: "Work & Study",
        examples: [
          {
            en: "Let's take a fifteen-minute coffee break.",
            id: "Mari kita ambil istirahat minum kopi selama lima belas menit."
          }
        ]
      },
      {
        partOfSpeech: "verb",
        translation: "melanggar (aturan/janji)",
        definition: "To fail to observe a law, regulation, agreement, or promise.",
        context: "Law & Ethics",
        examples: [
          {
            en: "She promised she would never break the rules.",
            id: "Dia berjanji tidak akan pernah melanggar aturan."
          }
        ]
      }
    ]
  },
  "break the ice": {
    word: "break the ice",
    phonetic: "/breɪk ðə aɪs/",
    catalogNo: "WL-004",
    tier: 3,
    meanings: [
      {
        partOfSpeech: "idiom",
        translation: "mencairkan suasana",
        definition: "To do or say something to relieve tension or awkwardness when people meet for the first time.",
        context: "Social Interaction & Meetings",
        examples: [
          {
            en: "The teacher told a funny story to break the ice on the first day of class.",
            id: "Guru itu menceritakan kisah lucu untuk mencairkan suasana di hari pertama kelas."
          },
          {
            en: "Asking about hobbies is a great way to break the ice.",
            id: "Menanyakan tentang hobi adalah cara yang bagus untuk mencairkan suasana."
          }
        ]
      }
    ]
  },
  "give up": {
    word: "give up",
    phonetic: "/ɡɪv ʌp/",
    catalogNo: "WL-005",
    tier: 2,
    meanings: [
      {
        partOfSpeech: "phrasal verb",
        translation: "menyerah",
        definition: "To cease making an effort; to admit defeat and stop trying to do something.",
        context: "Perseverance & Motivation",
        examples: [
          {
            en: "Even when learning grammar feels hard, don't give up.",
            id: "Bahkan ketika belajar tata bahasa terasa sulit, jangan menyerah."
          }
        ]
      },
      {
        partOfSpeech: "phrasal verb",
        translation: "berhenti (kebiasaan)",
        definition: "To stop doing, consuming, or having something habitual.",
        context: "Health & Habits",
        examples: [
          {
            en: "He decided to give up sugary drinks for a month.",
            id: "Dia memutuskan untuk berhenti minum minuman manis selama sebulan."
          }
        ]
      }
    ]
  },
  "bright": {
    word: "bright",
    phonetic: "/braɪt/",
    catalogNo: "WL-006",
    tier: 1,
    meanings: [
      {
        partOfSpeech: "adjective",
        translation: "cerah / terang",
        definition: "Giving out or reflecting a lot of light; shining strongly.",
        context: "Weather & Light",
        examples: [
          {
            en: "We woke up to a bright and sunny morning.",
            id: "Kami bangun di pagi hari yang cerah dan bersinar."
          }
        ]
      },
      {
        partOfSpeech: "adjective",
        translation: "cerdas / pintar",
        definition: "Quick-witted, intelligent, and quick to learn new concepts.",
        context: "Education & Character",
        examples: [
          {
            en: "She is one of the brightest students in the department.",
            id: "Dia adalah salah satu mahasiswa paling cerdas di jurusan tersebut."
          }
        ]
      }
    ]
  },
  "look after": {
    word: "look after",
    phonetic: "/lʊk ˈæftər/",
    catalogNo: "WL-007",
    tier: 2,
    meanings: [
      {
        partOfSpeech: "phrasal verb",
        translation: "merawat / menjaga",
        definition: "To take care of someone or something and make sure they are safe and well.",
        context: "Family & Responsibility",
        examples: [
          {
            en: "Could you look after my cat while I'm away this weekend?",
            id: "Bisakah kamu menjaga kucingku saat aku pergi akhir pekan ini?"
          }
        ]
      }
    ]
  },
  "piece of cake": {
    word: "piece of cake",
    phonetic: "/piːs əv keɪk/",
    catalogNo: "WL-008",
    tier: 3,
    meanings: [
      {
        partOfSpeech: "idiom",
        translation: "sangat mudah / gampang sekali",
        definition: "Something that is very easy to accomplish or complete effortlessly.",
        context: "Informal Conversation & Exams",
        examples: [
          {
            en: "After studying all week, the vocabulary test was a piece of cake.",
            id: "Setelah belajar sepanjang minggu, ujian kosakata itu terasa sangat mudah."
          }
        ]
      }
    ]
  },
  "resilient": {
    word: "resilient",
    phonetic: "/rɪˈzɪliənt/",
    catalogNo: "WL-009",
    tier: 3,
    meanings: [
      {
        partOfSpeech: "adjective",
        translation: "tangguh / cepat pulih",
        definition: "Able to withstand or recover quickly from difficult conditions or setbacks.",
        context: "Psychology & Character",
        examples: [
          {
            en: "Local communities proved resilient after the economic crisis.",
            id: "Masyarakat lokal terbukti tangguh setelah krisis ekonomi tersebut."
          }
        ]
      }
    ]
  },
  "train": {
    word: "train",
    phonetic: "/treɪn/",
    catalogNo: "WL-010",
    tier: 1,
    meanings: [
      {
        partOfSpeech: "noun",
        translation: "kereta api",
        definition: "A series of connected railway carriages or wagons moved by a locomotive.",
        context: "Transportation & Travel",
        examples: [
          {
            en: "The high-speed train arrives at the station at 8:00 AM.",
            id: "Kereta api cepat tiba di stasiun pada pukul 08.00 pagi."
          }
        ]
      },
      {
        partOfSpeech: "verb",
        translation: "melatih / berlatih",
        definition: "To teach a person or animal a particular skill or type of behavior through practice.",
        context: "Sports & Professional Development",
        examples: [
          {
            en: "Athletes train for months before competing in the tournament.",
            id: "Para atlet berlatih selama berbulan-bulan sebelum bertanding di turnamen."
          }
        ]
      }
    ]
  }
};
