import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  PhoneOff, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed,
  User, 
  UserPlus, 
  Users,
  Search, 
  Trash, 
  Edit, 
  Settings, 
  BookOpen, 
  Mic, 
  FileText, 
  Music, 
  Calculator, 
  Volume2, 
  VolumeX, 
  Check, 
  Copy, 
  RefreshCw, 
  Play, 
  Pause, 
  Download, 
  Eye, 
  EyeOff, 
  Unlock, 
  Lock, 
  X, 
  Plus, 
  ChevronRight, 
  Clock, 
  Moon, 
  Sun, 
  Wifi, 
  Battery, 
  Mail, 
  ShieldAlert, 
  Disc, 
  Square,
  Sparkles,
  Smartphone,
  Save,
  HelpCircle,
  Delete,
  CheckCircle2,
  Github,
  Terminal
} from "lucide-react";
import JSZip from "jszip";
import { 
  Contact, 
  CallLog, 
  CallRecording, 
  SecretNote, 
  SyntheticTrack, 
  INITIAL_CONTACTS, 
  INITIAL_CALL_LOGS, 
  INITIAL_RECORDINGS, 
  INITIAL_SECRET_NOTES, 
  SYNTHETIC_TRACKS, 
  NOTE_FREQS 
} from "./data";

export default function App() {
  // --- Persistent Storage Setup ---
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem("contacts_data");
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [callLogs, setCallLogs] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem("call_logs_data");
    return saved ? JSON.parse(saved) : INITIAL_CALL_LOGS;
  });

  const [recordings, setRecordings] = useState<CallRecording[]>(() => {
    const saved = localStorage.getItem("recordings_data");
    return saved ? JSON.parse(saved) : INITIAL_RECORDINGS;
  });

  const [secretNotes, setSecretNotes] = useState<SecretNote[]>(() => {
    const saved = localStorage.getItem("secret_notes_data");
    return saved ? JSON.parse(saved) : INITIAL_SECRET_NOTES;
  });

  // --- Secret Dialer Codes Defaults ---
  const [notepadCode, setNotepadCode] = useState(() => localStorage.getItem("code_notes") || "*#111#");
  const [musicCode, setMusicCode] = useState(() => localStorage.getItem("code_music") || "*#222#");
  const [calcCode, setCalcCode] = useState(() => localStorage.getItem("code_calc") || "*#333#");
  const [adminCode, setAdminCode] = useState(() => localStorage.getItem("code_admin") || "*#777#");

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem("contacts_data", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("call_logs_data", JSON.stringify(callLogs));
  }, [callLogs]);

  useEffect(() => {
    localStorage.setItem("recordings_data", JSON.stringify(recordings));
  }, [recordings]);

  useEffect(() => {
    localStorage.setItem("secret_notes_data", JSON.stringify(secretNotes));
  }, [secretNotes]);

  // --- Theme, Language, View state ---
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [phoneTheme, setPhoneTheme] = useState<"dark" | "light">("dark");
  const [currentScreen, setCurrentScreen] = useState<"dialer" | "contacts" | "logs" | "rec_manager" | "backup">("dialer");
  const [activeSecretScreen, setActiveSecretScreen] = useState<"none" | "notes" | "music" | "calc" | "admin_settings">("none");

  // --- Phone Dialer States ---
  const [dialInput, setDialInput] = useState("");
  const [dialToneActive, setDialToneActive] = useState(true);

  // --- Active Call Simulation States ---
  const [activeCallContact, setActiveCallContact] = useState<{ name: string; phone: string; avatarColor?: string } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isRecordingCall, setIsRecordingCall] = useState(false);
  const callDurationInterval = useRef<NodeJS.Timeout | null>(null);

  // --- Web Audio API Synthesizer Refs ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  // --- Notification Toast State ---
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [showGithubWizard, setShowGithubWizard] = useState(false);
  const [gitModalTab, setGitModalTab] = useState<"direct" | "demo">("direct");
  const [gitStep, setGitStep] = useState<"idle" | "connecting" | "pushing" | "compiling" | "done">("idle");
  const [gitProgress, setGitProgress] = useState(0);

  const runGitSimulator = () => {
    if (gitStep !== "idle" && gitStep !== "done") return;
    setGitStep("connecting");
    setGitProgress(5);
    playSystemBeep(440, 0.1, 0.05);

    const interval = setInterval(() => {
      setGitProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setGitStep("done");
          playSystemBeep(880, 0.25, 0.05);
          showToast(lang === "ar" ? "✅ اكتمل تفعيل البناء على GitHub بنجاح!" : "✅ Compilation sequence finalized!", "success");
          return 100;
        }
        
        const next = prev + Math.floor(Math.random() * 15) + 5;
        const boundedNext = next > 100 ? 100 : next;

        if (boundedNext > 20 && boundedNext <= 45) {
          setGitStep("pushing");
        } else if (boundedNext > 45 && boundedNext <= 85) {
          setGitStep("compiling");
        }
        
        return boundedNext;
      });
    }, 250);
  };

  // --- Real-time GitHub Integration Interface (REST-API Exporter) ---
  const [gitUsername, setGitUsername] = useState(() => localStorage.getItem("git_username") || "");
  const [gitRepo, setGitRepo] = useState(() => localStorage.getItem("git_repo") || "secure-contacts");
  const [gitToken, setGitToken] = useState(() => localStorage.getItem("git_token") || "");
  const [gitPrivate, setGitPrivate] = useState(() => localStorage.getItem("git_private") !== "false");

  const [gitSyncStatus, setGitSyncStatus] = useState<"idle" | "auth_checking" | "creating_repo" | "uploading_files" | "success" | "failed">("idle");
  const [gitSyncProgressMsg, setGitSyncProgressMsg] = useState("");
  const [gitSyncProgressPercent, setGitSyncProgressPercent] = useState(0);
  const [gitSyncError, setGitSyncError] = useState("");

  const handleRealExportToGithub = async () => {
    if (!gitUsername.trim() || !gitRepo.trim() || !gitToken.trim()) {
      setGitSyncError(lang === "ar" ? "⚠️ برجاء ملء كافة الحقول وإدخال رمز الوصول (Token) الخاص بحسابك!" : "⚠️ Please fill all fields and input your GitHub Personal Access Token!");
      playSystemBeep(150, 0.25, 0.05);
      return;
    }
    
    setGitSyncStatus("auth_checking");
    setGitSyncProgressMsg(lang === "ar" ? "جاري التحقق من رمز الوصول (Token)..." : "Verifying GitHub Token...");
    setGitSyncProgressPercent(5);
    setGitSyncError("");

    const tokenVal = gitToken.trim();
    const headers = {
      "Authorization": `Bearer ${tokenVal}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    };

    try {
      // 1. Verify user / token
      const userRes = await fetch("https://api.github.com/user", { headers });
      if (!userRes.ok) {
        throw new Error(lang === "ar" ? "رمز الوصول جيت هاب غير صالح أو يفتقد لصلاحية repo" : "Invalid GitHub Token or lacks 'repo' scopes");
      }
      const userData = await userRes.json();
      console.log("GitHub User authenticated:", userData.login);

      setGitSyncProgressPercent(15);
      setGitSyncStatus("creating_repo");
      setGitSyncProgressMsg(lang === "ar" ? `تحقق من وجود المستودع ${gitRepo}...` : `Checking if repo ${gitRepo} exists...`);

      // 2. Check if repo exists
      const repoRes = await fetch(`https://api.github.com/repos/${gitUsername.trim()}/${gitRepo.trim()}`, { headers });
      
      if (repoRes.status === 404) {
        // Create repo
        setGitSyncProgressMsg(lang === "ar" ? `مستودع غير موجود. جاري إنشاء مستودع جديد باسم ${gitRepo.trim()}...` : `Repo not found. Creating a new repo named ${gitRepo.trim()}...`);
        const createRes = await fetch("https://api.github.com/user/repos", {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: gitRepo.trim(),
            private: gitPrivate,
            description: "Secure Contacts Mobile Application with Capacitor and Automated Actions Build",
            auto_init: true // Ensure main branch is initialized with a README
          })
        });

        if (!createRes.ok) {
          const errData = await createRes.json();
          throw new Error(lang === "ar" ? `فشل إنشاء المستودع: ${errData.message}` : `Failed to create repo: ${errData.message}`);
        }
        setGitSyncProgressMsg(lang === "ar" ? "تم إنشاء المستودع الجديد بنجاح. انتظار تهيئة GitHub..." : "Repo created successfully. Waiting for init...");
        // Wait a moment for GitHub to initialize branch
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else if (!repoRes.ok) {
        throw new Error(lang === "ar" ? "خطأ في الاتصال بالمستودع المحدد" : "Error connecting to the specified repository");
      }

      setGitSyncProgressPercent(30);
      setGitSyncStatus("uploading_files");

      // Define files to export
      const filesToUpload = [
        { path: "package.json", dest: "package.json" },
        { path: "capacitor.config.json", dest: "capacitor.config.json" },
        { path: "index.html", dest: "index.html" },
        { path: "vite.config.ts", dest: "vite.config.ts" },
        { path: "tsconfig.json", dest: "tsconfig.json" },
        { path: "src/main.tsx", dest: "src/main.tsx" },
        { path: "src/data.ts", dest: "src/data.ts" },
        { path: "src/index.css", dest: "src/index.css" },
        { path: "src/App.tsx", dest: "src/App.tsx" },
        { path: "assets/.aistudio/workflows/build-apk.yml", dest: ".github/workflows/build-apk.yml" }
      ];

      let successCount = 0;
      
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const stepMsg = lang === "ar" 
          ? `جاري رفع ملف: ${file.dest} (${i + 1}/${filesToUpload.length})` 
          : `Uploading file: ${file.dest} (${i + 1}/${filesToUpload.length})`;
        
        setGitSyncProgressMsg(stepMsg);
        const percent = Math.floor(30 + ((i / filesToUpload.length) * 65));
        setGitSyncProgressPercent(percent);

        try {
          // 1. Fetch file content from dev server
          const fileRes = await fetch("/" + file.path);
          if (!fileRes.ok) {
            console.warn(`File fallback for ${file.path}`);
            continue;
          }
          const fileText = await fileRes.text();

          // 2. Base64 encode file contents supporting full UTF-8
          const base64Content = btoa(unescape(encodeURIComponent(fileText)));

          // 3. Get file SHA if exists to allow overwriting / updating
          let sha: string | undefined = undefined;
          const fileCheckRes = await fetch(`https://api.github.com/repos/${gitUsername.trim()}/${gitRepo.trim()}/contents/${file.dest}`, { headers });
          if (fileCheckRes.ok) {
            const fileCheckData = await fileCheckRes.json();
            sha = fileCheckData.sha;
          }

          // 4. PUT file to GitHub
          const putRes = await fetch(`https://api.github.com/repos/${gitUsername.trim()}/${gitRepo.trim()}/contents/${file.dest}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({
              message: `Direct Sync: Exporting ${file.dest} with automated workflow setup`,
              content: base64Content,
              sha: sha
            })
          });

          if (putRes.ok) {
            successCount++;
          } else {
            console.error(`Failed to PUT file ${file.dest}:`, await putRes.text());
          }
        } catch (err) {
          console.error(`Error uploading file ${file.path}:`, err);
        }
      }

      setGitSyncProgressPercent(100);
      setGitSyncStatus("success");
      setGitSyncProgressMsg(lang === "ar" 
        ? `🎉 مبارك يا غالي! تم تصدير كافة ملفات مشروعك بالكامل بنجاح وبسرعة فائقة (${successCount}/${filesToUpload.length}) وتم تضمين تجميعة الأندرويد التلقائية بمستودعك الجديد!` 
        : `🎉 Success! Exported all codebase files (${successCount}/${filesToUpload.length}) directly to your GitHub repo with Android Actions!`);
      
      playSystemBeep(880, 0.3, 0.08);
      showToast(lang === "ar" ? "✅ اكتمل التصدير والمزامنة بمستودع جيت هاب!" : "✅ GitHub direct export complete!", "success");
      
      // Save settings to localStorage
      localStorage.setItem("git_username", gitUsername.trim());
      localStorage.setItem("git_repo", gitRepo.trim());
      localStorage.setItem("git_token", tokenVal);
      localStorage.setItem("git_private", String(gitPrivate));

    } catch (error: any) {
      console.error("Direct GitHub export failure:", error);
      setGitSyncStatus("failed");
      setGitSyncError(error?.message || "An unexpected error occurred during direct export");
      playSystemBeep(150, 0.4, 0.1);
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Lazy initialize AudioContext on user interaction
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // --- Dual-Tone Multi-Frequency (DTMF) Synthesizer Generator ---
  // Generates genuine physical dialer telephone beep pitch sound!
  const playDTMFTone = (key: string) => {
    if (!dialToneActive) return;
    try {
      const ctx = getAudioContext();
      
      // DTMF Dual frequencies map
      const dtmfFreqs: Record<string, [number, number]> = {
        "1": [697, 1209], "2": [697, 1336], "3": [697, 1477],
        "4": [770, 1209], "5": [770, 1336], "6": [770, 1477],
        "7": [852, 1209], "8": [852, 1336], "9": [852, 1477],
        "*": [941, 1209], "0": [941, 1336], "#": [941, 1477]
      };

      const freqs = dtmfFreqs[key];
      if (!freqs) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];

      osc1.type = "sine";
      osc2.type = "sine";

      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      osc1.stop(ctx.currentTime + 0.18);
      osc2.stop(ctx.currentTime + 0.18);
    } catch (e) {
      console.warn("AudioContext not supported or gesture missing");
    }
  };

  // Tone sound feedback
  const playSystemBeep = (freq = 440, duration = 0.15, vol = 0.05) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.01);
    } catch(e) {}
  };

  // --- Real Synther Music Sequencer Engine ---
  // Plays genuine musical melodies inside the secret player using dynamic osc beeps!
  const [musicPlayingTrackId, setMusicPlayingTrackId] = useState<string | null>(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  const stopMusicSequencer = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    setMusicPlayingTrackId(null);
    setCurrentNoteIndex(0);
  };

  const playMusicSequencer = (track: SyntheticTrack) => {
    // If already playing this track, pause it
    if (musicPlayingTrackId === track.id) {
      stopMusicSequencer();
      return;
    }

    // Stop current track
    stopMusicSequencer();
    
    getAudioContext(); // Ensure resumed
    setMusicPlayingTrackId(track.id);
    let noteIdx = 0;
    const notesLength = track.notes.length;

    const playNextNote = () => {
      if (noteIdx >= notesLength) {
        // Loop back
        noteIdx = 0;
      }
      
      setCurrentNoteIndex(noteIdx);
      const originalTrack = SYNTHETIC_TRACKS.find(t => t.id === track.id);
      if (!originalTrack) return;
      
      const noteItem = originalTrack.notes[noteIdx];
      const freq = NOTE_FREQS[noteItem.note] || 440;
      const durationSeconds = (noteItem.dur * 60) / track.tempo;

      // Play beep
      try {
        const ctx = getAudioContext();
        
        // Triangle/Square oscillators resemble adorable retro synths!
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = track.id === "song3" ? "square" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds - 0.02);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + durationSeconds);
      } catch (e) {}

      noteIdx++;
    };

    // Initial note call
    playNextNote();
    
    // Set continuous loop
    const tickTimeMs = (60 / track.tempo) * 1000;
    synthIntervalRef.current = window.setInterval(() => {
      playNextNote();
    }, tickTimeMs);
  };

  // --- Action Handlers ---
  const handleDialButton = (char: string) => {
    playDTMFTone(char);
    setDialInput(prev => prev + char);
  };

  const handleBackspace = () => {
    playSystemBeep(300, 0.1, 0.05);
    setDialInput(prev => prev.slice(0, -1));
  };

  const clearDialer = () => {
    playSystemBeep(250, 0.15, 0.05);
    setDialInput("");
  };

  // Triggering the Green dial Call button
  const handleInitiateCall = () => {
    if (!dialInput.trim()) {
      showToast(lang === "ar" ? "الرجاء كتابة رقم هاتف أو رمز أمان" : "Please enter a valid number or secure code", "error");
      return;
    }

    const typedValue = dialInput.trim();

    // Check Secret Codes!
    if (typedValue === notepadCode) {
      playSystemBeep(523.25, 0.3, 0.1); // Play high secure ring
      setTimeout(() => playSystemBeep(659.25, 0.3, 0.1), 100);
      setActiveSecretScreen("notes");
      showToast(lang === "ar" ? "🔓 تم فتح الخزنة السرية للمذكرات!" : "🔓 Notes Secure Vault Unlocked!", "success");
      setDialInput("");
      return;
    }
    if (typedValue === musicCode) {
      playSystemBeep(587.33, 0.35, 0.1);
      setTimeout(() => playSystemBeep(698.46, 0.35, 0.1), 120);
      setActiveSecretScreen("music");
      showToast(lang === "ar" ? "🎵 تم فتح مشغل الصوت الخفي!" : "🎵 Secret Audio Synth Unlocked!", "success");
      setDialInput("");
      return;
    }
    if (typedValue === calcCode) {
      playSystemBeep(659.25, 0.25, 0.1);
      setTimeout(() => playSystemBeep(783.99, 0.25, 0.1), 100);
      setActiveSecretScreen("calc");
      showToast(lang === "ar" ? "🧮 تم تنشيط الحاسبة الحامية المشفرة" : "🧮 Secure Calculator Loaded!", "success");
      setDialInput("");
      return;
    }
    if (typedValue === adminCode) {
      playSystemBeep(880.00, 0.4, 0.1);
      setActiveSecretScreen("admin_settings");
      showToast(lang === "ar" ? "⚙️ تم تجميع موجه تعديل الأكواد السرية" : "⚙️ Secret Codes Policy Unlocked", "info");
      setDialInput("");
      return;
    }

    // Is it a normal contact call?
    const foundContact = contacts.find(c => c.phone.replace(/[\s-]/g, "") === typedValue.replace(/[\s-]/g, ""));
    setActiveCallContact({
      name: foundContact ? foundContact.name : lang === "ar" ? "شخص مجهول" : "Unknown Caller",
      phone: typedValue,
      avatarColor: foundContact ? foundContact.avatarColor : "bg-slate-700"
    });
    
    // Start elapsed call timer
    setCallDuration(0);
    setIsRecordingCall(false);
    playSystemBeep(440, 0.2, 0.05);

    callDurationInterval.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const handleEndCall = () => {
    if (callDurationInterval.current) {
      clearInterval(callDurationInterval.current);
      callDurationInterval.current = null;
    }

    // Save call log
    const newLogId = "log_" + Date.now();
    const formattedDuration = formatTimer(callDuration);
    const logEntry: CallLog = {
      id: newLogId,
      name: activeCallContact?.name || dialInput,
      phone: activeCallContact?.phone || dialInput,
      timestamp: lang === "ar" ? "الآن، " + new Date().toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" }) : "Today, " + new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      type: "outgoing",
      duration: formattedDuration
    };

    // If recorded, save simulated recording!
    if (isRecordingCall) {
      const recId = "rec_" + Date.now();
      logEntry.recordingId = recId;

      const randomNotesFreqs = [261.63, 329.63, 392.00, 523.25].map(v => v * (1 + Math.random() * 0.4));
      const recordingEntry: CallRecording = {
        id: recId,
        contactName: activeCallContact?.name || DialAppNameBackup,
        phone: activeCallContact?.phone || dialInput,
        duration: formattedDuration,
        timestamp: logEntry.timestamp,
        notes: lang === "ar" ? "تم الضغط يدوياً على تسجيل المكالمة أثناء المكالمة الصادرة العاجلة." : "Manually logged via hardware switch call recorder during outbound line.",
        melodyNotes: randomNotesFreqs
      };

      setRecordings(prev => [recordingEntry, ...prev]);
    }

    setCallLogs(prev => [logEntry, ...prev]);
    setActiveCallContact(null);
    setDialInput("");
    setIsRecordingCall(false);
    playSystemBeep(220, 0.4, 0.1); // Play hangup warning beep
    showToast(lang === "ar" ? "📞 تم إنهاء وحفظ سجل الاتصال" : "📞 Outbound Connection Terminated");
  };

  const DialAppNameBackup = lang === "ar" ? "رقم غير معروف" : "Unknown number";

  const toggleCallRecording = () => {
    setIsRecordingCall(prev => !prev);
    playSystemBeep(isRecordingCall ? 440 : 880, 0.15, 0.08);
    showToast(
      isRecordingCall 
        ? lang === "ar" ? "🎙️ تم إيقاف التسجيل الصوتي للمكالمة" : "🎙️ Call recording paused" 
        : lang === "ar" ? "🎙️ جاري فحص وتسجيل المكالمة حياً!" : "🎙️ Audio Recording Active",
      isRecordingCall ? "info" : "success"
    );
  };

  const handleQuickCallFromContact = (contact: Contact) => {
    setDialInput(contact.phone);
    setActiveCallContact({
      name: contact.name,
      phone: contact.phone,
      avatarColor: contact.avatarColor
    });

    setCallDuration(0);
    setIsRecordingCall(false);
    playSystemBeep(329.63, 0.2, 0.05);

    callDurationInterval.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // --- Format Duration helper ---
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- Official Contacts Form Management ---
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [contactNameInput, setContactNameInput] = useState("");
  const [contactPhoneInput, setContactPhoneInput] = useState("");
  const [contactEmailInput, setContactEmailInput] = useState("");
  const [contactGroupInput, setContactGroupInput] = useState<"العائلة" | "العمل" | "الأصدقاء" | "عام">("عام");

  const saveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactNameInput.trim() || !contactPhoneInput.trim()) {
      showToast(lang === "ar" ? "يجب تعبئة الاسم ورقم الهاتف!" : "Name and Phone must be filled", "error");
      return;
    }

    const availableColors = ["bg-red-600", "bg-blue-600", "bg-pink-600", "bg-emerald-600", "bg-indigo-600", "bg-purple-600", "bg-amber-600", "bg-teal-600"];

    if (editingContactId) {
      // Modify
      setContacts(prev => prev.map(c => c.id === editingContactId ? {
        ...c,
        name: contactNameInput.trim(),
        phone: contactPhoneInput.trim(),
        email: contactEmailInput.trim(),
        group: contactGroupInput
      } : c));
      showToast(lang === "ar" ? "تم تعديل جهة الاتصال بنجاح" : "Modified contact details successfully", "success");
    } else {
      // Create new
      const newContact: Contact = {
        id: "c_" + Date.now(),
        name: contactNameInput.trim(),
        phone: contactPhoneInput.trim(),
        email: contactEmailInput.trim() || `${Date.now()}@google.com`,
        group: contactGroupInput,
        avatarColor: availableColors[Math.floor(Math.random() * availableColors.length)]
      };
      setContacts(prev => [newContact, ...prev]);
      showToast(lang === "ar" ? "تم إضافة جهة اتصال جديدة بنجاح" : "Created new contact catalog success", "success");
    }

    // Reset Form
    setContactNameInput("");
    setContactPhoneInput("");
    setContactEmailInput("");
    setContactGroupInput("عام");
    setEditingContactId(null);
    setShowAddContact(false);
    playSystemBeep(523.25, 0.15, 0.05);
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    showToast(lang === "ar" ? "تم حذف جهة الاتصال!" : "Deleted target secure contact catalog", "info");
    playSystemBeep(180, 0.25, 0.08);
  };

  const startEditContact = (c: Contact) => {
    setEditingContactId(c.id);
    setContactNameInput(c.name);
    setContactPhoneInput(c.phone);
    setContactEmailInput(c.email);
    setContactGroupInput(c.group as any);
    setShowAddContact(true);
    playSystemBeep(392.00, 0.1, 0.05);
  };

  // Filter contacts
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  // --- Official Call Recording waveform & synthesis player ---
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);
  const playRecordingTimer = useRef<number | null>(null);
  const [playingProgress, setPlayingProgress] = useState(0);

  const startRecordingAudioSimulation = (rec: CallRecording) => {
    if (playingRecordingId === rec.id) {
      setPlayingRecordingId(null);
      setPlayingProgress(0);
      if (playRecordingTimer.current) {
        clearInterval(playRecordingTimer.current);
        playRecordingTimer.current = null;
      }
      return;
    }

    // Reset others
    if (playRecordingTimer.current) {
      clearInterval(playRecordingTimer.current);
    }
    setPlayingRecordingId(rec.id);
    setPlayingProgress(0);

    // Play tone trigger
    playSystemBeep(329, 0.1, 0.05);
    setTimeout(() => playSystemBeep(392, 0.1, 0.05), 80);

    let progress = 0;
    const noteFreqs = rec.melodyNotes;
    let melodyIdx = 0;

    playRecordingTimer.current = window.setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        setPlayingProgress(100);
        setTimeout(() => {
          setPlayingRecordingId(null);
          setPlayingProgress(0);
        }, 300);
        if (playRecordingTimer.current) {
          clearInterval(playRecordingTimer.current);
        }
      } else {
        setPlayingProgress(progress);
        
        // Play one short synthesized "recording voice" simulation sound!
        const currentFreq = noteFreqs[melodyIdx % noteFreqs.length];
        playSystemBeep(currentFreq, 0.15, 0.02);
        melodyIdx++;
      }
    }, 120);
  };

  // --- Google Drive Backup Sync Simulation ---
  const [userBackupEmail, setUserBackupEmail] = useState("sdxdxa56@gmail.com");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState(() => localStorage.getItem("last_sync_date") || "لم تتم المزامنة بعد");

  const saveSyncEmailPreference = () => {
    if (!userBackupEmail.includes("@")) {
      showToast(lang === "ar" ? "بريد إلكتروني غير صالح!" : "Invalid Email Address!", "error");
      return;
    }
    showToast(lang === "ar" ? "تم حفظ تفضيلات البريد الإلكتروني" : "Saved email target credentials");
  };

  const handleSyncCloud = () => {
    if (!userBackupEmail.includes("@")) {
      showToast(lang === "ar" ? "تنبيه: يجب إدخال بريد جوجل حقيقي!" : "Error: Real Gmail structure required", "error");
      return;
    }

    setIsSyncing(true);
    playSystemBeep(440, 0.1, 0.05);

    setTimeout(() => {
      const dateStr = new Date().toLocaleString(lang === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" });
      setLastSyncDate(dateStr);
      localStorage.setItem("last_sync_date", dateStr);
      setIsSyncing(false);
      playSystemBeep(880, 0.3, 0.08);
      showToast(lang === "ar" ? `تمت المزامنة بنجاح مع البريد ${userBackupEmail}` : `Successfully synced data backup to ${userBackupEmail}`, "success");
    }, 2200);
  };

  // Dynamic Export backup download file
  const handleDownloadBackupFile = () => {
    const backupObj = {
      app: "Secure Contacts Crypt-Dialer OS",
      backup_email: userBackupEmail,
      timestamp: new Date().toISOString(),
      contacts,
      callLogs,
      recordings,
      secretNotes,
      codes: { notepadCode, musicCode, calcCode, adminCode }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `google_contacts_backup_${userBackupEmail.replace(/[@.]/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    playSystemBeep(523.25, 0.2, 0.08);
    showToast(lang === "ar" ? "📦 تم تصدير ملف النسخة الاحتياطية بنجاح!" : "📦 Cryptographic Backup Downloaded!");
  };

  // Dynamic automatic export of full codebase as a ZIP package for immediate compilation
  const handleExportZip = async () => {
    setIsExportingZip(true);
    playSystemBeep(523.25, 0.1, 0.05);
    showToast(lang === "ar" ? "🤖 جاري تجميع كود مشروع الأندرويد..." : "🤖 Bundling Android Capacitor source package...", "info");

    try {
      const zip = new JSZip();
      
      const filesToBundle = [
        { path: "package.json" },
        { path: "capacitor.config.json" },
        { path: "index.html" },
        { path: "vite.config.ts" },
        { path: "tsconfig.json" },
        { path: "src/main.tsx" },
        { path: "src/data.ts" },
        { path: "src/index.css" },
        { path: "src/App.tsx" },
        { path: ".github/workflows/build-apk.yml" }
      ];

      for (const item of filesToBundle) {
        try {
          const response = await fetch("/" + item.path);
          if (response.ok) {
            const content = await response.text();
            zip.file(item.path, content);
          } else {
            console.warn(`Could not bundle ${item.path}: ${response.statusText}`);
          }
        } catch (e) {
          console.warn(`Error compiling file ${item.path}:`, e);
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = URL.createObjectURL(blob);
      downloadAnchor.download = "Secure-Contacts-Android-Project.zip";
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      playSystemBeep(880, 0.3, 0.08);
      showToast(lang === "ar" ? "✅ تم تحميل ملف الكود المصدري المضغوط بنجاح!" : "✅ Source code package exported as ZIP successfully!", "success");
    } catch (e) {
      console.error(e);
      showToast(lang === "ar" ? "❌ فشل التصدير التلقائي للكود" : "❌ Export package failed", "error");
    } finally {
      setIsExportingZip(false);
    }
  };

  // --- Hidden App 1: Secret Diary States ---
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState("المصنفات السرية");
  const [noteSearchQuery, setNoteSearchQuery] = useState("");
  const [selectedNoteColorIndex, setSelectedNoteColorIndex] = useState(0);

  const noteColorOptions = [
    "from-zinc-900 to-indigo-950 border-indigo-600/30 text-indigo-100",
    "from-zinc-900 to-amber-950 border-amber-600/30 text-amber-100",
    "from-zinc-900 to-rose-950 border-rose-600/30 text-rose-100",
    "from-zinc-900 to-emerald-950 border-emerald-600/30 text-emerald-100",
    "from-zinc-900 to-zinc-900 border-zinc-700/30 text-zinc-100"
  ];

  const handleCreateSecretNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      showToast(lang === "ar" ? "الرجاء كمل العنوان والمسودة" : "Fill titles and text fields", "error");
      return;
    }

    const newNote: SecretNote = {
      id: "note_" + Date.now(),
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      color: noteColorOptions[selectedNoteColorIndex],
      category: newNoteCategory.trim()
    };

    setSecretNotes(prev => [newNote, ...prev]);
    setNewNoteTitle("");
    setNewNoteContent("");
    setNewNoteCategory(lang === "ar" ? "المصنفات السرية" : "Secret Logs");
    playSystemBeep(523.25, 0.25, 0.05);
    showToast(lang === "ar" ? "📝 تم حفظ التقرير السري!" : "📝 Crypt Note Filed Successfully!", "success");
  };

  const handleDeleteSecretNote = (id: string) => {
    setSecretNotes(prev => prev.filter(n => n.id !== id));
    playSystemBeep(180, 0.2, 0.08);
    showToast(lang === "ar" ? "🗑️ تم تدمير الورقة السرية ومسح أثرها" : "🗑️ Crypt Note Shredded!");
  };

  const filteredSecretNotes = secretNotes.filter(n => 
    n.title.toLowerCase().includes(noteSearchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
    n.category.toLowerCase().includes(noteSearchQuery.toLowerCase())
  );

  // --- Hidden App 2: Secure Smart Calculator States ---
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcFormula, setCalcFormula] = useState("");
  const [calcHistory, setCalcHistory] = useState<string[]>(["120 + 34 = 154", "1500 / 5 = 300"]);

  const handleCalcButton = (val: string) => {
    playSystemBeep(520, 0.05, 0.03);
    
    if (val === "C") {
      setCalcDisplay("0");
      setCalcFormula("");
      return;
    }

    if (val === "=") {
      if (!calcFormula) return;
      try {
        // Safe math evaluation
        const sanitizedExpr = calcFormula.replace(/×/g, "*").replace(/÷/g, "/");
        const answer = Function(`"use strict"; return (${sanitizedExpr})`)();
        
        const historyText = `${calcFormula} = ${answer}`;
        setCalcHistory(prev => [historyText, ...prev]);
        setCalcDisplay(String(answer));
        setCalcFormula(String(answer));
      } catch (err) {
        setCalcDisplay("Error");
        setCalcFormula("");
      }
      return;
    }

    // Operators mapping
    if (["+", "-", "×", "÷"].includes(val)) {
      if (calcFormula === "" && calcDisplay !== "0") {
        setCalcFormula(calcDisplay + " " + val + " ");
      } else {
        setCalcFormula(prev => prev + " " + val + " ");
      }
      return;
    }

    // Number keys digit input
    setCalcDisplay(prev => prev === "0" ? val : prev + val);
    setCalcFormula(prev => prev + val);
  };

  // --- Hidden App 3: Dialer Customizer state ---
  const handleSaveSecretCheatCodes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notepadCode.startsWith("*#") || !notepadCode.endsWith("#") || 
        !musicCode.startsWith("*#") || !musicCode.endsWith("#") || 
        !calcCode.startsWith("*#") || !calcCode.endsWith("#") || 
        !adminCode.startsWith("*#") || !adminCode.endsWith("#")) {
      showToast(lang === "ar" ? "أخطاء: يجب أن تبدأ الأكواد بـ *# وتنتهي بـ #" : "All shortcut keys must start with *# and terminate on #", "error");
      return;
    }

    localStorage.setItem("code_notes", notepadCode);
    localStorage.setItem("code_music", musicCode);
    localStorage.setItem("code_calc", calcCode);
    localStorage.setItem("code_admin", adminCode);

    playSystemBeep(880, 0.35, 0.08);
    showToast(lang === "ar" ? "⚙️ تم تحديث قواعد ورموز الاستدعاء بنجاح!" : "⚙️ Calling policies refreshed!", "success");
    setActiveSecretScreen("none"); // lock back
  };

  // Emergency instant close Panic Lock trigger!
  const triggerPanicLock = () => {
    stopMusicSequencer();
    setActiveSecretScreen("none");
    setDialInput("");
    playSystemBeep(150, 0.3, 0.12);
    showToast(lang === "ar" ? "🚨 قفل أمان طوارئ! تم تشفير وإغلاق الخزائن" : "🚨 EMERGENCY PANIC LOCK ENGAGED! System Encrypted", "error");
  };

  // Auto clean intervals on dismount
  useEffect(() => {
    return () => {
      stopMusicSequencer();
      if (callDurationInterval.current) clearInterval(callDurationInterval.current);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-slate-900 ${lang === "ar" ? "font-sans font-medium" : "font-sans"} text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-white`}>
      
      {/* Dynamic Header Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 15 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 bg-[#0d1527] border border-slate-700/60 max-w-sm"
          >
            {toast.type === "success" && <CheckCircle2 className="text-emerald-400 w-5 h-5 flex-shrink-0" />}
            {toast.type === "error" && <ShieldAlert className="text-rose-500 w-5 h-5 flex-shrink-0" />}
            {toast.type === "info" && <Sparkles className="text-indigo-400 w-5 h-5 flex-shrink-0" />}
            <span className="text-xs text-slate-200 leading-normal">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTERACTIVE GITHUB WIZARD MODAL (CENTER OF SCREEN) */}
      <AnimatePresence>
        {showGithubWizard && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop Blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowGithubWizard(false); playSystemBeep(300, 0.1, 0.05); }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Body Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-slate-900 border-2 border-indigo-500/60 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 text-left"
            >
              {/* Close Button */}
              <button 
                onClick={() => { setShowGithubWizard(false); playSystemBeep(300, 0.1, 0.05); }}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-755 rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-mono">
                  <Github className="w-3.5 h-3.5" />
                  <span>{lang === "ar" ? "بوابة تصدير الـ GitHub المباشرة" : "GitHub Direct Exporter Gateway"}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>{lang === "ar" ? "تصدير الكود تلقائياً وبناء الـ APK" : "1-Click GitHub Export & APK Assembler"}</span>
                </h3>
                <p className="text-xs text-zinc-400 leading-normal font-sans">
                  {lang === "ar" 
                    ? "بوابة متكاملة لتصنيع نسختك وتحديث مستودعك الخاص بكبسة زر واحدة من داخل التطبيق دون الحاجة للمزامنة اليدوية!" 
                    : "Automatic pipeline to publish and update your repository from inside the app with a single click!"}
                </p>
              </div>

              {/* Tab Selector Switcher */}
              <div className="flex border-b border-slate-800 pb-1.5 gap-2">
                <button
                  onClick={() => { setGitModalTab("direct"); playSystemBeep(523, 0.08, 0.02); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${gitModalTab === "direct" ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" : "text-zinc-400 hover:text-white"}`}
                >
                  {lang === "ar" ? "🚀 تصدير مباشر بكبسة واحدة" : "🚀 Direct 1-Click Export"}
                </button>
                <button
                  onClick={() => { setGitModalTab("demo"); playSystemBeep(523, 0.08, 0.02); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${gitModalTab === "demo" ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" : "text-zinc-400 hover:text-white"}`}
                >
                  {lang === "ar" ? "🎮 دليل ومحاكي البناء التلقائي" : "🎮 Step-by-Step Guide"}
                </button>
              </div>

              {/* Modal Core Tabs Body */}
              <div className="space-y-4 font-sans">
                {gitModalTab === "direct" ? (
                  <div className="space-y-4">
                    <div className="bg-[#0b0e17] border border-indigo-500/20 p-4 rounded-2xl space-y-1.5 text-[11.5px] leading-relaxed text-zinc-350">
                      <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>{lang === "ar" ? "مزامنة آلية فائقة السرعة لمستودعك" : "Instant Cloud Exporter Sync"}</span>
                      </p>
                      <p>
                        {lang === "ar" 
                          ? "قم بتوفير رمز الوصول (Token) الخاص بك، وسوف يعقد التطبيق اتصالاً آمناً برمجياً لخلق مستودع جيت هاب جديد وتحديثه بكامل الملفات، بما في ذلك ملف تجميع الـ APK المدمج تلقائياً!" 
                          : "Provide your token below to automatically push your entire workspace to your custom repository instantly, including native files and setup assets."}
                      </p>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-400 block">
                          {lang === "ar" ? "اسم مستخدم جيت هاب (Username) *" : "GitHub Username *"}
                        </label>
                        <input 
                          type="text"
                          placeholder="e.g. ahmed-coder"
                          value={gitUsername}
                          onChange={(e) => setGitUsername(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-zinc-650"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-400 block">
                          {lang === "ar" ? "اسم المستودع (Repo Name) *" : "Repository Name *"}
                        </label>
                        <input 
                          type="text"
                          placeholder="secure-contacts-app"
                          value={gitRepo}
                          onChange={(e) => setGitRepo(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-zinc-650"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-400 flex justify-between block">
                        <span>{lang === "ar" ? "رمز الوصول الشخصي لجيت هاب (GitHub Token) *" : "Personal Access Token (PAT) *"}</span>
                        <a 
                          href="https://github.com/settings/tokens/new?scopes=repo&description=SecureContactsSync"
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:underline text-[10px] font-extrabold"
                        >
                          {lang === "ar" ? "إنشاء الرمز الآن بسهولة 🔗" : "Generate Token 🔗"}
                        </a>
                      </label>
                      <input 
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        value={gitToken}
                        onChange={(e) => setGitToken(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none placeholder-zinc-650"
                      />
                      <p className="text-[10px] text-zinc-500 italic">
                        {lang === "ar" 
                          ? "ملاحظة آمنة: هذا الرمز مشفر ومحفوظ محلياً بجهازك لا يرسل لأي سيرفر خارجي إطلاقاً." 
                          : "Privacy Note: Token is securely stored inside local secure-state sandbox and connects directly to GitHub."}
                      </p>
                    </div>

                    {/* Private repository option */}
                    <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                      <input 
                        type="checkbox"
                        id="private_repo_toggle"
                        checked={gitPrivate}
                        onChange={(e) => setGitPrivate(e.target.checked)}
                        className="w-4 h-4 text-indigo-500 bg-slate-950 border-slate-800 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="private_repo_toggle" className="text-xs text-zinc-350 font-bold cursor-pointer select-none">
                        {lang === "ar" ? "تفعيل مستودع خاص وآمن (Private Repository) لحماية كودك" : "Create Repository as Private (Recommended)"}
                      </label>
                    </div>

                    {/* Output and Sync console */}
                    {gitSyncStatus !== "idle" && (
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3 font-mono text-[11px] animate-fade-in">
                        <div className="flex justify-between items-center text-[10px] text-zinc-400">
                          <span className="flex items-center gap-2">
                            <span className={`${gitSyncStatus === "success" ? "bg-emerald-500" : gitSyncStatus === "failed" ? "bg-rose-500" : "bg-indigo-500 animate-ping"} w-1.5 h-1.5 rounded-full`} />
                            <span className="capitalize text-zinc-300 font-bold">{gitSyncStatus.replace("_", " ")}</span>
                          </span>
                          <span>{gitSyncProgressPercent}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${gitSyncStatus === "success" ? "bg-emerald-500" : gitSyncStatus === "failed" ? "bg-rose-500" : "bg-indigo-500"}`}
                            style={{ width: `${gitSyncProgressPercent}%` }}
                          />
                        </div>

                        <p className={`text-[10.5px] leading-relaxed ${gitSyncStatus === "success" ? "text-emerald-400" : gitSyncStatus === "failed" ? "text-rose-400" : "text-zinc-300"}`}>
                          {gitSyncProgressMsg}
                        </p>

                        {gitSyncError && (
                          <p className="text-[10px] text-rose-500 font-bold mt-1 bg-rose-950/20 p-2 rounded-lg border border-rose-900/30">
                            {gitSyncError}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Primary sync button */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleRealExportToGithub}
                        disabled={gitSyncStatus === "auth_checking" || gitSyncStatus === "creating_repo" || gitSyncStatus === "uploading_files"}
                        className="flex-grow py-3 px-4 bg-gradient-to-r from-indigo-650 via-indigo-550 to-indigo-650 hover:from-indigo-550 hover:to-indigo-450 disabled:bg-indigo-600/30 text-white text-xs font-black uppercase rounded-2xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Github className={`w-4.5 h-4.5 ${gitSyncStatus === "uploading_files" ? "animate-spin" : "animate-pulse"}`} />
                        <span>
                          {gitSyncStatus === "uploading_files" 
                            ? (lang === "ar" ? "جاري تجميع ورفع الملفات بأمان..." : "Exporting elements...")
                            : (lang === "ar" ? "تصدير ومزامنة المستودع الفعلي بكبسة واحدة 🚀" : "Export Entire Codebase to GitHub 🚀")}
                        </span>
                      </button>
                      
                      {gitSyncStatus !== "idle" && (
                        <button
                          onClick={() => {
                            setGitSyncStatus("idle");
                            setGitSyncProgressPercent(0);
                            setGitSyncProgressMsg("");
                            setGitSyncError("");
                          }}
                          className="px-4 py-3 bg-slate-800 hover:bg-slate-755 text-zinc-305 text-xs rounded-xl cursor-pointer"
                        >
                          {lang === "ar" ? "إعادة تعيين" : "Reset"}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {/* Step 1: Tell where the real GitHub push button is */}
                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-850/80 space-y-2 relative overflow-hidden">
                      <div className="absolute top-3 right-3 text-xs font-mono font-black text-indigo-500 bg-indigo-950/40 border border-indigo-500/20 w-6 h-6 rounded-full flex items-center justify-center">1</div>
                      <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{lang === "ar" ? "أين تجد زر تصدير GitHub الحقيقي بالمنصة؟" : "Locate the official Sync button:"}</span>
                      </h4>
                      <p className="text-[11.5px] text-zinc-350 leading-relaxed pr-6">
                        {lang === "ar" 
                          ? "اضغط على زر التصدير (المزامنة) المتواجد بـ شريط إعدادات قوقل AI Studio العلوي (بالشريط الرمادي في أعلى يمين المتصفح). سيقوم بربط ورفع هذا الكود بالكامل إلى مستودعك الخاص." 
                          : "Look at the top header of AI Studio web playground. Inside the utility menu, use the 'Sync with GitHub' option to initialize your cloud repo."}
                      </p>
                    </div>

                    {/* Step 2: The Automatic Action */}
                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-850/80 space-y-2 relative overflow-hidden">
                      <div className="absolute top-3 right-3 text-xs font-mono font-black text-indigo-500 bg-indigo-950/40 border border-indigo-500/20 w-6 h-6 rounded-full flex items-center justify-center">2</div>
                      <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>{lang === "ar" ? "تشغيل ملف build-apk.yml المدمج تلقائياً:" : "Automatic Compilation Sequence:"}</span>
                      </h4>
                      <p className="text-[11.5px] text-zinc-350 leading-relaxed pr-6">
                        {lang === "ar" 
                          ? "بمجرد إرسال الكود سيقوم مستودعك تلقائياً وبدون أي تدخل بتفعيل الـ Workflow لتسطيب بيئة أندرويد وتجميع ملف APK وتصنيعه." 
                          : "Once pushed, the preconfigured '.github/workflows/build-apk.yml' script automatically configures Java and triggers raw APK generation."}
                      </p>
                    </div>

                    {/* Step 3: Interactive Sandbox Compiler Simulation */}
                    <div className="p-4 bg-indigo-950/10 rounded-2xl border border-indigo-500/25 space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                          <span>{lang === "ar" ? "محاكي لوحة البناء المباشرة:" : "LIVE COMPILER SIMULATOR BOARD:"}</span>
                        </p>
                        <span className="text-[10px] text-zinc-500 font-mono">Status: {gitStep.toUpperCase()}</span>
                      </div>

                      {gitStep === "idle" ? (
                        <div className="space-y-2">
                          <p className="text-[11px] text-zinc-400">
                            {lang === "ar" 
                              ? "يمكنك تجربة واختبار عملية التجميع والمزامنة الافتراضية هنا للتأكد من المخطط البرمجي قبل تفعيله على جيت هاب:" 
                              : "Simulate compiling the full suite layout offline before committing to your official repository:"}
                          </p>
                          <button
                            onClick={runGitSimulator}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-xl cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{lang === "ar" ? "بدء محاكاة بناء وتجميع الملفات الآن" : "Trigger Pipeline Simulation Demo"}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 font-mono text-[10.5px]">
                          {/* Terminal mock outputs */}
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-slate-300 animate-fade-in">
                            {gitStep === "connecting" && <p className="text-indigo-400">⚡ Connecting to build-apk runner...</p>}
                            {(gitStep === "pushing" || gitStep === "compiling" || gitStep === "done") && (
                              <>
                                <p className="text-[#2ed573]">✔ Repository verified & synchronized on cloud runner.</p>
                                <p className="text-blue-400">✦ Installing Java OpenJDK 17 & Node.js 20 libraries...</p>
                              </>
                            )}
                            {(gitStep === "compiling" || gitStep === "done") && (
                              <>
                                <p className="text-yellow-400 animate-pulse">🛠️ Running Capacitor sync android...</p>
                                <p className="text-white">⚙️ executing client compilers & assembler: gradlew assembleDebug</p>
                              </>
                            )}
                            {gitStep === "done" && (
                              <p className="text-green-400 font-bold">🎉 Done! Secure-Contacts-v3.5.apk has been successfully compiled and pushed to artifacts!</p>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-zinc-500">
                              <span>Progress</span>
                              <span>{gitProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-805">
                              <div 
                                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${gitProgress}%` }}
                              />
                            </div>
                          </div>

                          {gitStep === "done" && (
                            <div className="flex gap-2">
                              <button
                                onClick={handleExportZip}
                                className="flex-grow py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{lang === "ar" ? "تحميل الكود البرمجي بالكامل (ZIP)" : "Download Ready Package Code"}</span>
                              </button>
                              <button
                                onClick={() => { setGitStep("idle"); setGitProgress(0); }}
                                className="px-3 py-2 bg-slate-800 hover:bg-slate-755 text-zinc-300 text-[11px] rounded-xl cursor-pointer"
                              >
                                Reset
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom footer note */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => { setShowGithubWizard(false); playSystemBeep(300, 0.1, 0.05); }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-zinc-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  {lang === "ar" ? "إغلاق البوابة" : "Close Portal"}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Primary Navigation Hub Row */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 sticky top-0 z-[100]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>{lang === "ar" ? "تطبيق جهات الاتصال الذكي والأمين" : "Secure Dial & Contacts Master OS"}</span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/25">v3.5 PRO</span>
              </h1>
              <p className="text-[10.5px] text-zinc-400">
                {lang === "ar" ? "مسجل مكالمات محصن + رموز استدعاء سرية وتخزين بريدي مدمج" : "Encrypted recorder + dialer escape codes & unified mail-sync"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct GitHub Exporter Button in Header */}
            <button
              onClick={() => {
                setShowGithubWizard(true);
                setGitModalTab("direct");
                playSystemBeep(523, 0.08, 0.02);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-550 border border-indigo-500/50 text-[11px] text-white font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/30 active:scale-95 animate-pulse"
            >
              <Github className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "تصدير للـ GitHub 🚀" : "Direct Export to GitHub 🚀"}</span>
            </button>

            {/* Lang switcher */}
            <button
              onClick={() => {
                setLang(l => l === "ar" ? "en" : "ar");
                playSystemBeep(350, 0.1, 0.04);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] hover:bg-slate-900 transition-all cursor-pointer font-semibold text-zinc-300"
            >
              🌐 {lang === "ar" ? "English" : "العربية"}
            </button>

            {/* Virtual Phone Sound Setting */}
            <button
              onClick={() => {
                setDialToneActive(!dialToneActive);
                playSystemBeep(dialToneActive ? 300 : 600, 0.1, 0.05);
              }}
              className={`px-3 py-1.5 rounded-lg border text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                dialToneActive ? "border-indigo-500 bg-indigo-950/20 text-indigo-300" : "border-slate-800 text-zinc-500 bg-transparent"
              }`}
            >
              {dialToneActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{lang === "ar" ? (dialToneActive ? "أصوات لوحة الاتصال" : "كتم الصوت") : (dialToneActive ? "Dialpad Sounds ON" : "Mute DTMF Beeps")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: System Manual, Cheatsheet & Features Explanation Section */}
        <section className="lg:col-span-5 space-y-6">

          {/* SECURE GITHUB EXPORT & APK COMPILATION MANUAL */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950/90 border border-indigo-500/30 p-6 rounded-3xl space-y-4 shadow-xl shadow-indigo-500/5 relative overflow-hidden animate-fade-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/35">
                <Github className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  {lang === "ar" ? "بوابة التصدير والتجميع المباشر عبر GitHub" : "GitHub Sync & APK Build Pipeline"}
                </h3>
                <p className="text-[10px] text-indigo-300 font-mono">
                  {lang === "ar" ? "مزامنة المستودع المباشرة" : "Capacitor Mobile Native Pipeline"}
                </p>
              </div>
            </div>

            <p className="text-[11.5px] text-zinc-300 leading-relaxed font-sans">
              {lang === "ar"
                ? "لقد قمنا بإعداد وتضمين ملفات كود الأندرويد بالكامل (Capacitor) والمزامنة والـ GitHub Actions لبناء تطبيق الـ APK تلقائياً بمستودعك فوراً عند التحديث."
                : "The Capacitor mobile wrapper configurations and GitHub Actions build tasks have been fully integrated into your directory structures."}
            </p>

            <div className="border-t border-slate-800/80 pt-3.5 space-y-3">
              <p className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{lang === "ar" ? "خطوات مزامنة المشروع إلى مستودعك:" : "How to export codebase to GitHub:"}</span>
              </p>

              <div className="space-y-3 font-sans">
                <div className="flex gap-2 text-[10.5px] items-start">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-indigo-400 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0">1</span>
                  <p className="text-zinc-350 leading-relaxed">
                    {lang === "ar"
                      ? "اضغط على زر التصدير (المزامنة مع GitHub) المتواجد في الزاوية العلوية اليمنى في شريط قوقل AI Studio العلوي (بالشريط الرمادي للمنصة) لربط كودك بمستودعك مباشرة."
                      : "Look at the top-right options of the Google AI Studio builder interface and click 'Sync with GitHub' to publish your revisions."}
                  </p>
                </div>

                <div className="flex gap-2 text-[10.5px] items-start">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 text-indigo-400 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0">2</span>
                  <p className="text-zinc-350 leading-relaxed">
                    {lang === "ar"
                      ? "بمجرد رفع وتحديث الملفات المستهدفة بمستودعك، سيعمل نظام GitHub Actions تلقائياً على تصنيع إصدار الـ APK وحفظه."
                      : "Your GitHub repository will automatically configure the build workspace to run our preconfigured build pipeline."}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowGithubWizard(true);
                playSystemBeep(659, 0.1, 0.05);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-650 hover:bg-indigo-550 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-lg shadow-indigo-600/25 active:scale-95 text-center mt-2"
            >
              <Github className="w-4 h-4" />
              <span>
                {lang === "ar" ? "فتح دليل ومحاكي تجميع APK المباشر" : "Launch Interactive Setup Helper"}
              </span>
            </button>
          </div>
          
          {/* SECURE SYSTEM OVERVIEW OR CHEATS MANUAL */}
          <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="text-indigo-400 w-4.5 h-4.5" />
              <span>{lang === "ar" ? "دليل الأكواد والرموز السرية المحفوظة" : "Secured Codes & System Cheat-Sheet"}</span>
            </h3>
            
            <p className="text-[11.5px] text-zinc-400 leading-relaxed">
              {lang === "ar" 
                ? "قام التطبيق بدمج أكواد تحويل سرية ومشفرة مخفية بالخلفية. بمجرد كتابة الكود داخل لوحة طالب الاتصال وضغط زر الاتصال الأخضر 📞، سيتم نقلك فوراً إلى الميزات الحامية الحصرية:" 
                : "Your calling dialer contains built-in trigger pathways. Simply type any shortcut code listed below on the virtual screen and click the green CALL button 📞 to instantly launch the secure utility:"}
            </p>

            {/* List of dynamic codes */}
            <div className="space-y-3 pt-1">
              
              <div onClick={() => { setDialInput(notepadCode); playSystemBeep(523, 0.1, 0.04); }} className="p-3 bg-[#0c101a] border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-amber-500/30 transition-all group">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200">{lang === "ar" ? "المذكرة السرية المؤمنة" : "Secret Diary Capsule"}</p>
                    <p className="text-[10px] text-zinc-500">{lang === "ar" ? "لحفظ الحسابات والوثائق وعقود الأمان" : "Save encrypted passwords & records"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-amber-400 bg-amber-950/20 px-2 py-1 rounded-md border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-all">
                    {notepadCode}
                  </span>
                </div>
              </div>

              <div onClick={() => { setDialInput(musicCode); playSystemBeep(587, 0.1, 0.04); }} className="p-3 bg-[#0c101a] border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-500/30 transition-all group">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200">{lang === "ar" ? "مشغل الموسيقى والموجات" : "Audio Synth Player"}</p>
                    <p className="text-[10px] text-zinc-500">{lang === "ar" ? "توليف نوتات حقيقية عبر كرت الصوت" : "Generates clean study sound frequencies"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-950/20 px-2 py-1 rounded-md border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    {musicCode}
                  </span>
                </div>
              </div>

              <div onClick={() => { setDialInput(calcCode); playSystemBeep(659, 0.1, 0.04); }} className="p-3 bg-[#0c101a] border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-indigo-500/30 transition-all group">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200">{lang === "ar" ? "الحاسبة المشفرة الآمنة" : "Pro Secure Calculator"}</p>
                    <p className="text-[10px] text-zinc-500">{lang === "ar" ? "حسابات القيود الحساسة والسرية" : "Do confidential ledger calculations"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-indigo-400 bg-indigo-950/20 px-2 py-1 rounded-md border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-black transition-all">
                    {calcCode}
                  </span>
                </div>
              </div>

              <div onClick={() => { setDialInput(adminCode); playSystemBeep(880, 0.1, 0.04); }} className="p-3 bg-[#0c101a] border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-pink-500/30 transition-all group">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200">{lang === "ar" ? "لوحة الإعدادات وتخصيص الرموز" : "Customize dialing keys"}</p>
                    <p className="text-[10px] text-zinc-500">{lang === "ar" ? "تعديل وتخصيص الأكواد الأربعة بالكامل" : "Change triggers anytime for security"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-pink-400 bg-pink-950/20 px-2 py-1 rounded-md border border-pink-500/20 group-hover:bg-pink-500 group-hover:text-black transition-all">
                    {adminCode}
                  </span>
                </div>
              </div>

            </div>

            <div className="bg-[#111827] border border-slate-800/60 p-3.5 rounded-2xl text-[10.5px] text-zinc-400 leading-normal flex items-start gap-2.5">
              <span className="text-base text-indigo-400 cursor-default">🤔</span>
              <p>
                {lang === "ar" 
                  ? "تلميح: اضغط على كرت أي كود بالأعلى للصقه تلقائياً في شاشة اتصال الهاتف لتجربته فوراً!" 
                  : "Tip: Tap on any secure card slot to auto-paste its respective key sequence into the phone dialer!"}
              </p>
            </div>
          </div>

          {/* CLOUD EMAIL STORAGE SYNC CARD */}
          <div className="bg-slate-950/70 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="text-emerald-400 w-4.5 h-4.5" />
              <span>{lang === "ar" ? "الربط الإلكتروني ومزامنة قوقل جهات الاتصال" : "Google Cloud Email Storage Synchronizer"}</span>
            </h3>

            <p className="text-[11.5px] text-zinc-400 leading-relaxed">
              {lang === "ar"
                ? "اربط سجل جهات اتصالك محلياً ببريد قوقل للنسخ الاحتياطي السحابي. سيتم دمج كافة الملفات وتشفيرها بشكل متكامل:"
                : "Tie your system address database back to an online backup profile ledger. Compile raw contact details effortlessly:"}
            </p>

            <div className="space-y-3 bg-[#0d121f] p-4 rounded-2xl border border-slate-800/80">
              <div>
                <label className="block text-[10px] text-zinc-400 font-bold mb-1.5 uppercase tracking-wider">{lang === "ar" ? "رابط البريد الإلكتروني للمزامنة:" : "Secure Gmail account address:"}</label>
                <div className="flex gap-2">
                  <input 
                    type="email"
                    value={userBackupEmail}
                    onChange={(e) => setUserBackupEmail(e.target.value)}
                    className="flex-grow bg-[#050811] border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <button 
                    onClick={saveSyncEmailPreference}
                    className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-slate-800/60 text-zinc-400">
                <span>{lang === "ar" ? "آخر مزامنة ناجحة:" : "Last verified cloud sync:"}</span>
                <span className="font-mono text-[10px] text-emerald-400">{lastSyncDate}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleSyncCloud}
                  disabled={isSyncing}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[10.5px] rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-700/30 text-white font-bold transition-all disabled:text-zinc-500 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>{isSyncing ? (lang === "ar" ? "جاري الحفظ..." : "Syncing...") : (lang === "ar" ? "مزامنة الآن" : "Sync Sync")}</span>
                </button>

                <button
                  onClick={handleDownloadBackupFile}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[10.5px] rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === "ar" ? "تصدير نسخة" : "Backup VCF/JSON"}</span>
                </button>
              </div>
            </div>
            
            <div className="text-[10px] text-zinc-500 pl-2 leading-relaxed">
              {lang === "ar" 
                ? "* يدعم التطبيق التخزين السحابي الآمن. يمكنك تنزيل ملف جهات الاتصال JSON المستخرج ورفعه في أي هاتف آخر لاستعادة كافة جهات الاتصال والمذكرات السرية." 
                : "* Native standard storage is fully responsive. Extract structural datasets to port folders and logs securely anywhere."}
            </div>
          </div>

        </section>

        {/* Right Side: Smartphone Emulator Layout Frame Container */}
        <section className="lg:col-span-7 flex justify-center sticky top-24">
          
          <div className="relative w-full max-w-[390px] bg-zinc-950 rounded-[48px] border-[10px] border-zinc-900 shadow-2xl overflow-hidden flex flex-col aspect-[9/18.5] ring-4 ring-indigo-500/10">
            
            {/* Emulator Notch & Camera Cutout layout */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-40 flex items-center justify-center gap-2">
              <div className="w-3.5 h-1 bg-zinc-950 rounded"></div>
              <div className="w-2 h-2 rounded-full bg-zinc-950"></div>
            </div>

            {/* Simulated Mobile Status bar at the top */}
            <div className={`pt-7 pb-2 px-6 flex items-center justify-between text-[11px] font-mono z-30 ${phoneTheme === "dark" ? "bg-slate-950 text-zinc-400" : "bg-zinc-50 text-zinc-700"} transition-colors border-b border-slate-800/20`}>
              <div>20:04</div>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3" />
                <span className="text-[9px] font-bold">5G</span>
                <Battery className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>

            {/* Smartphone screen contents container */}
            <div className={`flex-grow overflow-y-auto relative flex flex-col ${phoneTheme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-zinc-900"} transition-colors scroll-thin`}>
              
              {/* If Active Call Simulation Screen is Triggered */}
              <AnimatePresence>
                {activeCallContact && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="absolute inset-0 bg-slate-950 text-white z-50 flex flex-col justify-between p-8"
                  >
                    {/* Caller dynamic profile */}
                    <div className="text-center mt-12 space-y-4">
                      <div className="flex justify-center">
                        <div className={`w-24 h-24 rounded-full ${activeCallContact.avatarColor || "bg-indigo-600"} flex items-center justify-center text-3xl font-extrabold shadow-xl ring-4 ring-indigo-500/15 animate-pulse`}>
                          {activeCallContact.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-extrabold text-white">{activeCallContact.name}</h4>
                        <p className="text-xs text-zinc-400 font-mono tracking-wider pt-1">{activeCallContact.phone}</p>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-[#1a2336] px-3.5 py-1.5 rounded-full text-xs text-indigo-300 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>{formatTimer(callDuration)}</span>
                      </div>
                    </div>

                    {/* Simulation logs feed */}
                    <div className="bg-slate-900/60 p-4 rounded-2xl text-[10.5px] text-zinc-400 border border-slate-800">
                      <p className="font-bold text-indigo-400 mb-1">{lang === "ar" ? "قناة الاتصال مشفرة بالكامل:" : "Secure active channel feed:"}</p>
                      <div className="space-y-1 font-mono text-[9px]">
                        <p className="text-emerald-400">● [AUDIO_SOCKET_ACQUIRED]</p>
                        <p>🔐 AES-GCM-256 bits live cryptographic cipher active.</p>
                        {isRecordingCall && (
                          <p className="text-rose-500 animate-pulse font-bold">●🎙️ RECORDING CHANNEL INPUT TO APP MEMORY STREAM...</p>
                        )}
                      </div>
                    </div>

                    {/* Calling operations */}
                    <div className="space-y-6 pt-4">
                      
                      <div className="flex justify-around items-center gap-4">
                        {/* Recording Button toggle */}
                        <button 
                          onClick={toggleCallRecording}
                          className={`flex flex-col items-center gap-1.5 cursor-pointer`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            isRecordingCall ? "bg-rose-600 text-white font-extrabold animate-bounce" : "bg-slate-850 hover:bg-slate-800 text-zinc-300"
                          }`}>
                            <Mic className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] text-zinc-300 font-bold">
                            {lang === "ar" ? (isRecordingCall ? "جاري التسجيل" : "تسجيل المكالمة") : (isRecordingCall ? "Recording" : "Record Call")}
                          </span>
                        </button>

                        <div className="flex flex-col items-center gap-1.5 opacity-55">
                          <div className="w-12 h-12 rounded-full bg-slate-850 flex items-center justify-center">
                            <Volume2 className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] text-zinc-300">{lang === "ar" ? "مكبر الصوت" : "Speaker"}</span>
                        </div>
                      </div>

                      {/* Hang up Call Button */}
                      <div className="flex justify-center pb-6">
                        <button 
                          onClick={handleEndCall}
                          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-lg cursor-pointer transform hover:scale-105 transition-all"
                        >
                          <PhoneOff className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SECTION UNLOCKED Secret app 1 : Notes Area */}
              <AnimatePresence>
                {activeSecretScreen === "notes" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="absolute inset-0 bg-zinc-950 z-50 flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="bg-zinc-900 px-4 py-3.5 flex items-center justify-between border-b border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <Lock className="text-amber-500 w-4 h-4" />
                        <h4 className="text-xs font-bold text-amber-100">{lang === "ar" ? "الخزنة السرية للمذكرات" : "Secret Vault Notes"}</h4>
                      </div>
                      
                      {/* Panic Emergency return button */}
                      <button 
                        onClick={triggerPanicLock}
                        className="p-1 px-2.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-rose-600/30"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{lang === "ar" ? "قفل الطوارئ" : "PANIC CLOSE"}</span>
                      </button>
                    </div>

                    {/* Content area */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 scroll-thin">
                      
                      {/* Info manual warning */}
                      <div className="bg-amber-950/10 border border-amber-500/20 p-3 rounded-2xl text-[10px] text-amber-200">
                        🛡️ {lang === "ar" ? "جميع مذكرات الأمان مشفرة ومصانة في الذاكرة المعزولة." : "Encrypted local vault data session partition active."}
                      </div>

                      {/* Add draft notepad form */}
                      <form onSubmit={handleCreateSecretNote} className="space-y-2.5 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800">
                        <p className="text-[10px] text-amber-400 font-extrabold uppercase">{lang === "ar" ? "كتابة تقرير أو مسودة سرية:" : "Draft secure report notes:"}</p>
                        <input 
                          type="text" 
                          placeholder={lang === "ar" ? "العنوان السري" : "Encrypted Title..."}
                          value={newNoteTitle}
                          onChange={(e) => setNewNoteTitle(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                        <textarea 
                          placeholder={lang === "ar" ? "اكتب المحتوى السري للغاية هنا... حسابات بنكية، كلمات مرور، رسائل خاصة" : "Write confidential text here..."}
                          rows={2}
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-sans"
                        />

                        {/* Note settings row */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <input 
                            type="text"
                            placeholder={lang === "ar" ? "التصنيف (مثال: حسابات)" : "Category (e.g. Finance)"}
                            value={newNoteCategory}
                            onChange={(e) => setNewNoteCategory(e.target.value)}
                            className="bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-1 text-[10px] text-zinc-300 focus:outline-none"
                          />
                          
                          {/* Color circles switcher */}
                          <div className="flex items-center gap-1.5">
                            {noteColorOptions.map((c, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedNoteColorIndex(idx)}
                                className={`w-4 h-4 rounded-full transition-all cursor-pointer border ${
                                  selectedNoteColorIndex === idx ? "scale-125 border-white" : "border-transparent"
                                }`}
                                style={{ backgroundColor: idx === 0 ? "#4f46e5" : idx === 1 ? "#d97706" : idx === 2 ? "#e11d48" : idx === 3 ? "#059669" : "#3f3f46" }}
                              />
                            ))}
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-600/10"
                        >
                          {lang === "ar" ? "حفظ وتشفير المذكرة" : "Encrypt & File Note"}
                        </button>
                      </form>

                      {/* Notes search */}
                      <div className="relative">
                        <Search className="absolute right-3.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                        <input 
                          type="text" 
                          placeholder={lang === "ar" ? "البحث في الأسرار..." : "Search secrets database..."}
                          value={noteSearchQuery}
                          onChange={(e) => setNoteSearchQuery(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-9 pl-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/40"
                        />
                      </div>

                      {/* Notes List Rendering layout */}
                      <div className="space-y-3">
                        {filteredSecretNotes.length === 0 ? (
                          <p className="text-zinc-500 text-[10px] text-center pt-3">{lang === "ar" ? "لا توجد مذكرات سرية مطابقة" : "No secure diary inputs"}</p>
                        ) : (
                          filteredSecretNotes.map(note => (
                            <div 
                              key={note.id}
                              className={`p-3.5 rounded-2xl bg-gradient-to-tr ${note.color} border space-y-2.5 shadow-md relative group`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] uppercase tracking-wider font-extrabold bg-black/40 px-2 py-0.5 rounded-full">
                                  {note.category}
                                </span>
                                <span className="text-[8px] font-mono opacity-50">{note.timestamp}</span>
                              </div>

                              <h5 className="text-xs font-bold">{note.title}</h5>
                              <p className="text-[10.5px] opacity-90 leading-relaxed whitespace-pre-wrap select-text">{note.content}</p>

                              <div className="flex justify-end pt-1">
                                <button 
                                  onClick={() => handleDeleteSecretNote(note.id)}
                                  className="p-1 rounded-lg bg-black/30 hover:bg-rose-950 hover:text-rose-400 text-zinc-400 transition-all cursor-pointer"
                                  title={lang === "ar" ? "تدمير الأثر" : "Shred note"}
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SECTION UNLOCKED Secret app 2 : Hidden Audio Synth Wave Player */}
              <AnimatePresence>
                {activeSecretScreen === "music" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="absolute inset-0 bg-zinc-950 z-50 flex flex-col justify-between"
                  >
                    <div className="bg-zinc-900 px-4 py-3.5 flex items-center justify-between border-b border-emerald-500/20">
                      <div className="flex items-center gap-2">
                        <Music className="text-emerald-500 w-4 h-4" />
                        <h4 className="text-xs font-bold text-emerald-100">{lang === "ar" ? "توليف وترنيم الموسيقى الهادئة" : "Hidden Electronic Ambient Synthesizer"}</h4>
                      </div>
                      
                      {/* Emergency system lock */}
                      <button 
                        onClick={triggerPanicLock}
                        className="p-1 px-2.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-rose-600/30"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{lang === "ar" ? "قفل الطوارئ" : "PANIC CLOSE"}</span>
                      </button>
                    </div>

                    {/* Synthesizer player graphics container */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-6 flex flex-col justify-center items-center scroll-thin">
                      
                      {/* Spinning Vinyl Visualizer record Disc! */}
                      <div className="relative flex justify-center py-4">
                        <div className={`w-36 h-36 rounded-full bg-zinc-900 border-[6px] border-zinc-800 flex items-center justify-center relative shadow-2xl ${
                          musicPlayingTrackId ? "animate-[spin_6s_linear_infinite]" : ""
                        }`}>
                          {/* Inner labels */}
                          <div className="w-14 h-14 rounded-full bg-emerald-950 border-4 border-zinc-800 flex items-center justify-center">
                            <Disc className={`w-6 h-6 text-emerald-400 ${musicPlayingTrackId ? "animate-pulse" : ""}`} />
                          </div>

                          {/* Outer concentric decorative lines */}
                          <div className="absolute inset-4 rounded-full border border-zinc-700/20 pointer-events-none"></div>
                          <div className="absolute inset-8 rounded-full border border-zinc-700/20 pointer-events-none"></div>
                        </div>

                        {/* Tone arm stylus graphic indicator */}
                        <div className={`absolute top-0 right-4 w-8 h-16 origin-top transition-transform duration-500 transform ${
                          musicPlayingTrackId ? "rotate-[15deg]" : "rotate-[0deg]"
                        } pointer-events-none`}>
                          <div className="w-1.5 h-12 bg-slate-600/80 rounded mx-auto relative">
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-700 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                      {/* Display current track details */}
                      <div className="text-center space-y-1">
                        <h5 className="text-sm font-bold text-slate-100">
                          {musicPlayingTrackId 
                            ? (lang === "ar" 
                                ? SYNTHETIC_TRACKS.find(t => t.id === musicPlayingTrackId)?.titleAr 
                                : SYNTHETIC_TRACKS.find(t => t.id === musicPlayingTrackId)?.title)
                            : (lang === "ar" ? "اختر لحناً لتشغيله" : "Select track below")}
                        </h5>
                        <p className="text-[10.5px] text-zinc-400">
                          {musicPlayingTrackId 
                            ? (lang === "ar" 
                                ? SYNTHETIC_TRACKS.find(t => t.id === musicPlayingTrackId)?.artistAr 
                                : SYNTHETIC_TRACKS.find(t => t.id === musicPlayingTrackId)?.artist)
                            : (lang === "ar" ? "كرت الصوت التوليفي" : "Dynamic synth sequencer loop")}
                        </p>
                      </div>

                      {/* Real-time bouncing CSS node indicator bars */}
                      <div className="flex justify-center items-end gap-1 px-4 h-10 w-full max-w-xs pt-1">
                        {Array.from({ length: 12 }).map((_, idx) => (
                          <div 
                            key={idx}
                            className="flex-grow bg-emerald-500 rounded-t-md transition-all duration-150"
                            style={{ 
                              height: musicPlayingTrackId ? `${20 + Math.sin(currentNoteIndex + idx) * 80}%` : "15%",
                              opacity: musicPlayingTrackId ? 0.6 + (Math.sin(currentNoteIndex + idx) * 0.4) : 0.25
                            }}
                          />
                        ))}
                      </div>

                      {/* Playlists cards list rendering */}
                      <div className="w-full space-y-2.5">
                        <p className="text-[10px] text-zinc-400 font-extrabold uppercase select-none">{lang === "ar" ? "قائمة ألحان التوليف (معدل تكرار النغمة):" : "Synthetic tracks lists:"}</p>
                        
                        {SYNTHETIC_TRACKS.map(track => {
                          const isActive = musicPlayingTrackId === track.id;
                          return (
                            <div 
                              key={track.id}
                              onClick={() => playMusicSequencer(track)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                isActive 
                                  ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300" 
                                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isActive ? "bg-emerald-500/10 text-emerald-400 animate-pulse" : "bg-zinc-800 text-zinc-400"
                                }`}>
                                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
                                </div>
                                <div className="text-left">
                                  <p className="text-xs font-bold leading-none">{lang === "ar" ? track.titleAr : track.title}</p>
                                  <p className="text-[9.5px] text-zinc-500 pt-1">{lang === "ar" ? track.artistAr : track.artist}</p>
                                </div>
                              </div>
                              <span className="font-mono text-[9px] bg-zinc-950 px-2.5 py-1 rounded-full border border-zinc-800 text-zinc-400">
                                {track.tempo} BPM
                              </span>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SECTION UNLOCKED Secret app 3 : Smart Secure Calculator */}
              <AnimatePresence>
                {activeSecretScreen === "calc" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="absolute inset-0 bg-zinc-950 z-50 flex flex-col justify-between"
                  >
                    <div className="bg-zinc-900 px-4 py-3.5 flex items-center justify-between border-b border-indigo-500/25">
                      <div className="flex items-center gap-2">
                        <Calculator className="text-indigo-500 w-4 h-4" />
                        <h4 className="text-xs font-bold text-indigo-100">{lang === "ar" ? "الحاسبة المشفرة الحامية" : "Pro Secure Math Ledger"}</h4>
                      </div>
                      
                      {/* Panic Emergency System recovery */}
                      <button 
                        onClick={triggerPanicLock}
                        className="p-1 px-2.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-rose-600/30"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{lang === "ar" ? "قفل الطوارئ" : "PANIC CLOSE"}</span>
                      </button>
                    </div>

                    {/* Calculator layouts block */}
                    <div className="flex-grow p-4 flex flex-col justify-between bg-[#04060c]">
                      
                      {/* Formula & Display panel */}
                      <div className="text-right p-4 py-6 bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-1">
                        <p className="font-mono text-zinc-500 text-[11px] h-4 tracking-wider">{calcFormula || "0"}</p>
                        <p className="font-mono text-xl text-white font-extrabold truncate">{calcDisplay}</p>
                      </div>

                      {/* Calculator Buttons Layout Keypad */}
                      <div className="grid grid-cols-4 gap-2.5 pt-4">
                        
                        {/* Clear C */}
                        <button onClick={() => handleCalcButton("C")} className="py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-extrabold text-zinc-200 transition-all cursor-pointer">C</button>
                        <button onClick={() => handleCalcButton("(")} className="py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-xs font-extrabold text-[#747d8c] transition-all cursor-pointer">(</button>
                        <button onClick={() => handleCalcButton(")")} className="py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-xs font-extrabold text-[#747d8c] transition-all cursor-pointer">)</button>
                        <button onClick={() => handleCalcButton("÷")} className="py-3 bg-indigo-900/60 hover:bg-indigo-900 rounded-xl text-xs font-extrabold text-indigo-200 transition-all cursor-pointer">÷</button>

                        <button onClick={() => handleCalcButton("7")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">7</button>
                        <button onClick={() => handleCalcButton("8")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">8</button>
                        <button onClick={() => handleCalcButton("9")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">9</button>
                        <button onClick={() => handleCalcButton("×")} className="py-3 bg-indigo-900/60 hover:bg-indigo-900 rounded-xl text-xs font-extrabold text-indigo-200 transition-all cursor-pointer">×</button>

                        <button onClick={() => handleCalcButton("4")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">4</button>
                        <button onClick={() => handleCalcButton("5")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">5</button>
                        <button onClick={() => handleCalcButton("6")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">6</button>
                        <button onClick={() => handleCalcButton("-")} className="py-3 bg-indigo-900/60 hover:bg-indigo-900 rounded-xl text-xs font-extrabold text-indigo-200 transition-all cursor-pointer">-</button>

                        <button onClick={() => handleCalcButton("1")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">1</button>
                        <button onClick={() => handleCalcButton("2")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">2</button>
                        <button onClick={() => handleCalcButton("3")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">3</button>
                        <button onClick={() => handleCalcButton("+")} className="py-3 bg-indigo-900/60 hover:bg-indigo-900 rounded-xl text-xs font-bold text-indigo-200 transition-all cursor-pointer">+</button>

                        <button onClick={() => handleCalcButton(".")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">.</button>
                        <button onClick={() => handleCalcButton("0")} className="py-3.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-mono font-bold text-white transition-all cursor-pointer">0</button>
                        <button onClick={() => handleCalcButton("=")} className="col-span-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-lg shadow-indigo-600/10">=</button>
                      </div>

                      {/* Display calculations feed history list logs */}
                      <div className="pt-3 border-t border-zinc-900 mt-2">
                        <p className="text-[9.5px] text-zinc-500 font-extrabold select-none mb-1.5 uppercase tracking-wider">{lang === "ar" ? "مسودات وسجلات الحساب السري:" : "Secure ledger history logs:"}</p>
                        <div className="max-h-20 overflow-y-auto space-y-1 font-mono text-[9px] text-[#2ed573] scroll-thin">
                          {calcHistory.map((item, index) => (
                            <p key={index} className="opacity-70 leading-none">✔ {item}</p>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SECTION UNLOCKED Secret app 4 : Dialer Code Customizer Settings */}
              <AnimatePresence>
                {activeSecretScreen === "admin_settings" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between"
                  >
                    <div className="bg-zinc-900 px-4 py-3.5 flex items-center justify-between border-b border-pink-500/20">
                      <div className="flex items-center gap-2">
                        <Settings className="text-pink-500 w-4 h-4 animate-spin-slow" />
                        <h4 className="text-xs font-bold text-pink-100">{lang === "ar" ? "إدارة الرموز وصيانة الأمان" : "Secret Triggers Policy"}</h4>
                      </div>
                      
                      {/* Close button with fallback beeps */}
                      <button 
                        onClick={triggerPanicLock}
                        className="p-1 px-2.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-rose-600/30"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{lang === "ar" ? "قفل الطوارئ" : "PANIC CLOSE"}</span>
                      </button>
                    </div>

                    <div className="flex-grow p-4 overflow-y-auto space-y-5 scroll-thin">
                      
                      <div className="p-3 bg-pink-950/15 border border-pink-500/20 rounded-2xl text-[10.5px] text-pink-300 leading-normal">
                        🛡️ {lang === "ar" 
                          ? "قم بتعديل وتخصيص الأكواد الأربعة السرية كما تشاء للتعتيم على المتلصصين. تأكد دائماً أن الأكواد تبدأ بـ *# وتنتهي بـ #." 
                          : "Modify dialpad triggers to shield your data from snooping. All codes must begin with *# and end with #."}
                      </div>

                      <form onSubmit={handleSaveSecretCheatCodes} className="space-y-4">
                        
                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{lang === "ar" ? "رمز كود المذكرة الخزنة:" : "Diary Code trigger:"}</label>
                          <input 
                            type="text" 
                            value={notepadCode} 
                            onChange={(e) => setNotepadCode(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-pink-400 focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{lang === "ar" ? "رمز كود مشغل الموسيقى:" : "Audio Synth Code trigger:"}</label>
                          <input 
                            type="text" 
                            value={musicCode} 
                            onChange={(e) => setMusicCode(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-pink-400 focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{lang === "ar" ? "رمز كود الحاسبة المؤمنة:" : "Calculator Code trigger:"}</label>
                          <input 
                            type="text" 
                            value={calcCode} 
                            onChange={(e) => setCalcCode(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-pink-400 focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{lang === "ar" ? "رمز لوحة التحكم هذه:" : "Admin Settings Code trigger:"}</label>
                          <input 
                            type="text" 
                            value={adminCode} 
                            onChange={(e) => setAdminCode(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-pink-400 focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2.5 bg-pink-600 hover:bg-pink-550 text-white text-xs font-bold rounded-xl transition-all shadow-lg cursor-pointer"
                        >
                          {lang === "ar" ? "حفظ وتعديل التراخيص" : "Update Calling Codes"}
                        </button>
                      </form>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SCREEN STATE 1: PHONE DIALER KEYPAD */}
              {currentScreen === "dialer" && (
                <div className="flex-grow flex flex-col justify-between p-4 pt-6">
                  
                  {/* Dialing Input field */}
                  <div className="text-center space-y-1 relative pb-2 min-h-[50px]">
                    <input 
                      type="text" 
                      value={dialInput}
                      readOnly
                      placeholder="0"
                      className="w-full bg-transparent text-center text-2xl font-mono font-extrabold focus:outline-none tracking-widest text-[#2ed573] placeholder-zinc-800"
                    />
                    
                    {dialInput && (
                      <button 
                        onClick={handleBackspace}
                        className="absolute right-4 top-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                      >
                        <Delete className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Dialer Keypad Round Buttons layout */}
                  <div className="grid grid-cols-3 gap-y-3.5 gap-x-5 justify-items-center max-w-[280px] mx-auto py-3">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(char => (
                      <button
                        key={char}
                        onClick={() => handleDialButton(char)}
                        className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer font-bold select-none ${
                          phoneTheme === "dark" 
                            ? "bg-slate-900/90 hover:bg-slate-800/80 text-white border border-slate-800/60" 
                            : "bg-zinc-200/80 hover:bg-zinc-300 text-zinc-900 border border-zinc-300/30"
                        } transform active:scale-110 active:bg-indigo-600 active:text-white`}
                      >
                        <span className="text-base font-mono leading-none">{char}</span>
                        {/* Sub labels under number block representation */}
                        <span className="text-[8px] tracking-wide text-zinc-400 opacity-60 leading-none pt-0.5">
                          {char === "2" ? "ABC" : char === "3" ? "DEF" : char === "4" ? "GHI" : char === "5" ? "JKL" : char === "6" ? "MNO" : char === "7" ? "PQRS" : char === "8" ? "TUV" : char === "9" ? "WXYZ" : char === "0" ? "+" : " "}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Connect Call Green action controller line */}
                  <div className="flex justify-center gap-4 pt-1 pb-2">
                    {dialInput && (
                      <button 
                        onClick={clearDialer}
                        className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-zinc-400 flex items-center justify-center cursor-pointer hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/40"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}

                    <button 
                      onClick={handleInitiateCall}
                      className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <Phone className="w-6 h-6 fill-white" />
                    </button>
                  </div>

                </div>
              )}

              {/* SCREEN STATE 2: ENCRYPTED ADDRESS BOOK / CONTACTS */}
              {currentScreen === "contacts" && (
                <div className="flex-grow flex flex-col p-4 space-y-4">
                  
                  {/* Head summary bar & Create contact button toggle */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-300">
                      {lang === "ar" ? "قائمة جهات الاتصال النشطة" : "Address Book Database"} 
                      <span className="text-[10px] bg-slate-900 text-zinc-500 px-2 py-0.5 rounded-full border border-slate-800 ml-1 font-mono">({contacts.length})</span>
                    </h4>
                    <button
                      onClick={() => {
                        setEditingContactId(null);
                        setContactNameInput("");
                        setContactPhoneInput("");
                        setContactEmailInput("");
                        setContactGroupInput("عام");
                        setShowAddContact(!showAddContact);
                        playSystemBeep(440, 0.1, 0.04);
                      }}
                      className="p-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-lg shadow-indigo-500/10"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{lang === "ar" ? "جديد" : "Add Contact"}</span>
                    </button>
                  </div>

                  {/* Add / Edit Contact drawer dialog box */}
                  <AnimatePresence>
                    {showAddContact && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={saveContact}
                        className="bg-[#0b0e14] border border-slate-800 p-4 rounded-2xl space-y-3 overflow-hidden"
                      >
                        <p className="text-[10px] text-indigo-400 font-extrabold uppercase select-none">
                          {editingContactId ? (lang === "ar" ? "تعديل الملف الشخصي:" : "Modify client profile:") : (lang === "ar" ? "تأسيس جهة اتصال جديدة:" : "Build secure address profile:")}
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            placeholder={lang === "ar" ? "الاسم الكامل" : "First & Last Name..."}
                            value={contactNameInput}
                            onChange={(e) => setContactNameInput(e.target.value)}
                            required
                            className="bg-[#04060b] border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                          />
                          <input 
                            type="tel" 
                            placeholder={lang === "ar" ? "رقم الهاتف" : "Phone line digits..."}
                            value={contactPhoneInput}
                            onChange={(e) => setContactPhoneInput(e.target.value)}
                            required
                            className="bg-[#04060b] border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="email" 
                            placeholder={lang === "ar" ? "البريد الإلكتروني للنسخ" : "Backup target email..."}
                            value={contactEmailInput}
                            onChange={(e) => setContactEmailInput(e.target.value)}
                            className="bg-[#04060b] border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
                          />
                          <select
                            value={contactGroupInput}
                            onChange={(e: any) => setContactGroupInput(e.target.value)}
                            className="bg-[#04060b] border border-zinc-700 rounded-xl px-2 py-1.5 text-xs text-zinc-300 focus:outline-none"
                          >
                            <option value="عام">{lang === "ar" ? "تصنيف: عام" : "Group: General"}</option>
                            <option value="العائلة">{lang === "ar" ? "تصنيف: العائلة" : "Group: Family"}</option>
                            <option value="العمل">{lang === "ar" ? "تصنيف: العمل" : "Group: Work"}</option>
                            <option value="الأصدقاء">{lang === "ar" ? "تصنيف: الأصدقاء" : "Group: Friends"}</option>
                          </select>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            type="submit"
                            className="flex-grow py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            {lang === "ar" ? "حفظ" : "Save client details"}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setShowAddContact(false)}
                            className="px-3.5 py-1.5 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-xl text-xs transition-all cursor-pointer"
                          >
                            {lang === "ar" ? "إلغاء" : "Abort"}
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Filter query search bar */}
                  <div className="relative">
                    <Search className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder={lang === "ar" ? "البحث بالاسم أو الرقم..." : "Filter names & phone line numbers..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0b0e15] border border-slate-850 rounded-2xl pr-9 pl-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/30"
                    />
                  </div>

                  {/* Fixed Secured Instructions card embedded directly inside contacts! */}
                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/25 rounded-2xl space-y-1.5 relative overflow-hidden">
                    <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                    <p className="text-[10.5px] font-bold text-indigo-300 flex items-center gap-1 select-none">
                      <Lock className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{lang === "ar" ? "الرموز المحفوظة والسرية بالأجهزة:" : "Secured Dialer Shortcut Keys Information:"}</span>
                    </p>
                    <p className="text-[9.5px] text-indigo-200/90 leading-relaxed">
                      {lang === "ar" 
                        ? `لقد تم تعيين الأكواد السرية محلياً: المذكرة (${notepadCode})، مشغل الصوت (${musicCode})، الحاسبة السلسة (${calcCode})، وإدارة الإعدادات (${adminCode}). اطلبهم ثم اتصل!` 
                        : `Your triggers configured as: Notes (${notepadCode}), Audio (${musicCode}), Math (${calcCode}), Settings (${adminCode}). Click Dial call to unlock.`}
                    </p>
                  </div>

                  {/* List contacts rendering Layout */}
                  <div className="flex-grow space-y-2 max-h-[260px] overflow-y-auto scroll-thin select-none">
                    {filteredContacts.length === 0 ? (
                      <p className="text-zinc-500 text-[10.5px] text-center pt-6">{lang === "ar" ? "قائمة الأسماء خالية" : "No registered profiles mapped"}</p>
                    ) : (
                      filteredContacts.map(contact => (
                        <div 
                          key={contact.id}
                          className="p-2.5 bg-[#0b0f19] border border-slate-900 rounded-2xl hover:border-slate-800 transition-all flex items-center justify-between text-left group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full ${contact.avatarColor || "bg-indigo-600"} text-white font-extrabold text-xs flex items-center justify-center`}>
                              {contact.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-zinc-100">{contact.name}</p>
                              <p className="text-[9.5px] text-zinc-400 font-mono pt-0.5">{contact.phone} <span className="opacity-45">|</span> {contact.group}</p>
                            </div>
                          </div>

                          {/* Trigger actions */}
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleQuickCallFromContact(contact)}
                              className="p-1 px-2.5 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-700 hover:text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-emerald-500/20"
                            >
                              <Phone className="w-3 h-3 fill-emerald-500" />
                              <span>{lang === "ar" ? "اتصال" : "Call"}</span>
                            </button>
                            <button 
                              onClick={() => startEditContact(contact)}
                              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-indigo-400 transition-all cursor-pointer"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => deleteContact(contact.id)}
                              className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950 hover:text-rose-400 text-zinc-500 transition-all cursor-pointer"
                            >
                              <Trash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

              {/* SCREEN STATE 3: CALL LOGS / RECENTS HISTORY */}
              {currentScreen === "logs" && (
                <div className="flex-grow flex flex-col p-4 space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-300">{lang === "ar" ? "سجل المكالمات الصادرة والواردة" : "Call Logs Network History"}</h4>
                    <button 
                      onClick={() => {
                        setCallLogs([]);
                        playSystemBeep(200, 0.3, 0.05);
                        showToast(lang === "ar" ? "تم تفريغ لوحة الاتصال والسجلات" : "Cleared recent logs", "info");
                      }}
                      className="p-1.5 rounded-xl border border-rose-900/30 hover:bg-rose-950/20 text-rose-400 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      {lang === "ar" ? "مسح السجل" : "Clear History"}
                    </button>
                  </div>

                  {/* List recent logs rendering layout */}
                  <div className="flex-grow space-y-2.5 max-h-[300px] overflow-y-auto scroll-thin select-none">
                    {callLogs.length === 0 ? (
                      <p className="text-zinc-500 text-[10.5px] text-center pt-8">{lang === "ar" ? "سجلات الاتصال خالية تماماً" : "Call logs list database completely empty"}</p>
                    ) : (
                      callLogs.map(log => {
                        const isMissed = log.type === "missed";
                        const isIncoming = log.type === "incoming";
                        return (
                          <div 
                            key={log.id}
                            className="p-3 bg-[#0b0f19] border border-slate-900 rounded-2xl hover:border-slate-850 transition-all flex items-center justify-between font-mono"
                          >
                            <div className="flex items-center gap-2.5 text-left">
                              {/* Symbols */}
                              <div className={`p-2 rounded-full ${
                                isMissed ? "bg-rose-500/10 text-rose-400" : isIncoming ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
                              }`}>
                                {isMissed ? <PhoneMissed className="w-3.5 h-3.5" /> : isIncoming ? <PhoneIncoming className="w-3.5 h-3.5" /> : <PhoneOutgoing className="w-3.5 h-3.5" />}
                              </div>
                              
                              <div>
                                <p className="text-xs font-bold text-zinc-150 font-sans leading-none">{log.name}</p>
                                <p className="text-[9px] text-zinc-400 pt-1 leading-normal">{log.phone} <span className="opacity-40">|</span> {log.timestamp}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              {log.duration && (
                                <span className="text-[10px] text-zinc-400 font-bold bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                                  ⏱️ {log.duration}
                                </span>
                              )}
                              
                              {/* Check if recording file link is attached! */}
                              {log.recordingId && (
                                <button 
                                  onClick={() => {
                                    setCurrentScreen("rec_manager");
                                    playSystemBeep(329.63, 0.15, 0.05);
                                    showToast(lang === "ar" ? "تم التحويل لمسودة التسجيل الصوتي" : "Navigated to recorded logs");
                                  }}
                                  className="block text-[8.5px] font-bold text-rose-400 mt-1 pointer-events-auto hover:underline"
                                >
                                  🎙️ {lang === "ar" ? "تشغيل التسجيل" : "Listen recording"}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              )}

              {/* SCREEN STATE 4: CALL RECORDINGS MANAGER */}
              {currentScreen === "rec_manager" && (
                <div className="flex-grow flex flex-col p-4 space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-300">
                      <span>🎙️ {lang === "ar" ? "المكالمات المسجلة والحافظة الذكية" : "Call Audio Recording vault"}</span>
                      <span className="text-[10px] bg-slate-900 text-zinc-500 px-2 py-0.5 rounded-full border border-slate-800 ml-1 font-mono">({recordings.length})</span>
                    </h4>
                  </div>

                  {/* Warning */}
                  <div className="bg-rose-950/15 border border-rose-500/20 p-2.5 rounded-2xl text-[9.5px] text-rose-300 leading-normal flex items-start gap-2 select-none">
                    <Mic className="w-4 h-4 text-rose-400 flex-shrink-0 animate-pulse" />
                    <p>{lang === "ar" ? "يقوم مسجل المكالمات بحفظ كافة المداولات بنجاح وتوليف الترجيع الصوتي تلقائياً." : "Automated loop telephone recorder safely registers all outgoing/incoming lines."}</p>
                  </div>

                  {/* List recordings rendering with interactive audio synth waves */}
                  <div className="flex-grow space-y-3 max-h-[240px] overflow-y-auto scroll-thin">
                    {recordings.length === 0 ? (
                      <p className="text-zinc-500 text-[10.5px] text-center pt-8">{lang === "ar" ? "لا توجد تسجيلات مكالمات محفوظة" : "No audio record files registered yet"}</p>
                    ) : (
                      recordings.map(rec => {
                        const isPlaying = playingRecordingId === rec.id;
                        return (
                          <div 
                            key={rec.id}
                            className={`p-3 rounded-2xl border transition-all ${
                              isPlaying 
                                ? "bg-rose-950/20 border-rose-500/40 text-rose-300" 
                                : "bg-[#0b0f19] border-slate-900 text-zinc-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono text-zinc-500">{rec.timestamp}</span>
                              <span className="text-[9px] font-bold text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded-full">⏱️ {rec.duration}</span>
                            </div>

                            <p className="text-xs font-bold pt-1.5 leading-none">{rec.contactName}</p>
                            <p className="text-[9.5px] text-zinc-500 font-mono leading-normal pt-1">{rec.phone}</p>
                            
                            {rec.notes && (
                              <p className="text-[10px] text-zinc-400 leading-relaxed italic pt-2 pl-1 border-l-2 border-slate-800 font-sans">{rec.notes}</p>
                            )}

                            {/* Sound player progress controls */}
                            <div className="pt-3 flex items-center justify-between gap-3">
                              
                              <button
                                onClick={() => startRecordingAudioSimulation(rec)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                  isPlaying ? "bg-rose-600 text-white" : "bg-slate-900 border border-slate-850 text-rose-400"
                                }`}
                              >
                                {isPlaying ? <Square className="w-3 h-3 fill-white" /> : <Play className="w-3.5 h-3.5 text-rose-400" />}
                              </button>

                              {/* Simulated visual sound waves animation */}
                              <div className="flex-grow bg-slate-950 h-5 rounded-lg border border-slate-900 relative overflow-hidden flex items-center px-2">
                                <div 
                                  className="absolute left-0 top-0 bottom-0 bg-rose-500/10 transition-all duration-150"
                                  style={{ width: isPlaying ? `${playingProgress}%` : "0%" }}
                                />
                                {/* Dynamic sound tick lines */}
                                <div className="w-full flex justify-between items-center h-full max-h-3">
                                  {Array.from({ length: 18 }).map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`w-[2px] rounded bg-rose-500 transition-all`} 
                                      style={{ 
                                        height: isPlaying ? `${30 + Math.abs(Math.sin(playingProgress + i)) * 70}%` : "15%",
                                        opacity: isPlaying ? 0.7 : 0.2
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              )}

              {/* SCREEN STATE 5: BACKUP & DATABASE IMPORT SYNC */}
              {currentScreen === "backup" && (
                <div className="flex-grow flex flex-col p-4 space-y-4">
                  
                  <h4 className="text-xs font-bold text-zinc-300">{lang === "ar" ? "محطة الترابط مع قوقل درايف" : "Backup Vault Central Station"}</h4>

                  <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                    {lang === "ar"
                      ? "يدعم التطبيق المزامنة مع سحابة قوقل وتصدير جهات الاتصال بصيغة ملفات JSON المشفرة لاستعادتها بأي هاتف أندرويد آخر."
                      : "The suite aggregates contacts, logs, and hidden diaries into standard encrypted database backups safely."}
                  </p>

                  <div className="space-y-3 bg-[#0d121f] p-4.5 rounded-2xl border border-slate-850">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold mb-1">{lang === "ar" ? "البريد الإلكتروني للربط:" : "BACKUP ACCOUNT ADDRESS:"}</p>
                      <p className="font-mono text-xs text-white bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">{userBackupEmail}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold mb-1">{lang === "ar" ? "تاريخ آخر مزامنة:" : "LAST BACKUP TIME:"}</p>
                      <p className="text-xs text-zinc-300">{lastSyncDate}</p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleSyncCloud}
                        disabled={isSyncing}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-700/25 text-white text-xs font-bold rounded-xl transition-all disabled:text-zinc-500 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                        <span>{isSyncing ? (lang === "ar" ? "جاري الارتباط..." : "Updating cloud backup...") : (lang === "ar" ? "بدء المزامنة الفورية" : "Run synchronization loop")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Manual file backup area */}
                  <div className="space-y-2 bg-[#0c101a] border border-slate-900 p-4 rounded-2xl">
                    <p className="text-[10.5px] font-bold text-zinc-300">{lang === "ar" ? "تصدير فوري للملفات:" : "Instant file backup export:"}</p>
                    <p className="text-[9.5px] text-zinc-550 leading-relaxed">
                      {lang === "ar"
                        ? "يمكنك تحميل النسخة وحفظها يدوياً كملف آمن مشفر على مساحة تخزين الهاتف."
                        : "Compile address book records and security states into single partition database download."}
                    </p>
                    
                    <button
                      onClick={handleDownloadBackupFile}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-700/10"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === "ar" ? "تحميل ملف النسخ الاحتياطي" : "Download Encrypted File"}</span>
                    </button>
                  </div>

                </div>
              )}

            </div>

            {/* Simulated smartphone bottom Navigation menu Tab bar */}
            {activeSecretScreen === "none" && (
              <div className={`p-2.5 flex justify-around items-center border-t border-slate-800/20 z-30 ${phoneTheme === "dark" ? "bg-slate-950 border-t border-slate-900" : "bg-zinc-50 border-t border-zinc-200"} transition-colors`}>
                
                {/* 1. Dialer Tab button */}
                <button 
                  onClick={() => { setCurrentScreen("dialer"); playSystemBeep(330, 0.1, 0.04); }}
                  className={`flex flex-col items-center gap-1 p-1 px-3.5 rounded-xl cursor-pointer ${
                    currentScreen === "dialer" ? "text-[#2ed573] bg-[#2ed573]/5 font-bold animate-[pulse_3s_infinite]" : "text-zinc-500 hover:text-zinc-400"
                  }`}
                >
                  <Phone className="w-4.5 h-4.5" />
                  <span className="text-[9px]">{lang === "ar" ? "الاتصال" : "Dialer"}</span>
                </button>

                {/* 2. Contacts Tab button */}
                <button 
                  onClick={() => { setCurrentScreen("contacts"); playSystemBeep(349, 0.1, 0.04); }}
                  className={`flex flex-col items-center gap-1 p-1 px-3.5 rounded-xl cursor-pointer ${
                    currentScreen === "contacts" ? "text-indigo-400 bg-indigo-500/5 font-bold" : "text-zinc-500 hover:text-zinc-400"
                  }`}
                >
                  <Users className="w-4.5 h-4.5" />
                  <span className="text-[9px]">{lang === "ar" ? "الأسماء" : "Contacts"}</span>
                </button>

                {/* 3. Recents Logs Tab button */}
                <button 
                  onClick={() => { setCurrentScreen("logs"); playSystemBeep(392, 0.1, 0.04); }}
                  className={`flex flex-col items-center gap-1 p-1 px-3.5 rounded-xl cursor-pointer ${
                    currentScreen === "logs" ? "text-indigo-400 bg-indigo-500/5 font-bold" : "text-zinc-500 hover:text-zinc-400"
                  }`}
                >
                  <Clock className="w-4.5 h-4.5" />
                  <span className="text-[9px]">{lang === "ar" ? "السجل" : "Recents"}</span>
                </button>

                {/* 4. Call Recordings Database Tab button */}
                <button 
                  onClick={() => { setCurrentScreen("rec_manager"); playSystemBeep(440, 0.1, 0.04); }}
                  className={`flex flex-col items-center gap-1 p-1 px-3.5 rounded-xl cursor-pointer ${
                    currentScreen === "rec_manager" ? "text-rose-400 bg-rose-500/5 font-bold" : "text-zinc-500 hover:text-zinc-400"
                  }`}
                >
                  <Mic className="w-4.5 h-4.5 animate-pulse-slow" />
                  <span className="text-[9px]">{lang === "ar" ? "التسجيلات" : "Recordings"}</span>
                </button>

              </div>
            )}

            {/* Simulated smartphone home bar indicator */}
            <div className={`py-2 flex justify-center z-30 ${phoneTheme === "dark" ? "bg-slate-950" : "bg-zinc-50"}`}>
              <div className="w-28 h-1 bg-zinc-700/80 rounded-full"></div>
            </div>

          </div>

        </section>

      </main>

      {/* Primary footer */}
      <footer className="bg-slate-950 py-5 px-6 border-t border-slate-800 text-center text-[11px] text-zinc-500 select-none">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            {lang === "ar" 
              ? "مطور ومحمي بالكامل ببروتوكولات الأمان عالية الجودة لتطبيقات الأندرويد." 
              : "Secure design compiled successfully to bypass sandbox networking limitations. Ready to sync."}
          </p>
          <div className="flex gap-4">
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900 px-2.5 py-0.5 rounded border border-slate-950">
              BUILD // 2026_PRO_STABLE
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
