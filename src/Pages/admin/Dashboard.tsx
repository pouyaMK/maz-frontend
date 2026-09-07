import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, Crown, Check, Loader2, Users, UserCheck, X } from "lucide-react";
import {
  searchParticipants,
  checkIn,
  getStats,
  clearToken,
  ApiError,
  type AdminParticipant,
  type EventStats,
} from "../../lib/api";

const SEARCH_DEBOUNCE_MS = 300;

const Dashboard = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<AdminParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [stats, setStats] = useState<EventStats | null>(null);

  // آیدی مهمون‌هایی که همین الان دارن چک‌این می‌شن (برای غیرفعال کردن دکمه حین درخواست)
  const [checkingInIds, setCheckingInIds] = useState<Set<number>>(new Set());

  // مهمونی که منتظر تأیید کاربره (دیالوگ تأیید باز است روی این نفر)
  // چک‌این idempotent و یک‌طرفه است (بک‌اند راهی برای undo نداره)، پس قبل از
  // ثبت نهایی از اپراتور تأیید می‌گیریم تا کلیک اشتباهی قابل جبران نباشه.
  const [pendingParticipant, setPendingParticipant] = useState<AdminParticipant | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestSeq = useRef(0);

  // ---------- بارگذاری اولیه‌ی لیست (بدون سرچ) + آمار ----------
  const runSearch = useCallback((q: string) => {
    const seq = ++requestSeq.current;
    setLoading(true);
    setLoadError(null);

    searchParticipants(q || undefined, 50)
      .then((data) => {
        if (seq !== requestSeq.current) return; // پاسخ قدیمی، نادیده بگیر
        setResults(data);
      })
      .catch((err) => {
        if (seq !== requestSeq.current) return;
        setResults([]);
        setLoadError(
          err instanceof ApiError ? err.message : "خطا در ارتباط با سرور. دوباره تلاش کنید."
        );
      })
      .finally(() => {
        if (seq !== requestSeq.current) return;
        setLoading(false);
      });
  }, []);

  const refreshStats = useCallback(() => {
    getStats()
      .then(setStats)
      .catch(() => {
        // آمار کلی حیاتی نیست؛ اگه نگرفت فقط نشون داده نمیشه
      });
  }, []);

  useEffect(() => {
    runSearch("");
    refreshStats();
  }, [runSearch, refreshStats]);

  // ---------- سرچ زنده با debounce ----------
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, runSearch]);

  // ---------- خروج از حساب ----------
  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  // ---------- درخواست ثبت ورود (باز کردن دیالوگ تأیید) ----------
  const requestCheckIn = (participant: AdminParticipant) => {
    if (participant.checked_in) return; // از قبل ثبت شده، کاری نکن
    if (checkingInIds.has(participant.id)) return;
    setPendingParticipant(participant);
  };

  const cancelCheckIn = () => setPendingParticipant(null);

  // ---------- ثبت نهایی ورود (بعد از تأیید در دیالوگ) ----------
  const confirmCheckIn = async () => {
    const participant = pendingParticipant;
    if (!participant) return;

    setPendingParticipant(null);
    setCheckingInIds((prev) => new Set(prev).add(participant.id));

    try {
      const res = await checkIn(participant.id);
      setResults((prev) =>
        prev.map((p) => (p.id === participant.id ? res.participant : p))
      );
      refreshStats();
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? err.message : "ثبت ورود انجام نشد. دوباره تلاش کنید."
      );
    } finally {
      setCheckingInIds((prev) => {
        const next = new Set(prev);
        next.delete(participant.id);
        return next;
      });
    }
  };

  return (
    <div dir="rtl" className="min-h-dvh w-full bg-[#03071a] text-white">
      {/* ==================================================
          HEADER
      ================================================== */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#03071a]/95 backdrop-blur">
        <div className="mx-auto flex w-[calc(100%-32px)] max-w-4xl items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/img/logo-landing.png" alt="MAZ" className="h-9 w-auto" />
            <span className="text-sm font-semibold text-white/80 mt-3">پنل ثبت ورود</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={17} />
            <span>خروج</span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-[calc(100%-32px)] max-w-4xl flex-col gap-5 py-6">
        {/* ==================================================
            STATS
        ================================================== */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={<Users size={18} />}
              label="کل مهمان‌ها"
              value={stats.total}
            />
            <StatCard
              icon={<UserCheck size={18} />}
              label="ورود ثبت‌شده"
              value={stats.checked_in}
              accent
            />
            <StatCard
              icon={<Crown size={18} />}
              label="کل VIP"
              value={stats.vip_total}
            />
            <StatCard
              icon={<Crown size={18} />}
              label="ورود VIP"
              value={stats.vip_checked_in}
              accent
            />
          </div>
        )}

        {/* ==================================================
            SEARCH — بزرگ‌ترین ایتم صفحه
        ================================================== */}
        <div className="relative flex h-16 items-center rounded-2xl border border-white/15 bg-white/[0.04] px-4 focus-within:border-blue-400/60">
          <Search size={24} className="shrink-0 text-white/60" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="نام، شماره تلفن یا کد دعوت را وارد کنید..."
            className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-base text-white outline-none placeholder:text-white/35"
          />
          {loading && <Loader2 size={20} className="shrink-0 animate-spin text-white/40" />}
        </div>

        {loadError && (
          <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {loadError}
          </p>
        )}

        {/* ==================================================
            LIST
        ================================================== */}
        <div className="flex flex-col gap-2">
          {!loading && results.length === 0 && !loadError && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] py-16 text-white/40">
              <Search size={28} />
              <p className="text-sm">مهمانی پیدا نشد</p>
            </div>
          )}

          {results.map((p) => (
            <GuestRow
              key={p.id}
              participant={p}
              checkingIn={checkingInIds.has(p.id)}
              onCheckIn={() => requestCheckIn(p)}
            />
          ))}
        </div>
      </main>

      {/* ==================================================
          CONFIRM DIALOG — چون ثبت ورود یک‌طرفه و غیرقابل بازگشته
      ================================================== */}
      {pendingParticipant && (
        <ConfirmCheckInDialog
          participant={pendingParticipant}
          onCancel={cancelCheckIn}
          onConfirm={confirmCheckIn}
        />
      )}
    </div>
  );
};

/* ============================================================
   STAT CARD
============================================================ */

const StatCard = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}) => (
  <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
    <div className={`flex items-center gap-1.5 text-xs ${accent ? "text-emerald-400" : "text-white/50"}`}>
      {icon}
      <span>{label}</span>
    </div>
    <strong className="text-2xl font-bold">{value}</strong>
  </div>
);

/* ============================================================
   GUEST ROW
============================================================ */

const GuestRow = ({
  participant,
  checkingIn,
  onCheckIn,
}: {
  participant: AdminParticipant;
  checkingIn: boolean;
  onCheckIn: () => void;
}) => {
  const { name, is_vip, checked_in } = participant;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition hover:border-white/20">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="truncate text-base font-medium text-white">{name}</span>

        {is_vip && (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-purple-400/40 bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-300">
            <Crown size={12} />
            VIP
          </span>
        )}
      </div>

      <button
        onClick={onCheckIn}
        disabled={checked_in || checkingIn}
        className={`
          flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition
          ${
            checked_in
              ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-400"
              : "border-white/15 bg-white/5 text-white/50 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-400"
          }
          disabled:cursor-default
        `}
        aria-label={checked_in ? "ورود ثبت شده" : "ثبت ورود"}
        title={checked_in ? "ورود ثبت شده" : "ثبت ورود"}
      >
        {checkingIn ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Check size={20} strokeWidth={checked_in ? 3 : 2} />
        )}
      </button>
    </div>
  );
};

/* ============================================================
   CONFIRM CHECK-IN DIALOG
   ساده و بدون انیمیشن اضافه، هم‌راستا با خواسته‌ی «داشبورد ساده،
   بدون شلوغ‌کاری». فقط یک لایه‌ی محافظتی قبل از یک عمل برگشت‌ناپذیر.
============================================================ */

const ConfirmCheckInDialog = ({
  participant,
  onCancel,
  onConfirm,
}: {
  participant: AdminParticipant;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0a0f24] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">تأیید ثبت ورود</h2>
            <p className="mt-1 text-sm leading-6 text-white/60">
              ورود{" "}
              <span className="font-semibold text-white">{participant.name}</span>{" "}
              ثبت بشه؟ این عمل قابل بازگشت نیست.
            </p>
          </div>
          <button
            onClick={onCancel}
            aria-label="بستن"
            className="shrink-0 rounded-lg p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {participant.is_vip && (
          <div className="mb-4 flex items-center gap-1.5 rounded-xl border border-purple-400/30 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300">
            <Crown size={13} />
            این مهمان VIP است
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="h-11 flex-1 rounded-xl border border-white/15 bg-white/5 text-sm font-medium text-white/75 transition hover:bg-white/10"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            className="h-11 flex-1 rounded-xl bg-emerald-500 text-sm font-bold text-white transition hover:bg-emerald-400"
          >
            تأیید ورود
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;