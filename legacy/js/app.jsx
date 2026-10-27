const { useState, useEffect, useMemo, useRef, useCallback } = React;

    // ============================================================================
    // 1. SAFE STORAGE WRAPPER & ARCHIVAL TACTILE AUDIO (Typewriter & Page Rustle)
    // ============================================================================
    const memoryStorage = {};

    const SafeStorage = {
      get(key, fallbackValue) {
        try {
          if (typeof window !== "undefined" && window.localStorage) {
            const raw = window.localStorage.getItem(key);
            if (raw !== null) {
              return JSON.parse(raw);
            }
          }
        } catch (err) {
          // Fall back to in-memory storage if localStorage is blocked
        }
        return key in memoryStorage ? memoryStorage[key] : fallbackValue;
      },
      set(key, value) {
        memoryStorage[key] = value;
        try {
          if (typeof window !== "undefined" && window.localStorage) {
            window.localStorage.setItem(key, JSON.stringify(value));
          }
        } catch (err) {
          // Ignore storage write errors
        }
      }
    };

    // Subtle mechanical typewriter key & archival stamp audio (No cartoon pop)
    const ArchivalAudio = {
      ctx: null,
      getContext() {
        if (typeof window === "undefined") return null;
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume().catch(() => {});
        }
        return this.ctx;
      },
      playKeyClick(enabled = true) {
        if (!enabled) return;
        try {
          const ctx = this.getContext();
          if (!ctx) return;
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(190, now);
          osc.frequency.exponentialRampToValueAtTime(95, now + 0.035);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.045);
        } catch (err) {
          // Ignore audio errors
        }
      },
      playBellChord(enabled = true) {
        if (!enabled) return;
        try {
          const ctx = this.getContext();
          if (!ctx) return;
          // Warm acoustic desk bell interval (A4 + E5)
          [440, 659.25].forEach((freq, idx) => {
            const start = ctx.currentTime + idx * 0.09;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.055, start);
            gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.46);
          });
        } catch (err) {
          // Ignore audio errors
        }
      }
    };

    // ============================================================================
    // 2. ISOLATED MOCK DATA (10 Realistic Entries with Archival Catalog Numbers)
    // ============================================================================
    const MOCK_WORDS = {
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

    // ============================================================================
    // 3. ISOLATED ASYNC SEARCH FUNCTION (~800ms delay) & TOLERANT RECOMMENDATIONS
    // ============================================================================
    function computeEditDistance(a, b) {
      const m = a.length;
      const n = b.length;
      const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1,
            dp[i - 1][j - 1] + cost
          );
        }
      }
      return dp[m][n];
    }

    function getSimilarWords(rawQuery) {
      const q = (rawQuery || "").trim().toLowerCase();
      const allKeys = Object.keys(MOCK_WORDS);
      if (!q) return allKeys.slice(0, 5);

      const scored = allKeys.map((key) => {
        const entry = MOCK_WORDS[key];
        let score = 0;
        if (key.includes(q) || q.includes(key)) score += 60;
        if (key.startsWith(q.slice(0, 2))) score += 25;

        const tokens = key.split(/\s+/);
        if (tokens.some((t) => t.startsWith(q) || q.startsWith(t))) score += 40;

        entry.meanings.forEach((m) => {
          if (m.translation.toLowerCase().includes(q)) score += 55;
          if (m.definition.toLowerCase().includes(q)) score += 20;
          if (m.context && m.context.toLowerCase().includes(q)) score += 15;
        });

        const dist = computeEditDistance(q, key);
        score += Math.max(0, 35 - dist * 10);

        return { key, score, mainTranslation: entry.meanings[0]?.translation || "" };
      });

      return scored.sort((a, b) => b.score - a.score).slice(0, 4);
    }

    async function searchWord(query) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const normalized = (query || "").trim().toLowerCase();
      if (!normalized) return null;
      if (MOCK_WORDS[normalized]) return MOCK_WORDS[normalized];

      const reverseMatch = Object.values(MOCK_WORDS).find((entry) =>
        entry.meanings.some((m) =>
          m.translation.toLowerCase().includes(normalized)
        )
      );
      return reverseMatch || null;
    }

    // ============================================================================
    // 4. HELPER UTILITIES & MUTED BOTANICAL PART-OF-SPEECH STYLING
    // ============================================================================
    function createMeaningId(word, partOfSpeech, translation) {
      return `${word}__${partOfSpeech}__${translation}`
        .toLowerCase()
        .replace(/\s+/g, "_");
    }

    function getLexiconTier(word, partOfSpeech) {
      const entry = MOCK_WORDS[(word || "").toLowerCase()];
      if (entry && entry.tier) return entry.tier;
      const pos = (partOfSpeech || "").toLowerCase();
      if (pos === "idiom") return 3;
      if (pos === "phrasal verb") return 2;
      return 1;
    }

    function getCatalogCode(word) {
      const entry = MOCK_WORDS[(word || "").toLowerCase()];
      return entry?.catalogNo || "WL-ARC";
    }

    // Muted, calm archival tags (Sage, Slate, Umber, Terracotta)
    function getPosStyle(partOfSpeech) {
      const pos = (partOfSpeech || "").toLowerCase();
      switch (pos) {
        case "verb":
          return {
            bg: "bg-[#E3EAEF]/70 dark:bg-[#232D34]",
            text: "text-[#2E3F4A] dark:text-[#BFD1DF]",
            border: "border-[#C5D3DD] dark:border-[#364652]",
            dot: "bg-[#475863]"
          };
        case "noun":
          return {
            bg: "bg-[#E4ECE5]/70 dark:bg-[#222D24]",
            text: "text-[#2F4233] dark:text-[#BBD0BF]",
            border: "border-[#C4D5C7] dark:border-[#344638]",
            dot: "bg-[#4A5D4E]"
          };
        case "adjective":
          return {
            bg: "bg-[#EFECE4] dark:bg-[#2B2620]",
            text: "text-[#574631] dark:text-[#D9C7B0]",
            border: "border-[#D8CEBE] dark:border-[#423A30]",
            dot: "bg-[#9E7B4F]"
          };
        case "idiom":
          return {
            bg: "bg-[#F2E6E2] dark:bg-[#30221F]",
            text: "text-[#68382B] dark:text-[#E2B7AB]",
            border: "border-[#DEC5BD] dark:border-[#4A342F]",
            dot: "bg-[#8F5343]"
          };
        case "phrasal verb":
          return {
            bg: "bg-[#EAE7EE] dark:bg-[#28242E]",
            text: "text-[#493E56] dark:text-[#CCC2D9]",
            border: "border-[#D1C9DB] dark:border-[#3D3746]",
            dot: "bg-[#6A5B7B]"
          };
        default:
          return {
            bg: "bg-stoneDesk/60 dark:bg-zinc-800",
            text: "text-espresso dark:text-zinc-300",
            border: "border-stoneDesk dark:border-zinc-700",
            dot: "bg-umber"
          };
      }
    }

    // Tier Indicator using Nib / Roman Numeral Stamp (Strictly NO fruit/orange icons)
    function TierStampBadge({ tier = 1 }) {
      const roman = { 1: "I", 2: "II", 3: "III" };
      const labels = { 1: "Foundation", 2: "Contextual", 3: "Idiomatic" };
      return (
        <span
          className="inline-flex shrink-0 items-center gap-1.5 px-2.5 py-0.5 rounded bg-linen dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder font-mono text-[11px] font-medium whitespace-nowrap text-umber dark:text-[#B8AFA6]"
          title={`Lexicon tier ${roman[tier]}: ${labels[tier]}`}
        >
          <span className="text-brass-ink dark:text-[#C8A97E] font-semibold">
            TIER {roman[tier] || "I"}
          </span>
          <span className="opacity-40">•</span>
          <span>{labels[tier] || "Foundation"}</span>
        </span>
      );
    }

    // ============================================================================
    // 5. EDITORIAL SVG ICONS & SCHOLARLY CAPYBARA ILLUSTRATIONS (NO ORANGES)
    // ============================================================================
    const Icons = {
      Search: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      Speaker: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ),
      Mic: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      ),
      Bookmark: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
      Check: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      Trash: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      ),
      Sun: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
      Moon: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
      ChevronLeft: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      ),
      ChevronRight: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      ),
      FlipCard: ({ className = "w-3.5 h-3.5" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      ),
      SwitchDir: ({ className = "w-4 h-4" }) => (
        <svg aria-hidden="true" focusable="false" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 16V4M7 4L3 8M7 4L11 8" />
          <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    };

    /**
     * ArchivistCapybara (Gambar 2):
     * Standing playful capybara facing right with an orange on its head.
     * When clicked (or celebrating), the capybara jumps happily with a cheerful expression
     * and the orange on its head bounces high into the air.
     */
    function ArchivistCapybara({ state = "idle", mood = "scholar", onClick, className = "w-28 h-28" }) {
      const [jumpTrigger, setJumpTrigger] = useState(false);
      const isHappyJumping = jumpTrigger || state === "celebrating";

      const handleClick = (e) => {
        setJumpTrigger(false);
        setTimeout(() => setJumpTrigger(true), 10);
        setTimeout(() => setJumpTrigger(false), 720);
        if (onClick) onClick(e);
      };

      return (
        <button
          type="button"
          onClick={handleClick}
          className={`relative block select-none cursor-pointer group bg-transparent border-0 p-0 ${className}`}
          title="Kapi — Click to make him jump with joy!"
          aria-label="Kapi the capybara — greet the archivist"
        >
          <svg aria-hidden="true" focusable="false"
            viewBox="0 0 160 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
          >
            {/* Soft Lavender-Blue Floor Shadow (from Image 2) */}
            <ellipse
              cx="78"
              cy="132"
              rx="48"
              ry="7.5"
              fill="#D4DCFF"
              className="dark:opacity-40 transition-transform duration-300"
              style={{
                transform: isHappyJumping ? "scaleX(0.82)" : "scaleX(1)",
                transformOrigin: "78px 132px"
              }}
            />

            {/* Main Capybara Body Group (Jumps when clicked, gentle bob when idle) */}
            <g className={isHappyJumping ? "animate-capy-jump" : "animate-capy-idle"}>
              {/* Back Left & Front Left Legs (Darker caramel shade) */}
              <path
                d="M52 110 L56 127 C57 130 67 130 66 126 L64 111 Z"
                fill="#BD743A"
              />
              <path
                d="M93 111 L96 126 C97 129 107 129 106 125 L103 109 Z"
                fill="#BD743A"
              />

              {/* Back Right & Front Right Legs */}
              <path
                d="M34 112 L42 129 C44 132 56 132 55 128 L53 113 Z"
                fill="#BD743A"
              />
              <path
                d="M82 114 L87 129 C89 132 99 131 98 127 L95 112 Z"
                fill="#BD743A"
              />

              {/* Plump Standing Capybara Body & Head (Warm Sandy Orange #EA9E5B) */}
              <path
                d="M32 76 C52 72 68 69 78 58 C84 51 89 45 99 45 C114 45 136 53 141 68 C144 79 143 93 135 97 C127 100 116 99 113 97 C115 106 111 115 103 120 C97 123 87 123 81 118 C72 111 67 112 53 116 C41 119 33 116 30 107 C26 95 26 78 32 76 Z"
                fill="#EA9E5B"
              />

              {/* Darker Snout Patch on Right (#B97338) */}
              <path
                d="M121 77 C121 63 129 57 139 59 C143 66 144 86 137 96 C133 98 128 98 125 97 C122 91 121 84 121 77 Z"
                fill="#B97338"
              />

              {/* Back Right Ear */}
              <path
                d="M113 44 C115 39 121 41 121 48 Z"
                fill="#C87A3B"
              />

              {/* Main Left Ear & Inner Ear */}
              <ellipse
                cx="93"
                cy="49"
                rx="8"
                ry="7.5"
                transform="rotate(-15 93 49)"
                fill="#B97137"
              />
              <path
                d="M90 48 C93 50 96 52 97 54"
                stroke="#36190B"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Eye & Facial Expression (Playful Happy ^ when clicked vs Calm Closed Eye) */}
              {isHappyJumping ? (
                <g>
                  {/* Happy Cheerful Curved Eye */}
                  <path
                    d="M106 65 C108 61 113 61 115 65"
                    stroke="#36190B"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Cute Rosy Blush */}
                  <ellipse cx="109" cy="71" rx="4.5" ry="2.5" fill="#F08A76" opacity="0.65" />
                </g>
              ) : (
                /* Calm Horizontal Oval Eye (from Image 2) */
                <ellipse
                  cx="111"
                  cy="65"
                  rx="4.8"
                  ry="1.6"
                  transform="rotate(4 111 65)"
                  fill="#36190B"
                />
              )}

              {/* Snout 'Y' Nose & Mouth Line */}
              <path
                d={
                  isHappyJumping
                    ? "M130 69 L134 74 L138 69 M134 74 L134 85 C134 89 129 92 126 90"
                    : "M130 69 L134 74 L138 69 M134 74 L134 87 C134 90 131 93 129 94"
                }
                stroke="#36190B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Clean Underbelly & Leg Crease Outlines (Body fur marks removed) */}
              <path
                d="M52 119 C52 116 57 114 64 112 M78 109 C80 112 82 114 85 115 M96 119 C99 115 103 111 106 109"
                stroke="#36190B"
                strokeWidth="2.1"
                strokeLinecap="round"
              />

              {/* Top Head Line Under the Orange */}
              <path
                d="M101 45 C106 46 112 46 116 44"
                stroke="#36190B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* The Playful Orange on Top of Kapi's Head (Jumps higher when clicked!) */}
            <g className={isHappyJumping ? "animate-orange-jump" : "animate-orange-idle"}>
              {/* Orange Fruit Body */}
              <path
                d="M108 32 C102 31 97 34 97 40 C97 45 102 46 108 46 C114 46 118 45 118 40 C118 34 113 31 108 32 Z"
                fill="#FFA31A"
              />
              {/* Stem & Green Leaf */}
              <path
                d="M107 32 C106 29 105 27 104 26"
                stroke="#2E6F40"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M106 29 C108 25 113 24 114 27 C114 29 110 31 106 29 Z"
                fill="#388E4A"
              />
            </g>
          </svg>
        </button>
      );
    }

    /**
     * SleepingBookCapybara (Gambar 3):
     * Capybara sleeping peacefully on an open book with floating "Zzz" letters,
     * used in the recall room setup & empty states.
     */
    function SleepingBookCapybara({ className = "w-28 h-28" }) {
      return (
        <div
          className={`relative select-none flex items-center justify-center ${className}`}
          aria-hidden="true"
        >
          <svg aria-hidden="true" focusable="false"
            viewBox="0 0 220 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
          >
            {/* Floating Zzz Letters */}
            <g className="animate-zzz">
              <path
                d="M18 54 L31 49 L22 72 L36 67"
                stroke="#3B2314"
                strokeWidth="4.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M46 37 L58 34 L50 52 L63 48"
                stroke="#3B2314"
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M73 26 L83 25 L76 38 L86 37"
                stroke="#3B2314"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Open Book Base Cover (Soft Blue-Grey Spine & Edges) */}
            <path
              d="M12 150 L54 157 L106 177 L156 154 L96 135 Z"
              fill="#8FA6C4"
            />
            {/* Open Book Cream Pages */}
            <path
              d="M16 146 C34 144 48 148 56 155 C74 147 94 149 107 171 L153 150 L102 128 C84 126 68 131 56 138 C44 132 30 131 16 135 Z"
              fill="#FBF6EA"
              stroke="#4A2E1B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            {/* Book Page Layer Lines */}
            <path
              d="M16 141 C34 140 48 144 56 151 C73 144 92 146 106 165 L149 146"
              stroke="#4A2E1B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M56 155 C53 158 56 161 60 159"
              stroke="#4A2E1B"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Back Left Ear */}
            <path
              d="M74 73 C68 61 73 53 81 56 C86 58 88 64 87 70 Z"
              fill="#D9A16C"
            />

            {/* Main Sleeping Capybara Body (Warm Tan #D9A16C) */}
            <path
              d="M34 103 C38 86 56 74 78 70 C92 67 104 68 117 72 C136 64 166 64 188 79 C207 93 213 118 205 142 C199 152 184 156 166 156 C144 156 121 153 96 147 C74 142 46 141 37 132 C31 124 31 112 34 103 Z"
              fill="#D9A16C"
            />

            {/* Darker Brown Snout Patch (#8C5E3C) */}
            <path
              d="M34 103 C39 94 50 94 56 104 C62 114 64 128 60 137 C49 139 39 136 35 127 C31 119 31 110 34 103 Z"
              fill="#8C5E3C"
            />

            {/* Snout Heart Nose & Mouth Line */}
            <path
              d="M35 106 C38 108 40 109 41 112 C42 109 44 106 47 104"
              stroke="#3B2314"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M41 112 L46 131 C48 134 53 135 56 132"
              stroke="#3B2314"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Sleeping Closed Eye & Soft Pink Cheek Blush */}
            <path
              d="M74 91 C78 96 84 96 89 90"
              stroke="#3B2314"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse
              cx="81"
              cy="106"
              rx="9"
              ry="5.5"
              transform="rotate(-8 81 106)"
              fill="#F3B8AD"
              opacity="0.85"
            />

            {/* Front Right Ear & Inner Ear */}
            <path
              d="M96 72 C96 59 105 55 111 60 C115 64 113 72 108 76"
              fill="#D9A16C"
            />
            <path
              d="M99 73 C99 63 105 60 109 63 C111 66 109 72 105 75 Z"
              fill="#9E6E49"
            />
            <path
              d="M75 72 C84 69 93 68 100 69 M109 71 C114 73 118 76 121 79"
              stroke="#3B2314"
              strokeWidth="2.3"
              strokeLinecap="round"
            />

            {/* Front Arm & Dark Brown Paw Resting on Book */}
            <path
              d="M123 115 C121 122 118 127 114 130 C105 129 96 131 90 135 L103 148 C117 150 134 148 143 136"
              fill="#D9A16C"
            />
            <path
              d="M96 131 C86 134 79 140 80 144 C81 147 85 147 88 146 C87 149 91 151 95 149 C96 151 101 151 104 148 L113 139 C108 134 102 132 96 131 Z"
              fill="#8C5E3C"
            />
            <path
              d="M123 115 C121 122 118 127 114 130 M95 130 C106 128 117 128 126 131 M116 146 C128 149 138 144 144 134"
              stroke="#3B2314"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Hind Leg Curve & Dark Brown Back Foot */}
            <path
              d="M152 146 C149 149 151 154 155 154 C155 157 160 159 164 157 C166 160 172 160 176 157 L203 144 C188 146 168 145 152 146 Z"
              fill="#8C5E3C"
            />
            <path
              d="M178 96 C159 99 149 116 156 136 C160 143 169 146 179 145"
              stroke="#3B2314"
              strokeWidth="2.3"
              strokeLinecap="round"
              fill="none"
            />

            {/* Subtle Fur Dashes on Back */}
            <path
              d="M132 72 L138 71 M148 70 L154 71 M129 82 L135 83 M168 79 L174 81 M184 86 L189 89 M168 92 L173 94 M192 108 L195 113 M162 124 L167 127"
              stroke="#9E6E49"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    }

    /**
     * ReadingBookCapybara:
     * Uses the supplied capybara reading artwork exactly as-is. The base image
     * is never redrawn, cropped, or recolored; all life comes from wrapper
     * transforms plus a few small overlay ornaments for correct and incorrect
     * answers.
     */
    function ReadingBookCapybara({ className = "w-28 h-28", mood = "idle" }) {
      const moodClass =
        mood === "correct" ? "is-correct" : mood === "incorrect" ? "is-incorrect" : "is-idle";

      return (
        <div
          className={`capy-reader relative select-none flex items-center justify-center ${moodClass} ${className}`}
          aria-hidden="true"
        >
          <span className="capy-reader__halo" aria-hidden="true" />
          <span className="capy-reader__burst" aria-hidden="true" />

          <div className="capy-reader__scene">
            <img
              src="assets/capybara-reading.png"
              alt=""
              width="537"
              height="465"
              className="capy-reader__image"
              draggable="false"
              decoding="async"
            />

            {/* Warm sparkles for a correct answer */}
            <svg
              className="capy-reader__sparkles"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="#C8A97E">
                <path d="M31 14L33.5 22L41 24.5L33.5 27L31 35L28.5 27L21 24.5L28.5 22Z" />
                <path d="M168 6L170 12L176 14L170 16L168 22L166 16L160 14L166 12Z" />
                <path d="M183 43L184.5 48L189.5 49.5L184.5 51L183 56L181.5 51L176.5 49.5L181.5 48Z" />
              </g>
              <g fill="#9E7B4F" opacity="0.8">
                <circle cx="180" cy="28" r="1.8" />
                <circle cx="24" cy="47" r="1.5" />
                <circle cx="157" cy="20" r="1.2" />
              </g>
            </svg>

            {/* A sympathetic sweat bead for a miss */}
            <svg
              className="capy-reader__sweat"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 1.5C12 1.5 3.5 12.2 3.5 19.4C3.5 24.6 7.3 29 12 29C16.7 29 20.5 24.6 20.5 19.4C20.5 12.2 12 1.5 12 1.5Z"
                fill="#A9CAD9"
                stroke="#475863"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M8.2 20C8.2 17.5 9.6 15.1 11.5 12.9"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      );
    }

    /**
     * MeadowRestingCapybara:
     * Calm botanical illustration inspired by Reference Image 3 (Capybara resting on grass)
     * and Reference Image 2 (Quiet sky & clouds), used for empty states / not-found states.
     */
    function MeadowRestingCapybara({ className = "w-48 h-32" }) {
      return (
        <div className={`relative mx-auto select-none ${className}`} aria-hidden="true">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Soft Archival Sky & Cloud Silhouette (Inspired by Ref Image 2) */}
            <rect x="16" y="12" width="208" height="126" rx="16" fill="#E8E3D9" fillOpacity="0.55" />
            <path
              d="M65 110C58 88 64 52 84 44C78 34 88 26 98 32C110 28 134 28 146 32C156 26 166 34 160 44C178 52 184 88 176 110Z"
              fill="#FCFBF7"
              fillOpacity="0.8"
            />

            {/* Botanical Grass Bed (Inspired by Ref Image 3) */}
            <path
              d="M38 122C28 119 34 113 44 114C39 109 50 107 60 111C75 106 165 106 180 111C190 107 201 110 195 114C206 114 210 120 200 122C182 127 58 127 38 122Z"
              fill="#C4D5C7"
              stroke="#221E1C"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Resting Capybara Figure */}
            <path
              d="M78 86C78 68 92 56 114 56C136 56 154 68 154 88C154 106 144 116 116 116H84C78 112 78 98 78 86Z"
              fill="#A98467"
              stroke="#221E1C"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            {/* Snout & Closed Peaceful Eye */}
            <rect x="82" y="64" width="20" height="22" rx="8" fill="#7A5946" stroke="#221E1C" strokeWidth="2" />
            <circle cx="89" cy="71" r="1.6" fill="#221E1C" />
            <circle cx="96" cy="71" r="1.6" fill="#221E1C" />
            <path d="M108 69H115" stroke="#221E1C" strokeWidth="2.2" strokeLinecap="round" />
            <ellipse cx="122" cy="57" rx="6" ry="4" fill="#7F5F48" stroke="#221E1C" strokeWidth="2.2" />

            {/* Front Paws Resting on Grass (Ref Image 3) */}
            <path d="M96 98V116M103 98V116" stroke="#221E1C" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M128 98V116M135 98V116" stroke="#221E1C" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    // ============================================================================
    // 6. TACTILE LIBRARY INDEX CARD COMPONENT (3D FLIP + KEYBOARD ACCESSIBLE)
    // ============================================================================
    function LibraryIndexCard({ item, index, total, onPronounce, onInspect, soundEnabled }) {
      const [flipped, setFlipped] = useState(false);
      const pointerStartRef = useRef(null);
      const suppressFlipRef = useRef(false);
      const posStyle = getPosStyle(item.partOfSpeech);
      const tier = getLexiconTier(item.word, item.partOfSpeech);
      const catalogNo = getCatalogCode(item.word);

      const handleFlip = () => {
        ArchivalAudio.playKeyClick(soundEnabled);
        setFlipped((prev) => !prev);
      };

      /*
       * The rail scrolls horizontally. Track pointer travel so a swipe never
       * becomes the click that flips a card by accident.
       */
      const handlePointerDown = (event) => {
        pointerStartRef.current = { x: event.clientX, y: event.clientY };
        suppressFlipRef.current = false;
      };

      const handlePointerMove = (event) => {
        if (!pointerStartRef.current) return;
        const dx = event.clientX - pointerStartRef.current.x;
        const dy = event.clientY - pointerStartRef.current.y;
        if (Math.hypot(dx, dy) > 10) {
          suppressFlipRef.current = true;
        }
      };

      const handlePointerUp = () => {
        pointerStartRef.current = null;
      };

      const handlePointerCancel = () => {
        pointerStartRef.current = null;
        suppressFlipRef.current = false;
      };

      const handleCardClick = () => {
        if (suppressFlipRef.current) {
          suppressFlipRef.current = false;
          return;
        }
        handleFlip();
      };

      return (
        <article
          aria-label={`Catalog card ${index + 1} of ${total}: ${item.word} (${item.partOfSpeech})`}
          onClick={handleCardClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className="perspective-1000 w-72 sm:w-80 h-[17rem] sm:h-64 shrink-0 cursor-pointer select-none group rounded-[14px] focus-within:ring-2 focus-within:ring-sage"
        >
          <div
            className={`flip-card-inner ${
              flipped ? "is-flipped" : ""
            } rounded-[14px] shadow-index-card`}
          >
            {/* FRONT SIDE: Classic Library Index Card with Top Red/Terracotta Header Line & Brass Rod Hole */}
            <div className="flip-card-front bg-parchment dark:bg-nightCard ruled-card-bg border-2 border-[#C8BFA8] dark:border-[#3D362E] p-5 flex flex-col justify-between relative overflow-hidden">
              {/* Top Archival Ruled Line */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-terracotta/40 dark:border-terracotta/50">
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline font-mono text-[11px] font-semibold text-umber dark:text-[#B8AFA6]">
                    {catalogNo}
                  </span>
                  <TierStampBadge tier={tier} />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPronounce(item.word);
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="btn-tactile w-11 h-11 rounded-full bg-sageLight dark:bg-[#253127] text-espresso dark:text-[#D5E3D7] border border-sage/40 flex items-center justify-center"
                  title={`Listen to the pronunciation of "${item.word}"`}
                  aria-label={`Listen to the pronunciation of ${item.word}`}
                >
                  <Icons.Speaker className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Center Headword */}
              <div className="my-auto py-1">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <h3 className="text-2xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB] tracking-tight">
                    {item.word}
                  </h3>
                  {item.phonetic && (
                    <span className="font-mono text-xs text-umber dark:text-[#B8AFA6]">
                      {item.phonetic}
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${posStyle.dot}`} aria-hidden="true" />
                    <span className="capitalize">{item.partOfSpeech}</span>
                  </span>
                  {item.context && (
                    <span className="text-[11px] text-umber dark:text-[#A59C94] truncate">
                      • {item.context}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Footer with Classic Catalog Punch Hole */}
              <div className="pt-2 border-t border-stoneDesk dark:border-nightBorder flex items-center justify-between gap-2 text-[11px] font-mono text-umber dark:text-[#A59C94]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  aria-expanded={flipped}
                  aria-label={`Flip card for ${item.word}`}
                  className="inline-flex min-h-11 items-center gap-1.5 text-espresso dark:text-[#D9C7B0] font-sans font-medium hover:text-terracotta dark:hover:text-[#E2B7AB]"
                >
                  <Icons.FlipCard className="w-3.5 h-3.5 text-brass-ink" />
                  <span>Flip Card</span>
                </button>
                {/* Brass Catalog Rod Hole */}
                <span className="w-3 h-3 rounded-full bg-linen dark:bg-nightDesk border border-[#B5AC99] dark:border-zinc-700 inline-block" aria-hidden="true" />
                <span>
                  {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* BACK SIDE: Complete Contextual Translation & Unclamped Bilingual Example */}
            <div className="flip-card-back bg-[#F8F5EC] dark:bg-[#231F1B] border-2 border-brass/70 p-4 sm:p-5 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-stoneDesk dark:border-nightBorder shrink-0">
                <span className="font-mono text-[10px] uppercase tracking-wider text-sage dark:text-[#98B49E] font-semibold">
                  MEANING NOTE // {item.partOfSpeech}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspect(item.word);
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="inline-flex min-h-11 items-center text-[11px] font-medium text-espresso dark:text-[#D9C7B0] underline hover:text-terracotta"
                >
                  Open Monograph
                  <span aria-hidden="true"> →</span>
                  <span className="sr-only"> for {item.word}</span>
                </button>
              </div>

              {/* Scrollable full text area so long examples never get cut off.
                  It is focusable so keyboard users can reach and scroll it. */}
              <div
                onClick={(e) => e.stopPropagation()}
                role="group"
                aria-label={`Meaning details and example for ${item.word}`}
                tabIndex={0}
                className="space-y-1.5 my-auto overflow-y-auto max-h-32 pr-1 cursor-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-sage rounded-sm"
              >
                <h3 lang="id" className="text-lg font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB] leading-snug">
                  {item.meaning}
                </h3>
                {item.definition && (
                  <p className="text-[11px] text-umber dark:text-[#B8AFA6] leading-relaxed">
                    {item.definition}
                  </p>
                )}
                {item.example?.en && (
                  <div className="p-2.5 rounded-lg bg-parchment dark:bg-nightDesk border-l-2 border-sage space-y-0.5">
                    <p className="text-xs font-medium text-espresso dark:text-[#EAE4DC] leading-relaxed">
                      "{item.example.en}"
                    </p>
                    <p lang="id" className="text-[11px] text-umber dark:text-[#A59C94] italic leading-relaxed">
                      "{item.example.id}"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-umber dark:text-[#A59C94] shrink-0 pt-1 border-t border-stoneDesk dark:border-nightBorder">
                <span>Archived: {item.dateAdded}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  aria-expanded={flipped}
                  aria-label={`Show the front side of the card for ${item.word}`}
                  className="inline-flex min-h-11 items-center text-espresso dark:text-[#D9C7B0] font-sans font-medium underline hover:text-terracotta dark:hover:text-[#E2B7AB]"
                >
                  Front Side ↺
                </button>
              </div>
            </div>
          </div>
        </article>
      );
    }

    // ============================================================================
    // 7. VIEW 1: MEJA LEKSIKON (LEXICON DESK + INDEX CARD CATALOG DRAWER)
    // ============================================================================
    function LexiconDeskView({
      query,
      setQuery,
      onSearch,
      isLoading,
      result,
      hasSearched,
      lastSearchedTerm,
      searchHistory,
      onClearHistory,
      savedWords,
      onSaveMeaning,
      isMeaningSaved,
      onPronounce,
      isSpeaking,
      mascotState,
      setMascotState,
      onNavigate,
      onLoadStarterWords,
      soundEnabled,
      onGreetArchivist
    }) {
      const [langDirection, setLangDirection] = useState("en-id");
      const [switchRotated, setSwitchRotated] = useState(false);
      const [isListeningMic, setIsListeningMic] = useState(false);
      const [activeCardIndex, setActiveCardIndex] = useState(0);
      const carouselRef = useRef(null);
      const typingTimeoutRef = useRef(null);

      const availableWords = Object.keys(MOCK_WORDS);
      const similarSuggestions = useMemo(
        () => getSimilarWords(lastSearchedTerm),
        [lastSearchedTerm]
      );

      // Mobile "Word of the Day": one single-word entry, chosen deterministically
      // from the calendar date so it stays stable throughout the day.
      const today = new Date();
      const todayLabel = today
        .toLocaleDateString("en-US", { month: "short", day: "numeric" })
        .toUpperCase();
      const dailyWordKeys = availableWords.filter((word) => !word.includes(" "));
      const dailySeed = Number(
        `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(
          today.getDate()
        ).padStart(2, "0")}`
      );
      const dailyWord =
        MOCK_WORDS[dailyWordKeys[dailySeed % dailyWordKeys.length]] ||
        MOCK_WORDS[availableWords[0]];
      const dailyMeaning = dailyWord.meanings[0];

      const handleDailyWord = () => {
        ArchivalAudio.playKeyClick(soundEnabled);
        onSearch(dailyWord.word);
      };

      const mascotCopy =
        mascotState === "typing"
          ? {
              label: "OBSERVATION LENS ACTIVE",
              message: "Kapi examines the entry you are typing through his magnifying lens."
            }
          : mascotState === "processing"
          ? {
              label: "EXAMINING THE INDEX...",
              message: "Opening the monograph pages and phonetic transcription..."
            }
          : mascotState === "greeting"
          ? {
              label: "KAPI SAYS HELLO",
              message:
                "Kapi looks up from the ledger, adjusts his glasses, and wishes you a pleasant study session."
            }
          : mascotState === "celebrating"
          ? {
              label: "CARD ARCHIVED",
              message: "The new entry has been stamped and filed in the catalog drawer."
            }
          : {
              label: "A QUIET READING DESK",
              message:
                "Enjoying a warm cup of coffee while keeping you company during your vocabulary study."
            };

      useEffect(() => {
        if (savedWords.length > 0 && activeCardIndex >= savedWords.length) {
          setActiveCardIndex(savedWords.length - 1);
        }
      }, [savedWords.length, activeCardIndex]);

      const handleInputChange = (e) => {
        const val = e.target.value.slice(0, 120);
        setQuery(val);
        if (!isLoading) {
          setMascotState("typing");
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setMascotState("idle");
          }, 900);
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query);
      };

      const handleSwitchLanguages = () => {
        ArchivalAudio.playKeyClick(soundEnabled);
        setSwitchRotated((prev) => !prev);
        setLangDirection((prev) => (prev === "en-id" ? "id-en" : "en-id"));
      };

      const handleVoiceMic = () => {
        ArchivalAudio.playKeyClick(soundEnabled);
        if (
          typeof window !== "undefined" &&
          ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
        ) {
          try {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRec();
            recognition.lang = langDirection === "en-id" ? "en-US" : "id-ID";
            setIsListeningMic(true);
            setMascotState("typing");
            recognition.onresult = (event) => {
              const transcript = event.results[0][0].transcript.replace(/[.,!?]/g, "");
              setQuery(transcript);
              setIsListeningMic(false);
              onSearch(transcript);
            };
            recognition.onerror = () => {
              setIsListeningMic(false);
              setMascotState("idle");
            };
            recognition.onend = () => {
              setIsListeningMic(false);
            };
            recognition.start();
            return;
          } catch (err) {
            // Fallback below
          }
        }
        setIsListeningMic(true);
        setMascotState("typing");
        const sampleVoiceWords = ["resilient", "break the ice", "piece of cake", "look after", "light"];
        const randomPick = sampleVoiceWords[Math.floor(Math.random() * sampleVoiceWords.length)];
        setTimeout(() => {
          setIsListeningMic(false);
          setQuery(randomPick);
          onSearch(randomPick);
        }, 850);
      };

      const scrollToCardIndex = (targetIdx) => {
        if (!carouselRef.current || savedWords.length === 0) return;
        const clamped = Math.max(0, Math.min(savedWords.length - 1, targetIdx));
        ArchivalAudio.playKeyClick(soundEnabled);
        setActiveCardIndex(clamped);
        const cardWidth = 320;
        carouselRef.current.scrollTo({
          left: clamped * cardWidth,
          behavior: "smooth"
        });
      };

      const scrollCarousel = (dir) => {
        const nextIdx =
          dir === "left"
            ? Math.max(0, activeCardIndex - 1)
            : Math.min(savedWords.length - 1, activeCardIndex + 1);
        scrollToCardIndex(nextIdx);
      };

      const handleCarouselScroll = () => {
        if (!carouselRef.current || savedWords.length === 0) return;
        const scrollLeft = carouselRef.current.scrollLeft;
        const approxCardWidth = 310;
        const idx = Math.round(scrollLeft / approxCardWidth);
        const clamped = Math.max(0, Math.min(savedWords.length - 1, idx));
        if (clamped !== activeCardIndex) {
          setActiveCardIndex(clamped);
        }
      };

      return (
        <div className="space-y-2 sm:space-y-7 animate-fade-slide">
          {/* =================================================================== */}
          {/* STUDY HEADER — MOBILE FOLIO + WORD OF THE DAY; FULL DESK FROM SM   */}
          {/* =================================================================== */}
          <section
            className="bg-parchment dark:bg-nightCard rounded-2xl p-2.5 sm:p-6 lg:p-7 border border-stoneDesk dark:border-nightBorder shadow-archival"
            aria-labelledby="lexicon-title"
          >
            <div className="flex items-center justify-between gap-2.5 sm:gap-5 md:gap-6">
              <div className="min-w-0 text-left max-w-xl">
                {/* Mobile folio strip replaces the fuller badge to keep one calm line. */}
                <div className="sm:hidden flex items-center justify-between gap-2 border-b border-stoneDesk dark:border-nightBorder pb-1.5 font-mono text-[9px] leading-none uppercase text-umber dark:text-[#B8AFA6]">
                  <span className="tracking-[0.08em]">Monograph Series</span>
                  <span className="tracking-[0.12em] text-brass-ink dark:text-[#C8A97E]">{todayLabel}</span>
                </div>

                {/* Tablet and desktop keep the original full badge. */}
                <div className="hidden sm:flex w-fit max-w-full flex-wrap items-center gap-x-1 sm:gap-x-2 px-1.5 sm:px-3 py-1 rounded bg-linen dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder font-mono text-[9px] leading-tight tracking-normal sm:text-[11px] sm:leading-normal sm:tracking-wider uppercase text-umber dark:text-[#B8AFA6]">
                  <span>MONOGRAPH SERIES // EN–ID</span>
                  <span aria-hidden="true">•</span>
                  <span>CONTEXTUAL STUDY</span>
                </div>
                <h1
                  id="lexicon-title"
                  className="mt-2 sm:mt-2.5 text-[17px] sm:text-2xl lg:text-3xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB] leading-tight sm:leading-snug"
                >
                  Lexicon &amp; Contextual Meaning.
                </h1>
                <p className="hidden sm:block mt-2.5 text-sm leading-relaxed text-umber dark:text-[#B8AFA6]">
                  Trace how English words shift meaning across parts of speech, situations, and idioms with{" "}
                  <span className="font-semibold text-espresso dark:text-[#EAE4DC]">
                    Kapi the Librarian
                  </span>
                  —then file each sense in your personal catalog drawer.
                </p>
              </div>

              {/* Kapi stays present on phones; the desk note returns at desktop width. */}
              <div className="flex items-center gap-2.5 sm:gap-3.5 bg-linen/90 dark:bg-nightDesk p-1 sm:p-3 rounded-xl border border-stoneDesk dark:border-nightBorder shrink-0">
                <ArchivistCapybara
                  state={mascotState}
                  onClick={onGreetArchivist}
                  className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shrink-0"
                />
                <div
                  className="sr-only lg:not-sr-only space-y-1 max-w-[180px]"
                  aria-live="polite"
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-sage dark:text-[#98B49E] font-semibold">
                    {mascotCopy.label}
                  </div>
                  <p className="text-xs text-espresso dark:text-[#EAE4DC] leading-relaxed">
                    {mascotCopy.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Word of the Day: one compact daily specimen linking into the lexicon. */}
            <button
              type="button"
              onClick={handleDailyWord}
              className="sm:hidden mt-1.5 flex min-h-11 w-full items-center justify-between gap-2 rounded-r-lg border-l-2 border-brass/70 bg-linen/75 dark:bg-nightDesk/75 py-1 pl-2.5 pr-2 text-left btn-tactile"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[7.5px] uppercase leading-none tracking-[0.14em] text-brass-ink dark:text-[#C8A97E]">
                  Word of the day
                </span>
                <span className="mt-0.5 flex min-w-0 items-baseline gap-1.5">
                  <span className="truncate font-serif-editorial text-[16px] font-semibold leading-none text-espresso dark:text-[#F5F2EB]">
                    {dailyWord.word}
                  </span>
                  <span className="shrink-0 font-mono text-[8.5px] leading-none text-umber dark:text-[#B8AFA6]">
                    {dailyWord.phonetic}
                  </span>
                </span>
              </span>
              <span className="flex min-w-0 shrink-0 items-center gap-1.5">
                <span className="max-w-[5.5rem] truncate font-sans text-[11px] font-medium leading-none text-sage dark:text-[#98B49E]">
                  {dailyMeaning.translation}
                </span>
                <span aria-hidden="true" className="font-mono text-[11px] leading-none text-umber dark:text-[#B8AFA6]">
                  →
                </span>
              </span>
            </button>
          </section>

          {/* =================================================================== */}
          {/* TWO-COLUMN EDITORIAL DESK: SEARCH INQUIRY & MONOGRAPH BREAKDOWN     */}
          {/* =================================================================== */}
          <section
            className="desk-grid"
            aria-label="Lexicon search and monograph workspace"
          >
            {/* LEFT PANEL: SPECIMEN INQUIRY & CATALOG INDEX (5 Columns) */}
            <div className="desk-grid__inquiry bg-parchment dark:bg-nightCard rounded-2xl p-2.5 sm:p-5 lg:p-6 border border-stoneDesk dark:border-nightBorder shadow-archival flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="visually-hidden">Lexicon search and specimen index</h2>
                <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="inline-flex min-w-0 items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 lg:px-3 py-1 rounded bg-slateLight dark:bg-[#232D34] text-espresso dark:text-[#D5E2EC] border border-[#C5D3DD] dark:border-[#364652] text-[11px] sm:text-xs font-medium">
                    <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-riverSlate dark:bg-[#8CA7BA]" aria-hidden="true" />
                    <span>
                      {langDirection === "en-id"
                        ? "English → Indonesian"
                        : "Indonesian → English"}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={handleSwitchLanguages}
                    className="btn-tactile min-h-11 px-2.5 lg:px-3 py-1 rounded border border-stoneDesk dark:border-nightBorder bg-linen dark:bg-nightDesk text-espresso dark:text-[#EAE4DC] text-xs font-mono inline-flex items-center gap-1.5 hover:border-brass"
                    title="Switch search direction"
                  >
                    <Icons.SwitchDir
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        switchRotated ? "rotate-180" : ""
                      }`}
                    />
                    <span>{langDirection === "en-id" ? "EN/ID" : "ID/EN"}</span>
                    <span className="sr-only">
                      — switch search direction. Current direction:{" "}
                      {langDirection === "en-id" ? "English to Indonesian" : "Indonesian to English"}
                    </span>
                  </button>
                </div>

                {/* Main Interactive Input (2px tactile border) */}
                <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3" role="search" aria-busy={isLoading}>
                  <div className="relative">
                    <label htmlFor="lexicon-query" className="visually-hidden">
                      Search the contextual lexicon
                    </label>
                    <textarea
                      id="lexicon-query"
                      rows="2"
                      maxLength={120}
                      value={query}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (query.trim()) onSearch(query);
                        }
                      }}
                      placeholder={
                        langDirection === "en-id"
                          ? "Type a word, phrasal verb, or idiom... (e.g. run, light, break the ice, resilient)"
                          : "Type an Indonesian meaning to find its English equivalent... (e.g. berlari, ringan, tangguh)"
                      }
                      className="w-full p-3.5 sm:p-4 rounded-xl bg-linen/70 dark:bg-nightDesk border-2 border-[#B5AC99] dark:border-[#4A423B] focus:border-espresso dark:focus:border-[#C8A97E] text-base font-medium text-espresso dark:text-[#F5F2EB] placeholder:text-umber/60 dark:placeholder:text-[#8C827A] focus:outline-none resize-none transition-colors"
                      aria-describedby="lexicon-search-note lexicon-character-count"
                      autoComplete="off"
                    />
                  </div>

                  <p
                    id="lexicon-search-note"
                    className="sr-only sm:not-sr-only sm:text-[11px] text-umber dark:text-[#A59C94] leading-relaxed"
                  >
                    Desk note: focused on unpacking the meaning of single words, phrasal verbs, and idioms within their contexts.
                  </p>

                  {/* Action Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 sm:pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleVoiceMic}
                        className={`btn-tactile min-h-11 px-2.5 sm:px-3 py-2 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 ${
                          isListeningMic
                            ? "bg-sage text-white border-sage"
                            : "bg-linen dark:bg-nightDesk text-espresso dark:text-[#EAE4DC] border-stoneDesk dark:border-nightBorder hover:border-brass"
                        }`}
                        title="Use voice dictation"
                        aria-pressed={isListeningMic}
                      >
                        <Icons.Mic className="w-3.5 h-3.5" />
                        <span>{isListeningMic ? "Listening..." : "Dictate"}</span>
                        <span className="sr-only">
                          {isListeningMic
                            ? " — listening for voice input"
                            : " — start voice dictation"}
                        </span>
                      </button>

                      {query && (
                        <button
                          type="button"
                          onClick={() => {
                            ArchivalAudio.playKeyClick(soundEnabled);
                            setQuery("");
                          }}
                          className="btn-tactile min-h-11 px-3 py-2 rounded-lg bg-linen dark:bg-nightDesk text-umber dark:text-[#B8AFA6] hover:text-espresso border border-stoneDesk dark:border-nightBorder text-xs font-mono"
                          aria-label="Clear the search query"
                        >
                          ✕ Clear
                        </button>
                      )}

                      <span id="lexicon-character-count" className="font-mono text-[11px] text-umber dark:text-[#8C827A]">
                        {query.length}/120
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !query.trim()}
                      className="btn-tactile flex-1 sm:flex-none sm:w-full xl:w-auto min-h-11 px-2.5 sm:px-5 py-2.5 rounded-lg bg-espresso hover:bg-[#36302D] dark:bg-[#EAE4DC] dark:hover:bg-white text-parchment dark:text-espresso disabled:opacity-40 font-medium text-xs whitespace-nowrap inline-flex items-center justify-center gap-2"
                    >
                      <Icons.Search className="w-3.5 h-3.5" />
                      <span>{isLoading ? "Examining..." : "Examine Entry"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Curated Specimen Index & Recent Inquiries (1px subtle divider) */}
              <div className="space-y-3 pt-4 border-t border-stoneDesk dark:border-nightBorder">
                <div className="space-y-1.5">
                  <div
                    id="available-specimens-label"
                    className="font-mono text-[10px] uppercase tracking-wider text-umber dark:text-[#A59C94]"
                  >
                    AVAILABLE SPECIMEN INDEX ({availableWords.length} ENTRIES)
                  </div>
                  <div
                    className="flex flex-wrap gap-1.5"
                    role="group"
                    aria-labelledby="available-specimens-label"
                  >
                    {availableWords.map((word) => {
                      const isCurrent = lastSearchedTerm.toLowerCase() === word.toLowerCase();
                      return (
                        <button
                          key={word}
                          type="button"
                          onClick={() => {
                            ArchivalAudio.playKeyClick(soundEnabled);
                            onSearch(word);
                          }}
                          aria-pressed={isCurrent}
                          className={`btn-tactile px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                            isCurrent
                              ? "bg-espresso text-parchment border-espresso dark:bg-[#EAE4DC] dark:text-espresso"
                              : "bg-linen dark:bg-nightDesk text-espresso/85 dark:text-[#D5CFC7] border-stoneDesk dark:border-nightBorder hover:border-brass"
                          }`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {searchHistory.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stoneDesk/60 dark:border-nightBorder/60">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        id="search-history-label"
                        className="font-mono text-[10px] uppercase text-umber dark:text-[#A59C94]"
                      >
                        History:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-labelledby="search-history-label">
                        {searchHistory.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => onSearch(item)}
                            className="px-2 py-0.5 rounded text-[11px] font-mono bg-linen/80 dark:bg-nightDesk text-umber dark:text-[#B8AFA6] hover:text-espresso dark:hover:text-white border border-stoneDesk dark:border-nightBorder"
                            aria-label={`Search again for ${item}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onClearHistory}
                      className="font-mono text-[11px] text-umber hover:text-terracotta dark:text-[#A59C94] underline"
                      aria-label="Clear search history"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL: MONOGRAPH BREAKDOWN SHEET (7 Columns) */}
            <div
              className="desk-grid__monograph bg-parchment dark:bg-nightCard rounded-2xl p-4 sm:p-5 lg:p-6 border border-stoneDesk dark:border-nightBorder shadow-archival flex flex-col justify-between"
              aria-labelledby="monograph-sheet-label"
              aria-busy={isLoading}
            >
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-stoneDesk dark:border-nightBorder">
                <h2 id="monograph-sheet-label" className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-sage dark:text-[#98B49E]">
                    MONOGRAPH SHEET //
                  </span>
                  <span className="font-mono text-xs font-normal text-umber dark:text-[#B8AFA6]">
                    {result && !isLoading ? result.catalogNo || "WL-ARC" : "READY"}
                  </span>
                </h2>

                {result && !isLoading && (
                  <TierStampBadge tier={result.tier || 1} />
                )}
              </div>

              <div className="my-auto py-4" aria-live="polite">
                {isLoading ? (
                  <div className="py-12 text-center space-y-3 animate-pulse" role="status">
                    <div className="w-14 h-14 mx-auto rounded-full bg-linen dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder flex items-center justify-center text-brass-ink">
                      <Icons.Search className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]">
                        Searching the lexicon archive and contextual examples...
                      </h3>
                      <p className="text-xs font-mono text-umber dark:text-[#A59C94]">
                        LOADING PHONETICS & PART-OF-SPEECH VARIANTS
                      </p>
                    </div>
                  </div>
                ) : !hasSearched ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-base font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]">
                      Select or type an entry in the left panel to examine it.
                    </p>
                    <p className="text-xs text-umber dark:text-[#A59C94]">
                      Polysemous entries such as "run", "light", and "break" are available, along with the idiom "break the ice".
                    </p>
                  </div>
                ) : !result ? (
                  /* Calm Botanical Not Found State + Fuzzy Similar Recommendations */
                  <div className="py-4 text-center space-y-4">
                    <MeadowRestingCapybara className="w-48 h-28" />
                    <div className="space-y-1 max-w-md mx-auto">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-terracotta dark:text-[#D99B8C] font-semibold">
                        ENTRY NOT RECORDED IN THE LOCAL ARCHIVE
                      </span>
                      <h3 className="text-lg font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]">
                        No monograph found for "{lastSearchedTerm}"
                      </h3>
                      <p className="text-xs text-umber dark:text-[#B8AFA6] leading-relaxed">
                        This offline catalog contains 10 deeply curated entries. Did you mean to examine one of the nearby entries below?
                      </p>
                    </div>

                    {similarSuggestions.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-linen dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder space-y-2 max-w-md mx-auto">
                        <div className="font-mono text-[10px] uppercase text-umber dark:text-[#A59C94]">
                          Nearby Entry Recommendations:
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                          {similarSuggestions.map((sug) => (
                            <button
                              key={sug.key}
                              type="button"
                              onClick={() => onSearch(sug.key)}
                              aria-label={`Search for ${sug.key}, meaning ${sug.mainTranslation}`}
                              className="btn-tactile px-3 py-1.5 rounded-lg text-xs font-mono bg-parchment dark:bg-nightCard text-espresso dark:text-[#F5F2EB] border border-brass/60 inline-flex items-center gap-1.5"
                            >
                              <span className="font-semibold">{sug.key}</span>
                              <span lang="id" className="text-[11px] font-sans text-umber dark:text-[#B8AFA6]">
                                ({sug.mainTranslation})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Complete Monograph Headword + Numbered Contextual Senses */
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-linen/80 dark:bg-nightDesk p-4 rounded-xl border border-stoneDesk dark:border-nightBorder">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h2 className="text-2xl sm:text-3xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]">
                          {result.word}
                        </h2>
                        <span className="font-mono text-sm text-umber dark:text-[#C8A97E]">
                          {result.phonetic}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onPronounce(result.word)}
                        aria-pressed={isSpeaking}
                        className={`btn-tactile px-3.5 py-2 rounded-lg border text-xs font-medium inline-flex items-center gap-2 ${
                          isSpeaking
                            ? "bg-sage text-white border-sage"
                            : "bg-sageLight dark:bg-[#253127] text-espresso dark:text-[#D5E3D7] border-sage/40 hover:border-sage"
                        }`}
                      >
                        <Icons.Speaker className="w-4 h-4" />
                        <span>Pronounce (en-US)</span>
                        <span className="sr-only"> for {result.word}</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {result.meanings.map((meaningObj, idx) => {
                        const posStyle = getPosStyle(meaningObj.partOfSpeech);
                        const saved = isMeaningSaved(
                          result.word,
                          meaningObj.partOfSpeech,
                          meaningObj.translation
                        );

                        return (
                          <article
                            key={`${result.word}-${idx}`}
                            aria-label={`Meaning ${idx + 1}: ${meaningObj.translation}`}
                            className="p-4 rounded-xl bg-linen/45 dark:bg-nightDesk/70 border border-stoneDesk dark:border-nightBorder space-y-3 hover:border-brass/70 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs text-brass-ink dark:text-[#C8A97E] font-semibold">
                                  {String(idx + 1).padStart(2, "0")}.
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${posStyle.dot}`} aria-hidden="true" />
                                  <span className="capitalize">{meaningObj.partOfSpeech}</span>
                                </span>
                                {meaningObj.context && (
                                  <span className="font-mono text-[11px] text-umber dark:text-[#A59C94]">
                                    [{meaningObj.context}]
                                  </span>
                                )}
                              </div>

                              {/* Primary CTA: Stamp & Archive to Index Card Drawer */}
                              <button
                                type="button"
                                disabled={saved}
                                onClick={() =>
                                  onSaveMeaning(result.word, result.phonetic, meaningObj)
                                }
                                className={`btn-tactile min-h-11 w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 border-2 ${
                                  saved
                                    ? "bg-sageLight/70 dark:bg-[#222D24] text-espresso dark:text-[#BBD0BF] border-sage/40 cursor-default"
                                    : "bg-parchment hover:bg-stoneDesk/60 dark:bg-nightCard text-espresso dark:text-[#F5F2EB] border-espresso dark:border-[#C8A97E]"
                                }`}
                              >
                                {saved ? (
                                  <>
                                    <Icons.Check className="w-3.5 h-3.5 text-sage" />
                                    <span>Archived in Catalog</span>
                                  </>
                                ) : (
                                  <>
                                    <Icons.Bookmark className="w-3.5 h-3.5 text-brass-ink" />
                                    <span>+ Archive Card</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div>
                              <h3 lang="id" className="text-lg font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]">
                                {meaningObj.translation}
                              </h3>
                              <p className="text-xs text-umber dark:text-[#B8AFA6] mt-0.5 leading-relaxed">
                                {meaningObj.definition}
                              </p>
                            </div>

                            {meaningObj.examples && meaningObj.examples.length > 0 && (
                              <div className="space-y-1.5 pt-2 border-t border-stoneDesk/70 dark:border-nightBorder">
                                {meaningObj.examples.map((ex, exIdx) => (
                                  <div
                                    key={exIdx}
                                    className="pl-3 border-l-2 border-brass/70 py-0.5 space-y-0.5"
                                  >
                                    <p className="text-xs font-medium text-espresso dark:text-[#EAE4DC] leading-relaxed">
                                      "{ex.en}"
                                    </p>
                                    <p lang="id" className="text-xs text-umber dark:text-[#A59C94] italic leading-relaxed">
                                      "{ex.id}"
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* =================================================================== */}
          {/* BOTTOM DRAWER: LACI KARTU INDEKS AKTIF (3D FLIP CATALOG CARDS)      */}
          {/* =================================================================== */}
          <section
            className="bg-parchment dark:bg-nightCard rounded-2xl p-6 sm:p-7 border border-stoneDesk dark:border-nightBorder shadow-archival space-y-5"
            aria-labelledby="catalog-cards-title"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-mono text-[11px] uppercase tracking-wider text-brass-ink dark:text-[#C8A97E] font-semibold">
                  INDEX CARD DRAWER // {savedWords.length} ARCHIVED CARDS
                </div>
                <h2
                  id="catalog-cards-title"
                  className="text-xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]"
                >
                  Library Catalog Cards (Click a Card to Flip)
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {savedWords.length < 5 && (
                  <button
                    type="button"
                    onClick={onLoadStarterWords}
                    className="btn-tactile px-3.5 py-2 rounded-lg bg-linen dark:bg-nightDesk text-espresso dark:text-[#EAE4DC] border border-stoneDesk dark:border-nightBorder text-xs font-medium hover:border-brass"
                  >
                    + Load 5 Specimen Cards
                  </button>
                )}

                {savedWords.length > 0 && (
                  <div className="inline-flex items-center gap-2 bg-linen dark:bg-nightDesk px-3 py-1 rounded-lg border border-stoneDesk dark:border-nightBorder">
                    <button
                      type="button"
                      onClick={() => scrollCarousel("left")}
                      disabled={activeCardIndex <= 0}
                      className="btn-tactile w-7 h-7 rounded bg-parchment dark:bg-nightCard disabled:opacity-35 border border-stoneDesk dark:border-nightBorder flex items-center justify-center text-espresso dark:text-[#EAE4DC]"
                      aria-label="Previous card"
                    >
                      <Icons.ChevronLeft className="w-4 h-4" />
                    </button>

                    <span
                      className="font-mono text-xs text-espresso dark:text-[#D9C7B0] px-1"
                      aria-live="polite"
                    >
                      Card {Math.min(activeCardIndex + 1, savedWords.length)} of {savedWords.length}
                    </span>

                    <button
                      type="button"
                      onClick={() => scrollCarousel("right")}
                      disabled={activeCardIndex >= savedWords.length - 1}
                      className="btn-tactile w-7 h-7 rounded bg-parchment dark:bg-nightCard disabled:opacity-35 border border-stoneDesk dark:border-nightBorder flex items-center justify-center text-espresso dark:text-[#EAE4DC]"
                      aria-label="Next card"
                    >
                      <Icons.ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onNavigate("dictionary")}
                  className="btn-tactile px-4 py-2 rounded-lg bg-espresso dark:bg-[#EAE4DC] text-parchment dark:text-espresso font-medium text-xs"
                >
                  Open Full Catalog Drawer ({savedWords.length}) →
                </button>
              </div>
            </div>

            {savedWords.length === 0 ? (
              <div className="p-8 rounded-xl bg-linen/70 dark:bg-nightDesk border border-dashed border-stoneDesk dark:border-nightBorder text-center space-y-3">
                <p className="text-base font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]">
                  The index card drawer is still empty.
                </p>
                <p className="text-xs text-umber dark:text-[#A59C94] max-w-md mx-auto">
                  Click <span className="font-semibold">[ + Archive Card ]</span> on the monograph sheet above, or load the 5 specimen cards to try the interactive catalog.
                </p>
                <button
                  type="button"
                  onClick={onLoadStarterWords}
                  className="btn-tactile px-4 py-2 rounded-lg bg-espresso dark:bg-[#EAE4DC] text-parchment dark:text-espresso text-xs font-medium"
                >
                  + Load 5 Specimen Cards
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  ref={carouselRef}
                  onScroll={handleCarouselScroll}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      scrollCarousel("left");
                    } else if (e.key === "ArrowRight") {
                      e.preventDefault();
                      scrollCarousel("right");
                    }
                  }}
                  className="card-rail"
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="Archived index cards. Use the left and right arrow keys to browse."
                  tabIndex={0}
                >
                  {savedWords.map((item, idx) => (
                    <div key={item.id} className="snap-start shrink-0">
                      <LibraryIndexCard
                        item={item}
                        index={idx}
                        total={savedWords.length}
                        onPronounce={onPronounce}
                        onInspect={(w) => onSearch(w)}
                        soundEnabled={soundEnabled}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      );
    }

    // ============================================================================
    // 8. VIEW 2: LACI KATALOG (FULL ARCHIVAL DICTIONARY)
    // ============================================================================
    function CatalogArchiveView({
      savedWords,
      onDeleteWord,
      onPronounce,
      onNavigate,
      onQuickSearch,
      onLoadStarterWords,
      soundEnabled
    }) {
      const [searchFilter, setSearchFilter] = useState("");
      const [posFilter, setPosFilter] = useState("all");

      const posCategories = ["all", "verb", "noun", "adjective", "idiom", "phrasal verb"];

      const filteredWords = useMemo(() => {
        return savedWords.filter((entry) => {
          const matchesPos =
            posFilter === "all" || entry.partOfSpeech.toLowerCase() === posFilter.toLowerCase();

          const q = searchFilter.trim().toLowerCase();
          if (!q) return matchesPos;

          const matchesQuery =
            entry.word.toLowerCase().includes(q) ||
            entry.meaning.toLowerCase().includes(q) ||
            (entry.definition && entry.definition.toLowerCase().includes(q)) ||
            (entry.example?.en && entry.example.en.toLowerCase().includes(q)) ||
            (entry.example?.id && entry.example.id.toLowerCase().includes(q));

          return matchesPos && matchesQuery;
        });
      }, [savedWords, searchFilter, posFilter]);

      const posCounts = useMemo(() => {
        const counts = { all: savedWords.length };
        posCategories.slice(1).forEach((cat) => {
          counts[cat] = savedWords.filter((w) => w.partOfSpeech.toLowerCase() === cat).length;
        });
        return counts;
      }, [savedWords]);

      return (
        <div className="space-y-6 animate-fade-slide">
          <section
            className="bg-parchment dark:bg-nightCard rounded-2xl p-6 sm:p-7 border border-stoneDesk dark:border-nightBorder shadow-archival space-y-5"
            aria-labelledby="catalog-title"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-mono text-[11px] uppercase tracking-wider text-brass-ink dark:text-[#C8A97E] font-semibold">
                  PERSONAL INDEX ARCHIVE // {savedWords.length} CARDS
                </div>
                <h1
                  id="catalog-title"
                  className="text-2xl sm:text-3xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]"
                >
                  Vocabulary Catalog Drawer
                </h1>
                <p className="text-xs sm:text-sm text-umber dark:text-[#B8AFA6]">
                  Every contextual vocabulary card stamped and filed with Kapi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {savedWords.length < 5 && (
                  <button
                    type="button"
                    onClick={onLoadStarterWords}
                    className="btn-tactile px-3.5 py-2 rounded-lg bg-linen dark:bg-nightDesk text-espresso dark:text-[#EAE4DC] border border-stoneDesk dark:border-nightBorder text-xs font-medium"
                  >
                    + Load 5 Specimens
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onNavigate("quiz")}
                  className="btn-tactile px-4 py-2.5 rounded-lg bg-espresso dark:bg-[#EAE4DC] text-parchment dark:text-espresso font-medium text-xs"
                >
                  Open Recall Quiz Room →
                </button>
              </div>
            </div>

            {savedWords.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-stoneDesk dark:border-nightBorder">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-umber" aria-hidden="true">
                    <Icons.Search className="w-4 h-4" />
                  </span>
                  <label htmlFor="archive-filter" className="visually-hidden">
                    Filter the vocabulary archive
                  </label>
                  <input
                    id="archive-filter"
                    type="search"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter the archive by word, translation, or example sentence..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-linen dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder focus:border-brass text-sm text-espresso dark:text-[#F5F2EB] focus:outline-none"
                  />
                  {searchFilter && (
                    <button
                      type="button"
                      onClick={() => setSearchFilter("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-umber"
                      aria-label="Clear the archive filter"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div
                  className="flex flex-wrap items-center gap-1.5"
                  role="group"
                  aria-label="Filter by part of speech"
                >
                  {posCategories.map((cat) => {
                    const active = posFilter === cat;
                    const count = posCounts[cat] || 0;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          ArchivalAudio.playKeyClick(soundEnabled);
                          setPosFilter(cat);
                        }}
                        aria-pressed={active}
                        className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors flex items-center gap-1.5 ${
                          active
                            ? "bg-espresso text-parchment border-espresso dark:bg-[#EAE4DC] dark:text-espresso"
                            : "bg-linen dark:bg-nightDesk text-umber dark:text-[#B8AFA6] border-stoneDesk dark:border-nightBorder"
                        }`}
                      >
                        <span>{cat === "all" ? "All Parts of Speech" : cat}</span>
                        <span className="font-mono text-[10px]">
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {savedWords.length === 0 ? (
            <section
              className="bg-parchment dark:bg-nightCard rounded-2xl p-10 text-center border border-stoneDesk dark:border-nightBorder shadow-archival space-y-4"
              aria-labelledby="empty-catalog-title"
            >
              <MeadowRestingCapybara className="w-52 h-32" />
              <div className="space-y-1 max-w-md mx-auto">
                <h2 id="empty-catalog-title" className="text-xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]">
                  No Cards in the Catalog Drawer Yet
                </h2>
                <p className="text-xs sm:text-sm text-umber dark:text-[#B8AFA6]">
                  Study vocabulary at the Lexicon Desk to start building your collection.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate("translator")}
                  className="btn-tactile px-4 py-2.5 rounded-lg bg-espresso dark:bg-[#EAE4DC] text-parchment dark:text-espresso text-xs font-medium"
                >
                  Go to Lexicon Desk
                </button>
                <button
                  type="button"
                  onClick={onLoadStarterWords}
                  className="btn-tactile px-4 py-2.5 rounded-lg bg-sage text-white text-xs font-medium"
                >
                  + Load 5 Specimen Cards
                </button>
              </div>
            </section>
          ) : filteredWords.length === 0 ? (
            <div
              className="bg-parchment dark:bg-nightCard rounded-2xl p-10 text-center border border-stoneDesk dark:border-nightBorder space-y-3"
              role="status"
            >
              <h3 className="text-base font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]">
                No cards match the filter "{searchFilter}"
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSearchFilter("");
                  setPosFilter("all");
                }}
                className="btn-tactile px-4 py-2 rounded-lg bg-linen dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder text-xs font-medium"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <ul className="catalog-grid" aria-label="Archived vocabulary cards">
              {filteredWords.map((item) => {
                const posStyle = getPosStyle(item.partOfSpeech);
                const tier = getLexiconTier(item.word, item.partOfSpeech);
                const catalogNo = getCatalogCode(item.word);

                return (
                  <li key={item.id}>
                    <article
                      aria-label={`${item.word}, ${item.partOfSpeech}: ${item.meaning}`}
                      className="h-full bg-parchment dark:bg-nightCard rounded-xl p-5 border border-stoneDesk dark:border-nightBorder shadow-archival flex flex-col justify-between gap-4 hover:border-brass/70 transition-colors"
                    >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-stoneDesk/70 dark:border-nightBorder">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[11px] text-brass-ink dark:text-[#C8A97E]">
                              {catalogNo}
                            </span>
                            <button
                              type="button"
                              onClick={() => onQuickSearch(item.word)}
                              className="text-xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB] hover:underline"
                              aria-label={`Examine the monograph for ${item.word}`}
                            >
                              {item.word}
                            </button>
                            {item.phonetic && (
                              <span className="font-mono text-xs text-umber dark:text-[#B8AFA6]">
                                {item.phonetic}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => onPronounce(item.word)}
                              className="btn-tactile w-7 h-7 rounded-full bg-sageLight dark:bg-[#253127] text-espresso dark:text-[#D5E3D7] border border-sage/40 flex items-center justify-center"
                              title={`Pronounce ${item.word}`}
                              aria-label={`Pronounce ${item.word} in US English`}
                            >
                              <Icons.Speaker className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${posStyle.dot}`} aria-hidden="true" />
                              <span className="capitalize">{item.partOfSpeech}</span>
                            </span>
                            <TierStampBadge tier={tier} />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteWord(item.id, item.word)}
                          className="btn-tactile p-2 rounded-lg text-umber hover:text-terracotta hover:bg-linen dark:hover:bg-nightDesk transition-colors"
                          title="Remove from Catalog Drawer"
                          aria-label={`Remove the card for ${item.word} from the Catalog Drawer`}
                        >
                          <Icons.Trash className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <p lang="id" className="text-lg font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]">
                          {item.meaning}
                        </p>
                        {item.definition && (
                          <p className="text-xs text-umber dark:text-[#B8AFA6] mt-0.5 leading-relaxed">
                            {item.definition}
                          </p>
                        )}
                      </div>

                      {item.example?.en && (
                        <div className="p-3 rounded-lg bg-linen/75 dark:bg-nightDesk border-l-2 border-sage space-y-0.5">
                          <p className="text-xs font-medium text-espresso dark:text-[#EAE4DC] leading-relaxed">
                            "{item.example.en}"
                          </p>
                          <p lang="id" className="text-[11px] text-umber dark:text-[#A59C94] italic leading-relaxed">
                            "{item.example.id}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-stoneDesk/60 dark:border-nightBorder flex items-center justify-between text-[11px] font-mono text-umber dark:text-[#A59C94]">
                      <span>Archived {item.dateAdded}</span>
                      <button
                        type="button"
                        onClick={() => onQuickSearch(item.word)}
                        className="text-espresso dark:text-[#D9C7B0] font-sans font-medium hover:underline"
                      >
                        Examine Monograph →
                      </button>
                    </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      );
    }

    // ============================================================================
    // 9. VIEW 3: RUANG UJI INGATAN (CUSTOM RANDOM VOCABULARY QUIZ)
    // ============================================================================
    function shuffleArray(array) {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    function buildQuizQuestions(savedWords, requestedCount) {
      if (!savedWords || savedWords.length === 0) return [];
      const validCount = Math.min(Math.max(1, Number(requestedCount) || 1), savedWords.length);
      const selectedItems = shuffleArray(savedWords).slice(0, validCount);

      const distractorPoolSet = new Set();
      savedWords.forEach((item) => {
        if (item.meaning) distractorPoolSet.add(item.meaning);
      });
      Object.values(MOCK_WORDS).forEach((entry) => {
        entry.meanings.forEach((m) => {
          if (m.translation) distractorPoolSet.add(m.translation);
        });
      });
      const allTranslations = Array.from(distractorPoolSet);

      return selectedItems.map((item) => {
        const correctAnswer = item.meaning;
        const wrongCandidates = allTranslations.filter(
          (t) => t.toLowerCase().trim() !== correctAnswer.toLowerCase().trim()
        );
        const distractors = shuffleArray(wrongCandidates).slice(0, 3);
        const options = shuffleArray([correctAnswer, ...distractors]);

        return {
          id: item.id,
          word: item.word,
          phonetic: item.phonetic,
          partOfSpeech: item.partOfSpeech,
          context: item.context,
          definition: item.definition,
          example: item.example,
          correctAnswer,
          options
        };
      });
    }

    function RecallExaminationView({
      savedWords,
      onPronounce,
      onNavigate,
      onLoadStarterWords,
      soundEnabled
    }) {
      const [quizWordCount, setQuizWordCount] = useState(() =>
        Math.min(5, Math.max(1, savedWords.length || 5))
      );
      const [quizState, setQuizState] = useState("setup"); // "setup" | "active" | "summary"
      const [quizQuestions, setQuizQuestions] = useState([]);
      const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
      const [selectedOption, setSelectedOption] = useState(null);
      const [quizAnswers, setQuizAnswers] = useState([]);

      useEffect(() => {
        if (savedWords.length > 0) {
          setQuizWordCount((prev) => Math.min(Math.max(1, Number(prev) || 1), savedWords.length));
        }
      }, [savedWords.length]);

      const presetCounts = useMemo(() => {
        const total = savedWords.length;
        if (total <= 0) return [];
        const candidates = [3, 5, 10].filter((n) => n < total);
        return [...candidates, total];
      }, [savedWords.length]);

      const handleStartQuiz = (customCount) => {
        ArchivalAudio.playKeyClick(soundEnabled);
        const countToUse =
          typeof customCount === "number"
            ? customCount
            : Math.min(Math.max(1, Number(quizWordCount) || 1), savedWords.length);

        const generated = buildQuizQuestions(savedWords, countToUse);
        if (generated.length === 0) return;

        setQuizWordCount(countToUse);
        setQuizQuestions(generated);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setQuizAnswers([]);
        setQuizState("active");
      };

      const handleSelectAnswer = (option) => {
        if (selectedOption !== null) return;
        setSelectedOption(option);

        const currentQ = quizQuestions[currentQuestionIndex];
        const isCorrect = option === currentQ.correctAnswer;

        if (isCorrect) {
          ArchivalAudio.playBellChord(soundEnabled);
        } else {
          ArchivalAudio.playKeyClick(soundEnabled);
        }

        setQuizAnswers((prev) => [
          ...prev,
          {
            question: currentQ,
            selected: option,
            isCorrect
          }
        ]);
      };

      const handleNextQuestion = () => {
        ArchivalAudio.playKeyClick(soundEnabled);
        if (currentQuestionIndex + 1 < quizQuestions.length) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedOption(null);
        } else {
          ArchivalAudio.playBellChord(soundEnabled);
          setQuizState("summary");
        }
      };

      const handleResetSetup = () => {
        ArchivalAudio.playKeyClick(soundEnabled);
        setQuizState("setup");
        setSelectedOption(null);
        setCurrentQuestionIndex(0);
        setQuizAnswers([]);
      };

      const currentQuestion = quizQuestions[currentQuestionIndex] || null;
      const correctCount = quizAnswers.filter((a) => a.isCorrect).length;
      const scorePercentage =
        quizQuestions.length > 0 ? Math.round((correctCount / quizQuestions.length) * 100) : 0;

      if (savedWords.length === 0) {
        return (
          <section
            className="bg-parchment dark:bg-nightCard rounded-2xl p-10 text-center border border-stoneDesk dark:border-nightBorder shadow-archival space-y-4 animate-fade-slide"
            aria-labelledby="quiz-empty-title"
          >
            <h1 className="visually-hidden">Recall Quiz</h1>
            <SleepingBookCapybara className="w-36 h-32 mx-auto" />
            <div className="space-y-1 max-w-md mx-auto">
              <span className="font-mono text-[10px] uppercase tracking-wider text-brass-ink dark:text-[#C8A97E]">
                RECALL ROOM // PREPARATION
              </span>
              <h2
                id="quiz-empty-title"
                className="text-2xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]"
              >
                The Catalog Drawer Has No Cards Yet
              </h2>
              <p className="text-xs sm:text-sm text-umber dark:text-[#B8AFA6]">
                The recall test draws a set of random cards from your Catalog Drawer. Load 5 specimen cards below to begin right away.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={onLoadStarterWords}
                className="btn-tactile px-4 py-2.5 rounded-lg bg-espresso dark:bg-[#EAE4DC] text-parchment dark:text-espresso text-xs font-medium"
              >
                + Load 5 Specimen Cards
              </button>
              <button
                type="button"
                onClick={() => onNavigate("translator")}
                className="btn-tactile px-4 py-2.5 rounded-lg bg-linen dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder text-xs font-medium"
              >
                Go to Lexicon Desk
              </button>
            </div>
          </section>
        );
      }

      if (quizState === "setup") {
        return (
          <section
            className="bg-parchment dark:bg-nightCard rounded-2xl p-6 sm:p-8 border border-stoneDesk dark:border-nightBorder shadow-archival space-y-6 animate-fade-slide"
            aria-labelledby="quiz-setup-title"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-5 border-b border-stoneDesk dark:border-nightBorder">
              <div className="space-y-2 text-center md:text-left">
                <div className="font-mono text-[11px] uppercase tracking-wider text-brass-ink dark:text-[#C8A97E] font-semibold">
                  RANDOM LEXICON EVALUATION // SELECT THE CORRECT ANSWER
                </div>
                <h1
                  id="quiz-setup-title"
                  className="text-2xl sm:text-3xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]"
                >
                  Vocabulary Recall Room
                </h1>
                <p className="text-xs sm:text-sm text-umber dark:text-[#B8AFA6] max-w-xl">
                  Choose how many random cards to draw from the{" "}
                  <span className="font-semibold text-espresso dark:text-[#EAE4DC]">
                    {savedWords.length} archived entries
                  </span>{" "}
                  in your Catalog Drawer, then select the most accurate contextual translation.
                </p>
              </div>
              <SleepingBookCapybara className="w-28 h-28 shrink-0" />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="archival-quiz-count"
                className="block font-mono text-xs uppercase tracking-wider text-umber dark:text-[#B8AFA6]"
              >
                Number of Random Cards to Test (1 – {savedWords.length})
              </label>

              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center rounded-xl border-2 border-espresso dark:border-[#C8A97E] bg-linen dark:bg-nightDesk p-1">
                  <button
                    type="button"
                    onClick={() => {
                      ArchivalAudio.playKeyClick(soundEnabled);
                      setQuizWordCount((prev) => Math.max(1, (Number(prev) || 1) - 1));
                    }}
                    disabled={quizWordCount <= 1}
                    aria-label="Decrease the number of quiz cards"
                    className="btn-tactile w-8 h-8 rounded-lg bg-parchment dark:bg-nightCard disabled:opacity-35 text-espresso dark:text-[#F5F2EB] font-mono text-sm flex items-center justify-center border border-stoneDesk dark:border-nightBorder"
                  >
                    -
                  </button>
                  <input
                    id="archival-quiz-count"
                    type="number"
                    min="1"
                    max={savedWords.length}
                    value={quizWordCount}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === "") {
                        setQuizWordCount("");
                        return;
                      }
                      const parsed = parseInt(raw, 10);
                      if (!isNaN(parsed)) {
                        setQuizWordCount(Math.min(Math.max(1, parsed), savedWords.length));
                      }
                    }}
                    onBlur={() => {
                      if (!quizWordCount || quizWordCount < 1) setQuizWordCount(1);
                    }}
                    className="w-14 text-center bg-transparent font-mono font-semibold text-base text-espresso dark:text-[#F5F2EB] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      ArchivalAudio.playKeyClick(soundEnabled);
                      setQuizWordCount((prev) =>
                        Math.min(savedWords.length, (Number(prev) || 1) + 1)
                      );
                    }}
                    disabled={quizWordCount >= savedWords.length}
                    aria-label="Increase the number of quiz cards"
                    className="btn-tactile w-8 h-8 rounded-lg bg-parchment dark:bg-nightCard disabled:opacity-35 text-espresso dark:text-[#F5F2EB] font-mono text-sm flex items-center justify-center border border-stoneDesk dark:border-nightBorder"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Preset quiz card counts">
                  <span className="font-mono text-xs text-umber dark:text-[#A59C94] mr-1" aria-hidden="true">
                    Preset:
                  </span>
                  {presetCounts.map((val) => {
                    const active = Number(quizWordCount) === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          ArchivalAudio.playKeyClick(soundEnabled);
                          setQuizWordCount(val);
                        }}
                        aria-pressed={active}
                        aria-label={val === savedWords.length ? `All ${val} cards` : `${val} cards`}
                        className={`btn-tactile px-3 py-1.5 rounded-lg text-xs font-mono border ${
                          active
                            ? "bg-espresso text-parchment border-espresso dark:bg-[#EAE4DC] dark:text-espresso"
                            : "bg-linen dark:bg-nightDesk text-espresso dark:text-[#EAE4DC] border-stoneDesk dark:border-nightBorder"
                        }`}
                      >
                        {val === savedWords.length ? `All (${val})` : `${val} Cards`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stoneDesk dark:border-nightBorder flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onNavigate("dictionary")}
                className="text-xs font-medium text-umber dark:text-[#B8AFA6] hover:text-espresso dark:hover:text-white"
              >
                ← Back to Catalog Drawer
              </button>

              <button
                type="button"
                onClick={() => handleStartQuiz()}
                className="btn-tactile px-6 py-2.5 rounded-lg bg-espresso hover:bg-[#36302D] dark:bg-[#EAE4DC] text-parchment dark:text-espresso font-medium text-xs"
              >
                Start Evaluation ({Math.min(Math.max(1, Number(quizWordCount) || 1), savedWords.length)} Random Questions) →
              </button>
            </div>
          </section>
        );
      }

      if (quizState === "active" && currentQuestion) {
        const tier = getLexiconTier(currentQuestion.word, currentQuestion.partOfSpeech);
        const readerMood =
          selectedOption === null
            ? "idle"
            : selectedOption === currentQuestion.correctAnswer
              ? "correct"
              : "incorrect";

        return (
          <section
            className="bg-parchment dark:bg-nightCard rounded-2xl p-6 sm:p-8 border border-stoneDesk dark:border-nightBorder shadow-archival space-y-6 animate-fade-slide"
            aria-labelledby="quiz-question-title"
          >
            <h1 className="visually-hidden">Recall Quiz</h1>
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-umber dark:text-[#B8AFA6]">
                <span>
                  SPECIMEN {String(currentQuestionIndex + 1).padStart(2, "0")} OF{" "}
                  {String(quizQuestions.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={handleResetSetup}
                  className="hover:text-terracotta underline"
                >
                  Change Count / Cancel
                </button>
              </div>
              <div
                className="w-full h-1.5 bg-linen dark:bg-nightDesk rounded-full overflow-hidden"
                role="progressbar"
                aria-label="Quiz progress"
                aria-valuemin={0}
                aria-valuemax={quizQuestions.length}
                aria-valuenow={currentQuestionIndex + 1}
                aria-valuetext={`Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`}
              >
                <div
                  className="h-full bg-sage transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Question Specimen Box */}
            <div className="p-5 sm:p-6 rounded-xl bg-linen/75 dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-parchment dark:bg-nightCard border border-stoneDesk dark:border-nightBorder font-mono text-xs capitalize text-espresso dark:text-[#EAE4DC]">
                    {currentQuestion.partOfSpeech}
                  </span>
                  <TierStampBadge tier={tier} />
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                  <h2
                    id="quiz-question-title"
                    className="text-3xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]"
                  >
                    {currentQuestion.word}
                  </h2>
                  {currentQuestion.phonetic && (
                    <span className="font-mono text-sm text-brass-ink dark:text-[#C8A97E]">
                      {currentQuestion.phonetic}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPronounce(currentQuestion.word)}
                    className="btn-tactile w-11 h-11 rounded-full bg-sageLight dark:bg-[#253127] text-espresso dark:text-[#D5E3D7] border border-sage/40 flex items-center justify-center"
                    title="Pronounce word"
                    aria-label={`Pronounce ${currentQuestion.word} in US English`}
                  >
                    <Icons.Speaker className="w-4 h-4" />
                  </button>
                </div>

                {currentQuestion.definition && (
                  <p className="text-xs text-umber dark:text-[#B8AFA6] max-w-lg leading-relaxed">
                    Contextual definition: "{currentQuestion.definition}"
                  </p>
                )}
              </div>

              <ReadingBookCapybara className="w-32 h-32 shrink-0" mood={readerMood} />
            </div>

            {/* 4 Multiple Choice Options */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              role="group"
              aria-labelledby="quiz-question-title"
            >
              {currentQuestion.options.map((option, idx) => {
                const optionLetter = String.fromCharCode(65 + idx);
                const isAnswered = selectedOption !== null;
                const isChosen = selectedOption === option;
                const isCorrectOption = option === currentQuestion.correctAnswer;

                let btnStyle =
                  "bg-parchment dark:bg-nightCard border-stoneDesk dark:border-nightBorder hover:border-espresso dark:hover:border-[#C8A97E] text-espresso dark:text-[#F5F2EB]";

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle =
                      "bg-sageLight dark:bg-[#222D24] border-sage text-espresso dark:text-[#D5E3D7]";
                  } else if (isChosen && !isCorrectOption) {
                    btnStyle =
                      "bg-[#F4E6E3] dark:bg-[#32211E] border-terracotta text-terracotta dark:text-[#E5B8AD]";
                  } else {
                    btnStyle =
                      "bg-linen/50 dark:bg-nightDesk border-stoneDesk/50 text-umber/50 opacity-60";
                  }
                }

                return (
                  <button
                    key={`${option}-${idx}`}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(option)}
                    className={`btn-tactile p-4 rounded-xl border-2 text-left flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded bg-linen dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder font-mono text-xs font-semibold flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        {optionLetter}
                      </span>
                      <span lang="id" className="text-sm font-medium">{option}</span>
                    </div>
                    {isAnswered && isCorrectOption && (
                      <Icons.Check className="w-4 h-4 text-sage shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div
                className="p-4 rounded-xl bg-linen dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                role="status"
                aria-live="polite"
              >
                <div className="space-y-0.5">
                  <div className="font-mono text-xs font-semibold text-espresso dark:text-[#EAE4DC]">
                    {selectedOption === currentQuestion.correctAnswer
                      ? "✓ CORRECT ANSWER"
                      : `✕ NOT QUITE — CORRECT MEANING: "${currentQuestion.correctAnswer}"`}
                  </div>
                  {currentQuestion.example?.en && (
                    <p className="text-xs text-umber dark:text-[#B8AFA6] italic">
                      Example: "{currentQuestion.example.en}"
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="btn-tactile px-5 py-2.5 rounded-lg bg-espresso dark:bg-[#EAE4DC] text-parchment dark:text-espresso font-medium text-xs shrink-0"
                >
                  {currentQuestionIndex + 1 < quizQuestions.length
                    ? "Next Specimen →"
                    : "View Evaluation Results →"}
                </button>
              </div>
            )}
          </section>
        );
      }

      /* SUMMARY CARD */
      return (
        <section
          className="bg-parchment dark:bg-nightCard rounded-2xl p-6 sm:p-8 border border-stoneDesk dark:border-nightBorder shadow-archival space-y-6 animate-fade-slide"
          aria-labelledby="quiz-summary-title"
        >
          <h1 className="visually-hidden">Recall Quiz</h1>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-stoneDesk dark:border-nightBorder">
            <div className="flex items-center gap-4">
              <ReadingBookCapybara
                className="w-28 h-28 shrink-0"
                mood={scorePercentage >= 70 ? "correct" : "incorrect"}
              />
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-sage dark:text-[#98B49E] font-semibold">
                  EVALUATION REPORT COMPLETE
                </span>
                <h2
                  id="quiz-summary-title"
                  className="text-2xl font-serif-editorial font-semibold text-espresso dark:text-[#F5F2EB]"
                >
                  Final Score: {correctCount} / {quizQuestions.length} ({scorePercentage}%)
                </h2>
                <p className="text-xs text-umber dark:text-[#B8AFA6]">
                  A recap of the random test drawn from your Catalog Drawer.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleStartQuiz(quizQuestions.length)}
                className="btn-tactile px-4 py-2 rounded-lg bg-espresso dark:bg-[#EAE4DC] text-parchment dark:text-espresso text-xs font-medium"
              >
                Retry ({quizQuestions.length} Random Cards)
              </button>
              <button
                type="button"
                onClick={handleResetSetup}
                className="btn-tactile px-4 py-2 rounded-lg bg-linen dark:bg-nightDesk border border-stoneDesk dark:border-nightBorder text-xs font-medium"
              >
                Change Question Count
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3
              id="quiz-answer-details-title"
              className="font-mono text-xs uppercase text-umber dark:text-[#A59C94]"
            >
              Answer Details:
            </h3>
            <ul
              className="divide-y divide-stoneDesk dark:divide-nightBorder border border-stoneDesk dark:border-nightBorder rounded-xl overflow-hidden"
              aria-labelledby="quiz-answer-details-title"
            >
              {quizAnswers.map((item, idx) => (
                <li
                  key={`${item.question.id}-${idx}`}
                  className="p-4 bg-parchment dark:bg-nightCard flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-brass-ink" aria-hidden="true">
                        {String(idx + 1).padStart(2, "0")}.
                      </span>
                      <span className="visually-hidden">Question {idx + 1}:</span>
                      <span className="font-serif-editorial font-semibold text-base text-espresso dark:text-[#F5F2EB]">
                        {item.question.word}
                      </span>
                      <span className="font-mono text-xs text-umber dark:text-[#A59C94]">
                        ({item.question.partOfSpeech})
                      </span>
                    </div>
                    <p className="text-xs text-umber dark:text-[#B8AFA6] pl-6">
                      Correct meaning:{" "}
                      <span lang="id" className="font-medium text-espresso dark:text-[#EAE4DC]">
                        {item.question.correctAnswer}
                      </span>
                    </p>
                  </div>

                  <div className="pl-6 sm:pl-0">
                    {item.isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono bg-sageLight dark:bg-[#222D24] text-espresso dark:text-[#BBD0BF] border border-sage/40">
                        <span aria-hidden="true">✓</span>
                        <span className="visually-hidden">Your correct answer:</span>
                        <span lang="id">{item.selected}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono bg-[#F4E6E3] dark:bg-[#32211E] text-terracotta dark:text-[#E5B8AD] border border-terracotta/40">
                        <span aria-hidden="true">✕</span>
                        <span className="visually-hidden">Your incorrect answer:</span>
                        <span lang="id">{item.selected}</span>
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    }

    // ============================================================================
    // 10. PRIMARY NAVIGATION — HEADER TABS + MOBILE THUMB BAR
    // ============================================================================
    function PrimaryNavigation({ items, activePage, onNavigate, variant = "header" }) {
      const navIcons = {
        translator: Icons.Search,
        dictionary: Icons.Bookmark,
        quiz: Icons.Check
      };

      if (variant === "bottom") {
        return (
          <nav className="wl-bottom-nav" aria-label="Primary">
            {items.map((item) => {
              const isActive = activePage === item.id;
              const Icon = navIcons[item.id] || Icons.Search;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`wl-bottom-nav__item ${isActive ? "is-active" : ""}`}
                >
                  <span className="relative" aria-hidden="true">
                    <Icon className="w-5 h-5" />
                    {typeof item.badge === "number" && (
                      <span className="wl-bottom-nav__badge">{item.badge}</span>
                    )}
                  </span>
                  <span>{item.label}</span>
                  {typeof item.badge === "number" && (
                    <span className="sr-only">, {item.badge} archived cards</span>
                  )}
                </button>
              );
            })}
          </nav>
        );
      }

      return (
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-linen/90 dark:bg-nightDesk p-1 rounded-xl border border-[#CFC7B8] dark:border-nightBorder"
          aria-label="Primary"
        >
          {items.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`btn-tactile min-h-11 px-2.5 lg:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-espresso text-parchment dark:bg-[#EAE4DC] dark:text-espresso shadow-sm"
                    : "text-umber dark:text-[#B8AFA6] hover:text-espresso dark:hover:text-white"
                }`}
              >
                <span className="hidden lg:inline font-mono text-[10px]">{item.code}.</span>
                <span className="whitespace-nowrap">{item.label}</span>
                {typeof item.badge === "number" && (
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                      isActive
                        ? "bg-parchment/20 text-parchment dark:bg-espresso/15 dark:text-espresso"
                        : "bg-stoneDesk dark:bg-nightCard text-espresso dark:text-[#D9C7B0]"
                    }`}
                    aria-hidden="true"
                  >
                    {item.badge}
                  </span>
                )}
                {typeof item.badge === "number" && (
                  <span className="sr-only">archived cards</span>
                )}
              </button>
            );
          })}
        </nav>
      );
    }

    // ============================================================================
    // 11. MAIN APP COMPONENT
    // ============================================================================
    function App() {
      const [activePage, setActivePage] = useState("translator"); // "translator" | "dictionary" | "quiz"

      // Each tab behaves like a new desk page; start at the masthead.
      useEffect(() => {
        if (typeof window !== "undefined") {
          const rootEl = document.documentElement;
          const previousBehavior = rootEl.style.scrollBehavior;
          rootEl.style.scrollBehavior = "auto";
          window.scrollTo(0, 0);
          rootEl.style.scrollBehavior = previousBehavior;
        }
      }, [activePage]);

      const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = SafeStorage.get("wordlens_theme", null);
        if (savedTheme === "dark") return true;
        if (savedTheme === "light") return false;
        return false;
      });

      useEffect(() => {
        const rootEl = document.documentElement;
        if (darkMode) {
          rootEl.classList.add("dark");
        } else {
          rootEl.classList.remove("dark");
        }
        SafeStorage.set("wordlens_theme", darkMode ? "dark" : "light");
      }, [darkMode]);

      const [soundEnabled, setSoundEnabled] = useState(() =>
        SafeStorage.get("wordlens_sound", true)
      );
      useEffect(() => {
        SafeStorage.set("wordlens_sound", soundEnabled);
      }, [soundEnabled]);

      // Initialize with 4 curated entries so the Index Card Catalog Drawer is immediately usable
      const [savedWords, setSavedWords] = useState(() => {
        const existing = SafeStorage.get("wordlens_dictionary", null);
        if (existing && Array.isArray(existing) && existing.length > 0) {
          return existing;
        }
        const todayStr = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
        return [
          {
            id: createMeaningId("run", "verb", "berlari"),
            word: "run",
            phonetic: "/rʌn/",
            meaning: "berlari",
            definition: "To move swiftly on foot at a speed faster than walking.",
            partOfSpeech: "verb",
            context: "Physical Movement & Sports",
            example: MOCK_WORDS["run"].meanings[0].examples[0],
            dateAdded: todayStr
          },
          {
            id: createMeaningId("break the ice", "idiom", "mencairkan suasana"),
            word: "break the ice",
            phonetic: "/breɪk ðə aɪs/",
            meaning: "mencairkan suasana",
            definition: "To do or say something to relieve tension or awkwardness when people meet for the first time.",
            partOfSpeech: "idiom",
            context: "Social Interaction & Meetings",
            example: MOCK_WORDS["break the ice"].meanings[0].examples[0],
            dateAdded: todayStr
          },
          {
            id: createMeaningId("light", "adjective", "ringan"),
            word: "light",
            phonetic: "/laɪt/",
            meaning: "ringan",
            definition: "Of little weight; not heavy and easy to lift or carry.",
            partOfSpeech: "adjective",
            context: "Weight & Physical Properties",
            example: MOCK_WORDS["light"].meanings[1].examples[0],
            dateAdded: todayStr
          },
          {
            id: createMeaningId("resilient", "adjective", "tangguh / cepat pulih"),
            word: "resilient",
            phonetic: "/rɪˈzɪliənt/",
            meaning: "tangguh / cepat pulih",
            definition: "Able to withstand or recover quickly from difficult conditions or setbacks.",
            partOfSpeech: "adjective",
            context: "Psychology & Character",
            example: MOCK_WORDS["resilient"].meanings[0].examples[0],
            dateAdded: todayStr
          }
        ];
      });

      useEffect(() => {
        SafeStorage.set("wordlens_dictionary", savedWords);
      }, [savedWords]);

      const [searchHistory, setSearchHistory] = useState(() =>
        SafeStorage.get("wordlens_history", ["run", "break the ice", "resilient", "light"])
      );
      useEffect(() => {
        SafeStorage.set("wordlens_history", searchHistory);
      }, [searchHistory]);

      const [translatorQuery, setTranslatorQuery] = useState("run");
      const [isLoading, setIsLoading] = useState(false);
      const [searchResult, setSearchResult] = useState(MOCK_WORDS["run"]);
      const [hasSearched, setHasSearched] = useState(true);
      const [lastSearchedTerm, setLastSearchedTerm] = useState("run");

      const [mascotState, setMascotState] = useState("idle");
      const [isSpeaking, setIsSpeaking] = useState(false);

      const [toast, setToast] = useState(null);
      const toastTimerRef = useRef(null);

      const showToast = useCallback((message, code = "ARC") => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToast({ message, code });
        toastTimerRef.current = setTimeout(() => {
          setToast(null);
        }, 3100);
      }, []);

      const handlePerformSearch = useCallback(async (rawQuery) => {
        const cleaned = (rawQuery || "").trim();
        if (!cleaned) return;

        setTranslatorQuery(cleaned);
        setLastSearchedTerm(cleaned);
        setHasSearched(true);
        setIsLoading(true);
        setMascotState("processing");

        setSearchHistory((prev) => {
          const filtered = prev.filter((item) => item.toLowerCase() !== cleaned.toLowerCase());
          return [cleaned, ...filtered].slice(0, 10);
        });

        try {
          const data = await searchWord(cleaned);
          setSearchResult(data);
        } catch (err) {
          setSearchResult(null);
        } finally {
          setIsLoading(false);
          setMascotState("idle");
        }
      }, []);

      const handleQuickSearch = useCallback(
        (wordToSearch) => {
          ArchivalAudio.playKeyClick(soundEnabled);
          setActivePage("translator");
          handlePerformSearch(wordToSearch);
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [handlePerformSearch, soundEnabled]
      );

      const handleClearHistory = () => {
        ArchivalAudio.playKeyClick(soundEnabled);
        setSearchHistory([]);
        showToast("Search history cleared.", "LOG");
      };

      const isMeaningSaved = useCallback(
        (word, partOfSpeech, translation) => {
          const targetId = createMeaningId(word, partOfSpeech, translation);
          return savedWords.some((item) => item.id === targetId);
        },
        [savedWords]
      );

      const handleSaveMeaning = (word, phonetic, meaningObj) => {
        const entryId = createMeaningId(word, meaningObj.partOfSpeech, meaningObj.translation);
        const exists = savedWords.some((item) => item.id === entryId);

        if (exists) {
          ArchivalAudio.playKeyClick(soundEnabled);
          return;
        }

        const newEntry = {
          id: entryId,
          word,
          phonetic,
          meaning: meaningObj.translation,
          definition: meaningObj.definition,
          partOfSpeech: meaningObj.partOfSpeech,
          context: meaningObj.context,
          example: meaningObj.examples?.[0] || { en: "", id: "" },
          dateAdded: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        };

        setSavedWords((prev) => [newEntry, ...prev]);
        setMascotState("celebrating");
        setTimeout(() => setMascotState("idle"), 1200);

        ArchivalAudio.playBellChord(soundEnabled);
      };

      const handleDeleteWord = (id, wordLabel) => {
        ArchivalAudio.playKeyClick(soundEnabled);
        setSavedWords((prev) => prev.filter((item) => item.id !== id));
        showToast(`Card "${wordLabel}" was removed from the Catalog Drawer.`, "DEL");
      };

      const handleLoadStarterWords = () => {
        const starterList = [
          { w: "run", mIdx: 0 },
          { w: "run", mIdx: 1 },
          { w: "light", mIdx: 1 },
          { w: "break the ice", mIdx: 0 },
          { w: "give up", mIdx: 0 },
          { w: "piece of cake", mIdx: 0 },
          { w: "resilient", mIdx: 0 }
        ];

        const todayStr = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });

        let addedCount = 0;
        const newEntries = [];

        starterList.forEach(({ w, mIdx }) => {
          const wordData = MOCK_WORDS[w];
          if (!wordData) return;
          const m = wordData.meanings[mIdx];
          const entryId = createMeaningId(wordData.word, m.partOfSpeech, m.translation);
          const alreadyExists = savedWords.some((item) => item.id === entryId);
          if (!alreadyExists) {
            addedCount++;
            newEntries.push({
              id: entryId,
              word: wordData.word,
              phonetic: wordData.phonetic,
              meaning: m.translation,
              definition: m.definition,
              partOfSpeech: m.partOfSpeech,
              context: m.context,
              example: m.examples[0],
              dateAdded: todayStr
            });
          }
        });

        if (addedCount > 0) {
          ArchivalAudio.playBellChord(soundEnabled);
          setSavedWords((prev) => [...newEntries, ...prev]);
          showToast(`${addedCount} specimen cards added to the Catalog Drawer.`, "CAT");
        } else {
          ArchivalAudio.playKeyClick(soundEnabled);
          showToast("All specimen cards are already in the Catalog Drawer.", "INFO");
        }
      };

      const handlePronounce = useCallback(
        (textToSpeak) => {
          ArchivalAudio.playKeyClick(soundEnabled);
          if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            showToast(`Pronouncing: "${textToSpeak}" (en-US)`, "AUDIO");
            return;
          }

          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = "en-US";
            utterance.rate = 0.92;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
          } catch (err) {
            setIsSpeaking(false);
            showToast(`Pronouncing "${textToSpeak}"`, "AUDIO");
          }
        },
        [showToast, soundEnabled]
      );

      const handleGreetArchivist = () => {
        ArchivalAudio.playBellChord(soundEnabled);
        setMascotState("greeting");
        setTimeout(() => setMascotState("idle"), 1100);
      };

      const navItems = [
        { id: "translator", label: "Lexicon Desk", code: "01" },
        { id: "dictionary", label: "Catalog Drawer", code: "02", badge: savedWords.length },
        { id: "quiz", label: "Recall Quiz", code: "03" }
      ];

      const handlePageChange = (pageId) => {
        ArchivalAudio.playKeyClick(soundEnabled);
        setActivePage(pageId);
      };

      return (
        <div className="app-shell bg-linen dark:bg-nightDesk">
          {/* =================================================================== */}
          {/* ARCHIVAL HEADER WITH DISTINCT STONE/WALNUT SURFACE CONTRAST         */}
          {/* =================================================================== */}
          <header className="sticky top-0 z-40 backdrop-blur-md bg-[#E8E3D9]/95 dark:bg-[#1E1B18]/95 border-b-2 border-[#CFC7B8] dark:border-nightBorder transition-colors">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1 sm:py-2.5 lg:py-3 flex items-center justify-between gap-2 sm:gap-3">
              {/* Brand Masthead with Scholarly Capybara Emblem (No Oranges) */}
              <button
                type="button"
                onClick={() => handlePageChange("translator")}
                className="btn-tactile flex min-w-0 items-center gap-2.5 sm:gap-3 text-left focus:outline-none"
              >
                <span className="w-11 h-11 rounded-xl bg-[#F6F0E2] dark:bg-nightDesk border border-espresso/30 dark:border-brass/50 flex items-center justify-center shadow-sm overflow-hidden">
                  {/* Gambar 1: Minimalist Capybara Soaking in Water Ripples Logo */}
                  <svg aria-hidden="true" focusable="false" viewBox="0 0 64 52" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Capybara Silhouette Facing Left */}
                    <path
                      d="M15 20 C15 16.5 18 15 21.5 14 L27 12.5 C27 9.5 29.5 9.5 30 12 C31 10 33.5 10.5 33 13.5 C34.5 16 36.5 20 39 21.5 C45 22.5 49 25.5 50 32.5 C42 35.5 28 35.5 22.5 32.5 L21.5 27.5 L17.5 26.5 C15.2 26 14.5 23.5 15 20 Z"
                      fill="#3D2314"
                      className="dark:fill-[#EAE4DC]"
                    />
                    {/* Slit Eye */}
                    <path
                      d="M25.5 16.5 L29.8 18"
                      stroke="#F6F0E2"
                      className="dark:stroke-[#151311]"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    {/* Inner Water Ripple Arcs */}
                    <path
                      d="M20.5 30.2 C16.5 32 18.5 36.2 33 36.8"
                      stroke="#3D2314"
                      className="dark:stroke-[#EAE4DC]"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M51 30.2 C55 32 52 36.2 38.5 36.7"
                      stroke="#3D2314"
                      className="dark:stroke-[#EAE4DC]"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                    />
                    {/* Outer Water Ripple Segments */}
                    <path
                      d="M16.5 35.2 C19.5 37.5 24 38.5 27.5 39"
                      stroke="#3D2314"
                      className="dark:stroke-[#EAE4DC]"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M30.5 39.8 C35 40.2 40 40.2 45 39.5"
                      stroke="#3D2314"
                      className="dark:stroke-[#EAE4DC]"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M48.5 38.5 C51.5 37.5 53.5 36.2 54.8 34.8"
                      stroke="#3D2314"
                      className="dark:stroke-[#EAE4DC]"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="block">
                  <span className="flex items-center gap-2">
                    <span className="text-lg font-serif-editorial font-bold tracking-tight text-espresso dark:text-[#F5F2EB]">
                      WordLens
                    </span>
                    <span className="hidden lg:inline-block px-2 py-0.5 rounded bg-parchment dark:bg-nightDesk font-mono text-[10px] text-umber dark:text-[#C8A97E] border border-stoneDesk dark:border-nightBorder">
                      CAPYBARA ARCHIVE
                    </span>
                  </span>
                  <span className="hidden lg:block text-[11px] text-umber dark:text-[#A59C94] -mt-0.5">
                    Vocabulary Monographs &amp; Index Catalog
                  </span>
                </span>
                <span className="sr-only">— go to the Lexicon Desk</span>
              </button>

              {/* Desktop/tablet navigation. Phones use the fixed thumb bar below. */}
              <PrimaryNavigation
                items={navItems}
                activePage={activePage}
                onNavigate={handlePageChange}
                variant="header"
              />

              {/* Right Controls: Audio Toggle & Reading Lamp (Dark Mode) */}
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  aria-pressed={soundEnabled}
                  aria-label={`${soundEnabled ? "Sound On" : "Muted"}: typewriter and desk bell sounds ${
                    soundEnabled ? "on" : "off"
                  }. Activate to turn ${soundEnabled ? "off" : "on"}.`}
                  className={`btn-tactile w-11 h-11 lg:w-auto lg:h-auto lg:px-2.5 lg:py-1.5 rounded-lg border font-mono text-[11px] inline-flex items-center justify-center gap-1.5 ${
                    soundEnabled
                      ? "bg-parchment dark:bg-nightDesk text-espresso dark:text-[#EAE4DC] border-[#B5AC99] dark:border-nightBorder"
                      : "bg-linen/50 dark:bg-nightDesk/50 text-umber border-stoneDesk dark:border-nightBorder"
                  }`}
                  title={soundEnabled ? "Typewriter & desk bell sounds: on" : "Sound: off"}
                >
                  <Icons.Speaker className={`w-4 h-4 lg:w-3.5 lg:h-3.5 ${soundEnabled ? "" : "opacity-50"}`} />
                  <span className="hidden lg:inline">{soundEnabled ? "Sound On" : "Muted"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    ArchivalAudio.playKeyClick(soundEnabled);
                    setDarkMode((prev) => !prev);
                  }}
                  aria-pressed={darkMode}
                  aria-label={`Reading mode: ${darkMode ? "night" : "day"}. Activate to switch to ${darkMode ? "day" : "night"} mode.`}
                  className="btn-tactile w-11 h-11 lg:w-auto lg:h-auto px-0 lg:px-3 lg:py-1.5 rounded-lg bg-parchment dark:bg-nightDesk border border-[#B5AC99] dark:border-nightBorder text-espresso dark:text-[#C8A97E] text-xs font-medium inline-flex items-center justify-center gap-1.5"
                  title={darkMode ? "Switch to light paper mode" : "Switch to night reading mode"}
                >
                  {darkMode ? <Icons.Sun className="w-4 h-4 lg:w-3.5 lg:h-3.5" /> : <Icons.Moon className="w-4 h-4 lg:w-3.5 lg:h-3.5" />}
                  <span className="hidden lg:inline" aria-hidden="true">{darkMode ? "Day" : "Night"}</span>
                </button>
              </div>
            </div>
          </header>

          {/* Mobile-only, thumb-friendly primary navigation */}
          <PrimaryNavigation
            items={navItems}
            activePage={activePage}
            onNavigate={handlePageChange}
            variant="bottom"
          />

          {/* =================================================================== */}
          {/* TOP-CENTER ARCHIVAL TOAST NOTIFICATION                              */}
          {/* =================================================================== */}
          {toast && (
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="fixed top-20 inset-x-0 mx-auto z-50 max-w-md px-4 pointer-events-none"
            >
              <div className="pointer-events-auto px-4 py-3 rounded-xl shadow-index-card bg-espresso text-parchment dark:bg-[#EAE4DC] dark:text-espresso border border-brass text-xs font-medium flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-brass/25 font-mono text-[10px] font-semibold">
                    [{toast.code}]
                  </span>
                  <span className="leading-snug">{toast.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="opacity-70 hover:opacity-100 font-mono text-xs px-1"
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* MAIN WORKSPACE CONTENT                                              */}
          {/* =================================================================== */}
          <main
            id="main-content"
            tabIndex={-1}
            className="app-shell__main max-w-6xl w-full mx-auto px-4 sm:px-6 py-2.5 sm:py-6 lg:py-7"
          >
            {activePage === "translator" && (
              <LexiconDeskView
                query={translatorQuery}
                setQuery={setTranslatorQuery}
                onSearch={handlePerformSearch}
                isLoading={isLoading}
                result={searchResult}
                hasSearched={hasSearched}
                lastSearchedTerm={lastSearchedTerm}
                searchHistory={searchHistory}
                onClearHistory={handleClearHistory}
                savedWords={savedWords}
                onSaveMeaning={handleSaveMeaning}
                isMeaningSaved={isMeaningSaved}
                onPronounce={handlePronounce}
                isSpeaking={isSpeaking}
                mascotState={mascotState}
                setMascotState={setMascotState}
                onNavigate={setActivePage}
                onLoadStarterWords={handleLoadStarterWords}
                soundEnabled={soundEnabled}
                onGreetArchivist={handleGreetArchivist}
              />
            )}

            {activePage === "dictionary" && (
              <CatalogArchiveView
                savedWords={savedWords}
                onDeleteWord={handleDeleteWord}
                onPronounce={handlePronounce}
                onNavigate={setActivePage}
                onQuickSearch={handleQuickSearch}
                onLoadStarterWords={handleLoadStarterWords}
                soundEnabled={soundEnabled}
              />
            )}

            {activePage === "quiz" && (
              <RecallExaminationView
                savedWords={savedWords}
                onPronounce={handlePronounce}
                onNavigate={setActivePage}
                onLoadStarterWords={handleLoadStarterWords}
                soundEnabled={soundEnabled}
              />
            )}
          </main>

          {/* =================================================================== */}
          {/* EDITORIAL FOOTER                                                    */}
          {/* =================================================================== */}
          <footer className="mt-8 sm:mt-12 border-t border-stoneDesk dark:border-nightBorder py-6 text-xs text-umber dark:text-[#8C827A]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-serif-editorial italic">
                WordLens — The Capybara Archivist's Contextual Lexicon & Card Catalog
              </span>
              <span className="font-mono text-[11px]">
                EN-US AUDIO • 3D INDEX CARDS • LOCAL ARCHIVE
              </span>
            </div>
          </footer>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);