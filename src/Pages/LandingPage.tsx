import { useEffect, useRef, useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Button } from "../components/button";
import { useCanvasScale } from "../hooks/useCanvasScale";
import { getInvite, submitRsvp, buildVideoUrl, type InvitePublic } from "../lib/api";
import { MazeGroupIllustration } from "../components/illustrations/MazeGroupIllustration";
import MazeLeafIllustration from "../components/illustrations/MazeLeafIllustration";
import MazeCornerVector from "../components/illustrations/MazeCornerVector";
import MazeBadgeIllustration from "../components/illustrations/MazeBadgeIllustration";
import MazeFooterIllustration from "../components/illustrations/MazeFooterIllustration";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 3841;

const decorativeAssets = [
  {
    alt: "Vector",
    className: "absolute left-0 top-0 h-[113.93%] w-[100.63%]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/vector.svg",
  },
  {
    alt: "Vector",
    className: "absolute left-[38.84%] top-[54.54%] h-0 w-[7.97%]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/vector-1.svg",
  },
  {
    alt: "Vector",
    className: "absolute left-[49.54%] top-[74.15%] h-[3.26%] w-0",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/vector-3.svg",
  },
  {
    alt: "Vector",
    className: "absolute left-[64.31%] top-[71.06%] h-0 w-0",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/vector-2.svg",
  },
];


const illustrationAssetsTop = [
  {
    alt: "Group",
    className: "absolute left-[1499px] top-[76px] h-[99px] w-[179px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/group-1.png",
    float: true,
  },
  {
    alt: "Layer",
    className: "absolute left-[801px] top-[345px] h-[149px] w-[381px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/layer-1-2.svg",
    float: true,
  },
];

const illustrationAssetsBottom = [

  {
    alt: "Group",
    className: "absolute left-[562px] top-[2631px] h-[266px] w-[51px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/group-10.png",
    float: false,
  },
];

const attendanceOptions: { id: "accept" | "decline"; label: string; className: string }[] = [
  {
    id: "decline",
    label: "نه ، برنامه دیگه ای دارم",
    className:
      "h-[34px] w-[157px] rounded-[10.32px] bg-[#f7aeae] p-0 font-medium text-base text-[#555555] hover:bg-[#f7aeae]/90",
  },
  {
    id: "accept",
    label: "بله ،حتما میام",
    className:
      "h-[34px] w-[138px] rounded-[10.32px] bg-[#89cf84] p-0 font-semibold text-base text-[#555555] hover:bg-[#89cf84]/90",
  },
];

const COVER_IMAGE_SRC = "/img/section2-cover.png";
const DEFAULT_GUEST_VIDEO_SRC = "/videos/nameLastname.mp4";
const IRAN_MOBILE_REGEX = /^09\d{9}$/;

// ---------------------------------------------------------------------------
// Framer Motion variants
// ---------------------------------------------------------------------------

const decorativeContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const decorativeItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const illustrationContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const illustrationItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 32 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const floatTransition = (delay: number) => ({
  y: {
    duration: 4.5,
    repeat: Infinity,
    repeatType: "mirror" as const,
    ease: "easeInOut" as const,
    delay,
  },
});

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const buttonsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const buttonItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const LandingPage = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>();
  const scale = useCanvasScale(DESIGN_WIDTH);

  const [invite, setInvite] = useState<InvitePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [attendance, setAttendance] = useState<"accept" | "decline" | null>(null);
  const [savedPhone, setSavedPhone] = useState<string | null>(null);

  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [videoReady, setVideoReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [guestVideoFailed, setGuestVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!slug) {
      setLoadError("لینک دعوت‌نامه نامعتبر است.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setVideoReady(false);
    setVideoPlaying(false);
    setGuestVideoFailed(false);

    getInvite(slug)
      .then((data) => {
        if (cancelled) return;
        setInvite(data);
        if (data.attending === true) {
          setAttendance("accept");
          setSavedPhone(data.phone ?? null);
        } else if (data.attending === false) {
          setAttendance("decline");
          setSavedPhone(null);
        } else {
          setAttendance(null);
          setSavedPhone(null);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setInvite(null);
        setAttendance(null);
        setSavedPhone(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleAcceptClick = () => {
    if (rsvpSubmitting) return;
    if (attendance === "accept" && savedPhone) {
      return;
    }
    setPhoneError(null);
    setRsvpError(null);
    setPhone(savedPhone ?? "");
    setShowPhoneInput(true);
  };

  const handleEditPhoneClick = () => {
    if (rsvpSubmitting) return;
    setPhoneError(null);
    setRsvpError(null);
    setPhone(savedPhone ?? "");
    setShowPhoneInput(true);
  };

  const handleDeclineClick = async () => {
    if (!slug || rsvpSubmitting) return;
    if (attendance === "decline") return;

    setRsvpError(null);
    setPhoneError(null);
    setShowPhoneInput(false);
    setRsvpSubmitting(true);

    const previousAttendance = attendance;
    const previousPhone = savedPhone;

    setAttendance("decline");
    setSavedPhone(null);

    try {
      const updated = await submitRsvp(slug, { attending: false });
      setInvite(updated);
    } catch {
      setAttendance(previousAttendance);
      setSavedPhone(previousPhone);
      setRsvpError("ثبت پاسخ با مشکل مواجه شد، لطفاً دوباره تلاش کنید.");
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!slug || rsvpSubmitting) return;

    const trimmed = phone.trim();
    if (!IRAN_MOBILE_REGEX.test(trimmed)) {
      setPhoneError("لطفاً شماره موبایل معتبر وارد کنید (مثلاً 09123456789).");
      return;
    }

    setPhoneError(null);
    setRsvpError(null);
    setRsvpSubmitting(true);

    const previousAttendance = attendance;
    const previousPhone = savedPhone;

    try {
      const updated = await submitRsvp(slug, { attending: true, phone: trimmed });
      setInvite(updated);
      setAttendance("accept");
      setSavedPhone(trimmed);
      setShowPhoneInput(false);
    } catch {
      setAttendance(previousAttendance);
      setSavedPhone(previousPhone);
      setRsvpError("ثبت پاسخ با مشکل مواجه شد، لطفاً دوباره تلاش کنید.");
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const handleCancelPhoneInput = () => {
    setShowPhoneInput(false);
    setPhoneError(null);
    setPhone(savedPhone ?? "");
  };

  const displayName = invite?.name ?? "مهمان عزیز";
  const guestVideoUrl = buildVideoUrl(invite?.name_en);
  const activeVideoSrc =
    guestVideoUrl && !guestVideoFailed ? guestVideoUrl : DEFAULT_GUEST_VIDEO_SRC;

  if (!loading && loadError) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#02205f] px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md text-center text-lg text-white [direction:rtl]"
        >
          {loadError}
        </motion.p>
      </main>
    );
  }

  return (
    <main
      className="relative flex w-full justify-center overflow-hidden bg-[#02205f]"
      style={{ height: DESIGN_HEIGHT * scale }}
    >
      <div
        className="h-[3841px] w-[1920px] shrink-0 origin-top overflow-hidden"
        style={{ transform: `scale(${scale})` }}
        data-model-id="1:2"
      >
        {/* --- تزئینات پس‌زمینه: ورود staggered --- */}
        <motion.div initial="hidden" animate="visible" variants={decorativeContainerVariants}>
          {decorativeAssets.map((asset) => (
            <motion.img
              key={asset.src}
              variants={decorativeItemVariants}
              className={asset.className}
              alt={asset.alt}
              src={asset.src}
            />
          ))}
        </motion.div>

        {/* --- illustration های بالای صفحه --- */}
        <motion.div initial="hidden" animate="visible" variants={illustrationContainerVariants}>
          {illustrationAssetsTop.map((asset, i) => (
            <motion.img
              key={asset.src}
              variants={illustrationItemVariants}
              animate={
                asset.float
                  ? { y: [0, -14, 0], transition: floatTransition(i * 0.4) }
                  : undefined
              }
              className={asset.className}
              alt={asset.alt}
              src={asset.src}
            />
          ))}
        </motion.div>

        {/* --- illustration بزرگ وسط صفحه: قبلاً group-11.png بود، الان
             خودِ SVG اینلاین با انیمیشنِ "کشیده‌شدن" هر خط جداگانه --- */}
        <MazeGroupIllustration className="absolute left-[557px] top-[638px] h-[812px] w-[836px]" />
        <MazeLeafIllustration className="absolute left-[880px] top-[1512px] h-[629px] w-[613px]" />
        <MazeCornerVector className="absolute left-[30.44%] top-[57.18%] h-[9.62%] w-[11.03%]" />
        <MazeFooterIllustration className="absolute left-0 top-[3301px] h-[386px] w-[818px]" />

        <motion.div
          animate={{ y: [0, -14, 0], transition: floatTransition(0) }}
        >
          <MazeBadgeIllustration className="absolute left-[1194px] top-[2624px] h-[184px] w-[303px]" />
        </motion.div>
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUpVariants}
          className="absolute left-[calc(50%_-_260px)] top-[1520px] w-[520px] text-center [direction:rtl]"
          aria-labelledby="invitation-title"
        >
          <motion.h1
            id="invitation-title"
            variants={fadeUpVariants}
            className="absolute -top-[59px] left-1/2 w-full -translate-x-1/2 whitespace-nowrap text-[26.4px] font-semibold leading-[normal] text-white"
          >
            {loading ? "در حال بارگذاری…" : `${displayName} عزیز 🌱`}
          </motion.h1>
          <motion.p
            variants={fadeUpVariants}
            className="text-xl font-normal leading-[30px] text-white"
          >
            خیلی خوشحال می‌شیم شما رو در جشن اورست ماز ببینیم؛ جشنی که به
            مناسبت رسیدن ماز به قله آموزش کشور برگزار میشه. در مسیر این
            موفقیت، تک‌تک همراهان ماز، از جمله شما، سهیم بودید و دوست داریم
            این اتفاق بزرگ رو کنار هم جشن بگیریم.
          </motion.p>
        </motion.section>

        {/* --- ویدیو با انیمیشن scale-in وقتی وارد صفحه دید میشه --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={scaleInVariants}
          className="absolute left-[calc(50%_-_132px)] top-[1870px] h-[369px] w-[264px] overflow-hidden rounded-[26px] bg-black"
        >
          <video
            ref={videoRef}
            key={activeVideoSrc}
            className="h-full w-full object-cover"
            src={activeVideoSrc}
            poster={undefined}
            controls={videoPlaying}
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            onError={() => {
              setVideoReady(false);
              if (guestVideoUrl && !guestVideoFailed) {
                setGuestVideoFailed(true);
              }
            }}
            onPause={() => setVideoPlaying(false)}
            onEnded={() => setVideoPlaying(false)}
          />
          {!videoPlaying && (
            <motion.button
              type="button"
              whileHover={activeVideoSrc && videoReady ? { scale: 1.03 } : undefined}
              whileTap={activeVideoSrc && videoReady ? { scale: 0.97 } : undefined}
              onClick={() => {
                if (!activeVideoSrc || !videoReady) return;
                setVideoPlaying(true);
                videoRef.current?.play().catch(() => {
                  setVideoPlaying(false);
                });
              }}
              disabled={!activeVideoSrc || !videoReady}
              aria-label="پخش ویدیو"
              className="absolute inset-0 flex items-center justify-center disabled:cursor-default"
            >
              <img
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                src={COVER_IMAGE_SRC}
                alt=""
              />
              {activeVideoSrc && videoReady && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{
                    opacity: 1,
                    scale: [1, 1.08, 1],
                    transition: {
                      opacity: { duration: 0.4 },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    },
                  }}
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg"
                >
                  <span
                    className="ml-1 h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-[#02205f]"
                    aria-hidden="true"
                  />
                </motion.span>
              )}
            </motion.button>
          )}
        </motion.div>

        {!loading && (
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={fadeInVariants}
            className="absolute left-[calc(50%_-_132px)] top-[2249px] w-[264px] text-center text-base font-medium text-white [direction:rtl]"
          >
            {displayName}
          </motion.p>
        )}

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUpVariants}
          className="absolute left-[calc(50%_-_267px)] top-[2272px] w-[533px] text-center [direction:rtl]"
          aria-label="راهنمای حضور"
        >
          <p className="text-xl font-normal leading-[normal] text-white">
            برای اینکه برنامه بدون حاشیه و با خیال راحت برگزار بشه و به هممون
            خوش بگذره، لطفاً با خودتون هیچ کس رو همراه نیارید و پوشش متناسب
            رو رعایت کنید. ممنون که با همکاری‌تون به ما کمک می‌کنید تا میزبان
            خوبی براتون باشیم.
          </p>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUpVariants}
          className="absolute left-[calc(50%_-_198px)] w-[398px] text-center [direction:rtl]"
          style={{ top: 2439 }}
          aria-label="زمان و مکان مراسم"
        >
          <p className="text-[23.3px] font-normal leading-[normal] text-white">
            زمان: <span className="font-medium">۲۰ شهریور، ساعت ۱۷</span>
          </p>
          <p className="text-[20.4px] font-normal leading-[normal] text-white">
            مکان: نمایشگاه بین‌المللی تهران، در جنوبی نمایشگاه، سالن شماره ۵
          </p>
          <p className="mt-3 text-[17px] font-normal leading-[26px] text-white/85">
            برای راحتی بیشتر شما عزیزان، خودروهای برقی نمایشگاه از ورودی
            جنوبی تا محل برگزاری جشن و بالعکس در خدمت شما هستند. برای پارک
            خودرو شخصی‌تون هم می‌توانید از پارکینگ جنوبی نمایشگاه استفاده
            کنید.
          </p>
        </motion.section>

        <motion.button
          type="button"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={scaleInVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            window.open("https://maps.app.goo.gl/7KhUzJXBzJSDo5Tm7", "_blank", "noopener")
          }
          className="absolute left-[calc(50%_-_190px)] top-[2668px] h-[254px] w-[400px] overflow-hidden rounded-[16px] border-0 p-0"
          aria-label="نمایش نقشه مسیر روی گوگل مپ"
        >
          <img
            src="https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/image-1.png"
            alt="نقشه مسیر"
            className="h-full w-full object-cover"
          />
        </motion.button>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeInVariants}
          className="absolute left-[calc(50%_-_158px)] top-[2950px]"
        >
          <Button
            type="button"
            variant="secondary"
            className="h-[27px] w-[90px] rounded-[10.25px] bg-[#d9d9d9] p-0 text-[15.9px] font-normal text-black hover:bg-[#d9d9d9]/90"
            dir="rtl"
            onClick={() =>
              window.open("https://maps.app.goo.gl/7KhUzJXBzJSDo5Tm7", "_blank", "noopener")
            }
          >
            مسیریابی
          </Button>
        </motion.div>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUpVariants}
          className="absolute left-[calc(50%_-_158px)] top-[3004px] w-[306px] text-center [direction:rtl]"
          aria-labelledby="attendance-question"
        >
          <h2 id="attendance-question" className="text-xl font-normal leading-[normal] text-white">
            راستی، اگر بهمون بگی می‌تونی بیای یا نه ممنون میشیم.
          </h2>
        </motion.section>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={buttonsContainerVariants}
          className="absolute left-[calc(50%_-_166px)] top-[3079px] flex w-[335px] justify-between"
          dir="rtl"
          role="group"
          aria-label="پاسخ حضور در مراسم"
        >
          <motion.div variants={buttonItemVariants} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              type="button"
              variant="ghost"
              disabled={rsvpSubmitting || loading}
              aria-pressed={attendance === "decline"}
              onClick={handleDeclineClick}
              className={attendanceOptions[0].className}
            >
              {attendanceOptions[0].label}
            </Button>
          </motion.div>
          <motion.div variants={buttonItemVariants} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              type="button"
              variant="ghost"
              disabled={rsvpSubmitting || loading}
              aria-pressed={attendance === "accept"}
              onClick={handleAcceptClick}
              className={attendanceOptions[1].className}
            >
              {attendanceOptions[1].label}
            </Button>
          </motion.div>
        </motion.div>

        {showPhoneInput && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-[calc(50%_-_150px)] top-[3160px] w-[300px] text-center [direction:rtl]"
          >
            <input
              type="tel"
              inputMode="numeric"
              placeholder="شماره موبایل شما"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (phoneError) setPhoneError(null);
              }}
              disabled={rsvpSubmitting}
              className="w-full rounded-[10px] border border-white/30 bg-white/10 px-3 py-2 text-center text-white placeholder-white/60 outline-none"
              dir="ltr"
              autoFocus
            />
            {phoneError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-300"
              >
                {phoneError}
              </motion.p>
            )}
            <div className="mt-2 flex gap-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  className="h-[34px] w-full rounded-[10.32px] bg-[#89cf84] p-0 font-semibold text-base text-[#555555] hover:bg-[#89cf84]/90"
                  disabled={rsvpSubmitting}
                  onClick={handlePhoneSubmit}
                >
                  {rsvpSubmitting ? "در حال ثبت…" : "ثبت و تایید"}
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-[34px] w-full rounded-[10.32px] bg-white/10 p-0 font-medium text-base text-white"
                  disabled={rsvpSubmitting}
                  onClick={handleCancelPhoneInput}
                >
                  انصراف
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {rsvpError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-[calc(50%_-_150px)] top-[3140px] w-[300px] text-center text-sm text-red-300 [direction:rtl]"
          >
            {rsvpError}
          </motion.p>
        )}

        {attendance === "accept" && savedPhone && !showPhoneInput && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="absolute left-[calc(50%_-_125px)] top-[3166px] w-[249px] text-center text-xl font-medium leading-[normal] text-white [direction:rtl]">
              عالی؛ پس همدیگه رو می‌بینیم
            </p>
            <motion.img
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute left-[calc(50%_-_14px)] top-[3211px] h-7 w-7"
              alt="Line md confirm"
              src="https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/line-md-confirm-circle-filled.svg"
            />
            <button
              type="button"
              onClick={handleEditPhoneClick}
              className="absolute left-[calc(50%_-_60px)] top-[3255px] ml-6 text-sm text-white/70 underline"
            >
              ویرایش شماره
            </button>
          </motion.div>
        )}

        {/* --- illustration های پایین صفحه --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={illustrationContainerVariants}
        >
          {illustrationAssetsBottom.map((asset, i) => (
            <motion.img
              key={asset.src}
              variants={illustrationItemVariants}
              animate={
                asset.float
                  ? { y: [0, -14, 0], transition: floatTransition(i * 0.4) }
                  : undefined
              }
              className={asset.className}
              alt={asset.alt}
              src={asset.src}
            />
          ))}
        </motion.div>
      </div>
    </main>
  );
};

export default LandingPage;