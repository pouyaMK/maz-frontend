
import { useEffect, useRef, useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Button } from "../components/button";
import {
  getInvite,
  submitRsvp,
  buildVideoUrl,
  type InvitePublic,
} from "../lib/api";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 3841;

// ضریب بزرگ‌نمایی مخصوص موبایل
const MOBILE_SCALE = 1.18;

// --------------------------------------------------
// Animation Variants
// --------------------------------------------------

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 45,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeUpSlow: Variants = {
  hidden: {
    opacity: 0,
    y: 70,
    scale: 0.96,
    filter: "blur(14px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.78,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 35,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const buttonReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.75,
    y: 25,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// --------------------------------------------------
// Decorative Assets
// --------------------------------------------------

const decorativeAssets = [
  {
    alt: "Vector",
    className:
      "absolute left-0 top-0 h-[113.93%] w-[100.63%]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/vector.svg",
  },
  {
    alt: "Vector",
    className:
      "absolute left-[30.44%] top-[57.18%] h-[9.62%] w-[11.03%]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/vector-2-1.svg",
  },
  {
    alt: "Vector",
    className:
      "absolute left-[38.84%] top-[54.54%] h-0 w-[7.97%]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/vector-1.svg",
  },
  {
    alt: "Vector",
    className:
      "absolute left-[49.54%] top-[74.15%] h-[3.26%] w-0",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/vector-3.svg",
  },
  {
    alt: "Vector",
    className:
      "absolute left-[64.31%] top-[71.06%] h-0 w-0",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/vector-2.svg",
  },
];

// --------------------------------------------------
// Illustration Assets
// --------------------------------------------------

const illustrationAssets = [
  {
    alt: "Layer",
    className:
      "absolute left-[1194px] top-[2624px] h-[184px] w-[303px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/layer-1-1.svg",
  },
  {
    alt: "Group",
    className:
      "absolute left-[557px] top-[638px] h-[812px] w-[836px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/group-11.png",
  },
  {
    alt: "Group",
    className:
      "absolute left-[1499px] top-[76px] h-[99px] w-[179px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/group-1.png",
  },
  {
    alt: "Layer",
    className:
      "absolute left-[801px] top-[345px] h-[149px] w-[381px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/layer-1-2.svg",
  },
  {
    alt: "Layer",
    className:
      "absolute left-0 top-[3301px] h-[386px] w-[818px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/layer-1.svg",
  },
  {
    alt: "Layer",
    className:
      "absolute left-[880px] top-[1512px] h-[629px] w-[613px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/layer-1-3.svg",
  },
  {
    alt: "Group",
    className:
      "absolute left-[562px] top-[2631px] h-[266px] w-[51px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/group-10.png",
  },
];

// --------------------------------------------------
// Attendance
// --------------------------------------------------

const attendanceOptions: {
  id: "accept" | "decline";
  label: string;
  className: string;
}[] = [
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

// --------------------------------------------------
// Video
// --------------------------------------------------

const COVER_VIDEO_SRC = "/videos/section2.mp4";

// --------------------------------------------------
// Responsive Scale
// --------------------------------------------------

const getResponsiveScale = () => {
  if (typeof window === "undefined") {
    return 1;
  }

  const width = window.innerWidth;

  if (width >= 768) {
    return 1;
  }

  const baseScale = width / DESIGN_WIDTH;

  return baseScale * MOBILE_SCALE;
};

// --------------------------------------------------
// Landing Page
// --------------------------------------------------

export const LandingPage = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>();

  const [scale, setScale] = useState(getResponsiveScale);

  const [invite, setInvite] = useState<InvitePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [attendance, setAttendance] = useState<
    "accept" | "decline" | null
  >(null);

  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  const [videoReady, setVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // --------------------------------------------------
  // Responsive
  // --------------------------------------------------

  useEffect(() => {
    const updateScale = () => {
      setScale(getResponsiveScale());
    };

    updateScale();

    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  // --------------------------------------------------
  // Get Invite
  // --------------------------------------------------

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

    getInvite(slug)
      .then((data) => {
        if (cancelled) return;

        setInvite(data);

        if (data.attending === true) {
          setAttendance("accept");
        } else if (data.attending === false) {
          setAttendance("decline");
        }
      })
      .catch(() => {
        if (cancelled) return;

        setLoadError("دعوت‌نامه‌ای با این آدرس پیدا نشد.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // --------------------------------------------------
  // RSVP
  // --------------------------------------------------

  // const handleAttendance = async (
  //   choice: "accept" | "decline",
  // ) => {
  //   if (!slug || rsvpSubmitting) return;

  //   setRsvpError(null);
  //   setRsvpSubmitting(true);

  //   const previous = attendance;

  //   setAttendance(choice);

  //   try {
  //     const updated = await submitRsvp(slug, {
  //       attending: choice === "accept",
  //     });

  //     setInvite(updated);
  //   } catch {
  //     setAttendance(previous);
  //     setRsvpError(
  //       "ثبت پاسخ با مشکل مواجه شد، لطفاً دوباره تلاش کنید.",
  //     );
  //   } finally {
  //     setRsvpSubmitting(false);
  //   }
  // };

  
const handleAttendance = async (
  choice: "accept" | "decline",
) => {
  if (!slug || rsvpSubmitting) return;

  setRsvpError(null);
  setRsvpSubmitting(true);

  try {
    const updated = await submitRsvp(slug, {
      attending: choice === "accept",
    });

    // فقط بعد از موفقیت واقعی API وضعیت را تغییر بده
    setInvite(updated);
    setAttendance(choice);
  } catch {
    // در صورت خطا، وضعیت قبلی دست‌نخورده می‌ماند
    setRsvpError(
      "ثبت پاسخ با مشکل مواجه شد، لطفاً دوباره تلاش کنید.",
    );
  } finally {
    setRsvpSubmitting(false);
  }
};



  const displayName = invite?.name ?? "مهمان عزیز";

  const activeVideoSrc =
    buildVideoUrl(invite?.name_en) || COVER_VIDEO_SRC;

  return (
    <main
      className="relative flex w-full justify-center overflow-hidden bg-[#02205f]"
      style={{
        height: DESIGN_HEIGHT * scale,
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative shrink-0 origin-top overflow-hidden"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {/* ==================================================
            DECORATIVE SVGs
        ================================================== */}

        {decorativeAssets.map((asset, index) => (
          <motion.div
            key={asset.src}
            className={asset.className}
            initial={{
              opacity: 0,
              clipPath: "inset(100% 0 0 0)",
            }}
            animate={{
              opacity: 1,
              clipPath: "inset(0% 0 0 0)",
            }}
            transition={{
              duration: 1.8,
              delay: index * 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img
              className="h-full w-full"
              alt={asset.alt}
              src={asset.src}
            />
          </motion.div>
        ))}

        {/* ==================================================
            TOP ILLUSTRATIONS
        ================================================== */}

        {illustrationAssets.slice(0, 3).map(
          (asset, index) => (
            <motion.img
              key={asset.src}
              className={asset.className}
              alt={asset.alt}
              src={asset.src}
              variants={imageReveal}
              custom={index}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 0.8 + index * 0.2,
              }}
            />
          ),
        )}

        {/* ==================================================
            INVITATION
        ================================================== */}

        <motion.section
          className="absolute left-[calc(50%_-_260px)] top-[1520px] w-[520px] text-center"
          style={{ direction: "rtl" }}
          variants={fadeUpSlow}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 1.15,
          }}
          aria-labelledby="invitation-title"
        >
          <motion.h1
            id="invitation-title"
            className="absolute -top-[59px] left-1/2 w-full -translate-x-1/2 whitespace-nowrap text-[26.4px] font-semibold leading-[normal] text-white"
            variants={fadeUp}
          >
            {loading
              ? "در حال بارگذاری…"
              : `${displayName} عزیز 🌱`}
          </motion.h1>

          <motion.p
            className="text-xl font-normal leading-[30px] text-white"
            variants={fadeUp}
            transition={{
              delay: 0.2,
            }}
          >
            خیلی خوشحال می‌شیم شما رو در جشن اورست ماز ببینیم؛
            جشنی که به مناسبت رسیدن ماز به قله آموزش کشور برگزار
            میشه. در مسیر این موفقیت، تک‌تک همراهان ماز، از جمله
            شما، سهیم بودید و دوست داریم این اتفاق بزرگ رو کنار
            هم جشن بگیریم.
          </motion.p>
        </motion.section>

        {/* ==================================================
            VIDEO
        ================================================== */}

        <motion.div
          className="absolute left-[calc(50%_-_132px)] top-[1870px] h-[369px] w-[264px] overflow-hidden rounded-[26px] bg-black"
          variants={fadeScale}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 1.45,
          }}
        >
          <video
            ref={videoRef}
            key={activeVideoSrc}
            className="h-full w-full object-cover"
            src={activeVideoSrc}
            poster="/img/section2-cover.png"
            controls
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
          />

          {!videoReady && (
            <video
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              src={COVER_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </motion.div>

        {/* ==================================================
            VIDEO NAME
        ================================================== */}

        {!loading && (
          <motion.p
            className="absolute left-[calc(50%_-_132px)] top-[2249px] w-[264px] text-center text-base font-medium text-white"
            style={{ direction: "rtl" }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 1.75,
            }}
          >
            {displayName}
          </motion.p>
        )}

        {/* ==================================================
            ATTENDANCE TEXT
        ================================================== */}

        <motion.section
          className="absolute left-[calc(50%_-_267px)] top-[2272px] w-[533px] text-center"
          style={{ direction: "rtl" }}
          variants={fadeUpSlow}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 1.85,
          }}
          aria-label="راهنمای حضور"
        >
          <p className="text-xl font-normal leading-[normal] text-white">
            برای اینکه برنامه بدون حاشیه و با خیال راحت برگزار بشه
            و به هممون خوش بگذره، لطفاً با خودتون هیچ کس رو همراه
            نیارید و پوشش متناسب رو رعایت کنید. ممنون که با
            همکاری‌تون به ما کمک می‌کنید تا میزبان خوبی براتون
            باشیم.
          </p>
        </motion.section>

        {/* ==================================================
            DATE / LOCATION
        ================================================== */}

        <motion.section
          className="absolute left-[calc(50%_-_198px)] top-[2439px] w-[398px] text-center"
          style={{ direction: "rtl" }}
          variants={fadeUpSlow}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 2.05,
          }}
          aria-label="زمان و مکان مراسم"
        >
          <p className="text-[23.3px] font-normal leading-[normal] text-white">
            زمان:{" "}
            <span className="font-medium">
              ۲۰ شهریور، ساعت ۱۷
            </span>
          </p>

          <p className="text-[20.4px] font-normal leading-[normal] text-white">
            مکان: نمایشگاه بین‌المللی تهران، در جنوبی نمایشگاه،
            سالن شماره ۵
          </p>

          <p className="mt-3 text-[17px] font-normal leading-[26px] text-white/85">
            برای راحتی بیشتر شما عزیزان، خودروهای برقی نمایشگاه
            از ورودی جنوبی تا محل برگزاری جشن و بالعکس در خدمت
            شما هستند. برای پارک خودرو شخصی‌تون هم می‌توانید از
            پارکینگ جنوبی نمایشگاه استفاده کنید.
          </p>
        </motion.section>

        {/* ==================================================
            MAP
        ================================================== */}

        <motion.button
          type="button"
          variants={fadeScale}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 2.25,
          }}
          onClick={() =>
            window.open(
              "https://maps.app.goo.gl/7KhUzJXBzJSDo5Tm7",
              "_blank",
              "noopener",
            )
          }
          className="absolute left-[calc(50%_-_190px)] top-[2668px] h-[254px] w-[400px] overflow-hidden rounded-[16px] border-0 p-0"
          aria-label="نمایش نقشه مسیر روی گوگل مپ"
        >
          <motion.img
            src="https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/image-1.png"
            alt="نقشه مسیر"
            className="h-full w-full object-cover"
            whileHover={{
              scale: 1.04,
            }}
            transition={{
              duration: 0.35,
            }}
          />
        </motion.button>

        {/* ==================================================
            NAVIGATION BUTTON
        ================================================== */}

        <motion.div
          className="absolute left-[calc(50%_-_158px)] top-[2950px]"
          variants={buttonReveal}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 2.45,
          }}
        >
          <Button
            type="button"
            variant="secondary"
            className="h-[27px] w-[90px] rounded-[10.25px] bg-[#d9d9d9] p-0 text-[15.9px] font-normal text-black hover:bg-[#d9d9d9]/90"
            dir="rtl"
            onClick={() =>
              window.open(
                "https://maps.app.goo.gl/7KhUzJXBzJSDo5Tm7",
                "_blank",
                "noopener",
              )
            }
          >
            مسیریابی
          </Button>
        </motion.div>

        {/* ==================================================
            RSVP QUESTION
        ================================================== */}

        <motion.section
          className="absolute left-[calc(50%_-_158px)] top-[3004px] w-[306px] text-center"
          style={{ direction: "rtl" }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 2.6,
          }}
          aria-labelledby="attendance-question"
        >
          <h2
            id="attendance-question"
            className="text-xl font-normal leading-[normal] text-white"
          >
            راستی، اگر بهمون بگی می‌تونی بیای یا نه ممنون میشیم.
          </h2>
        </motion.section>

        {/* ==================================================
            RSVP BUTTONS
        ================================================== */}

        <motion.div
          className="absolute left-[calc(50%_-_166px)] top-[3079px] flex w-[335px] justify-between"
          dir="rtl"
          role="group"
          aria-label="پاسخ حضور در مراسم"
          variants={fadeUpSlow}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 2.8,
          }}
        >
          {attendanceOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{
                scale: 1.06,
                y: -3,
              }}
              whileTap={{
                scale: 0.94,
              }}
            >
              <Button
                type="button"
                variant="ghost"
                disabled={rsvpSubmitting || loading}
                aria-pressed={attendance === option.id}
                onClick={() =>
                  handleAttendance(option.id)
                }
                className={option.className}
              >
                {option.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* ==================================================
            RSVP ERROR
        ================================================== */}

        {rsvpError && (
          <motion.p
            className="absolute left-[calc(50%_-_150px)] top-[3140px] w-[300px] text-center text-sm text-red-300"
            style={{ direction: "rtl" }}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            {rsvpError}
          </motion.p>
        )}

        {/* ==================================================
            ACCEPT MESSAGE
        ================================================== */}

        {attendance === "accept" && (
          <>
            <motion.p
              className="absolute left-[calc(50%_-_125px)] top-[3166px] w-[249px] text-center text-xl font-medium leading-[normal] text-white"
              style={{ direction: "rtl" }}
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.65,
              }}
            >
              عالی؛ پس همدیگه رو می‌بینیم
            </motion.p>

            <motion.img
              className="absolute left-[calc(50%_-_14px)] top-[3211px] h-7 w-7"
              alt="Line md confirm"
              src="https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/line-md-confirm-circle-filled.svg"
              initial={{
                opacity: 0,
                scale: 0,
                rotate: -90,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
          </>
        )}

        {/* ==================================================
            LOAD ERROR
        ================================================== */}

        {loadError && (
          <motion.p
            className="absolute left-[calc(50%_-_200px)] top-[400px] w-[400px] text-center text-lg text-red-300"
            style={{ direction: "rtl" }}
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            {loadError}
          </motion.p>
        )}

        {/* ==================================================
            BOTTOM ILLUSTRATIONS
        ================================================== */}

        {illustrationAssets.slice(3).map(
          (asset, index) => (
            <motion.img
              key={asset.src}
              className={asset.className}
              alt={asset.alt}
              src={asset.src}
              variants={imageReveal}
              initial="hidden"
              animate="visible"
              transition={{
                delay: 2.1 + index * 0.22,
              }}
            />
          ),
        )}
      </motion.div>
    </main>
  );
};

export default LandingPage;
