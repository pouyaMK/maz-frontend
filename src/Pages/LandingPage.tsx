
import { useEffect, useRef, useState, type JSX } from "react";
import { useParams } from "react-router-dom";
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
// هرچه بیشتر باشد، المان‌ها روی گوشی بزرگ‌تر دیده می‌شوند.
const MOBILE_SCALE = 1.18;

const decorativeAssets = [
  {
    alt: "Vector",
    className: "absolute left-0 top-0 h-[113.93%] w-[100.63%]",
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

// ویدیوی کاور
const COVER_VIDEO_SRC = "/videos/section2.mp4";

// برای اینکه روی موبایل Canvas بیشتر از عرض صفحه را بگیرد
const getResponsiveScale = () => {
  if (typeof window === "undefined") {
    return 1;
  }

  const width = window.innerWidth;

  // دسکتاپ: طراحی اصلی
  if (width >= 768) {
    return 1;
  }

  // موبایل
  // Canvas نسبت به عرض گوشی بزرگ‌تر می‌شود.
  const baseScale = width / DESIGN_WIDTH;

  return baseScale * MOBILE_SCALE;
};

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

  // -----------------------------
  // Responsive Scale
  // -----------------------------
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

  // -----------------------------
  // گرفتن اطلاعات دعوت‌نامه
  // -----------------------------
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

  // -----------------------------
  // RSVP
  // -----------------------------
  const handleAttendance = async (
    choice: "accept" | "decline",
  ) => {
    if (!slug || rsvpSubmitting) return;

    setRsvpError(null);
    setRsvpSubmitting(true);

    const previous = attendance;

    setAttendance(choice);

    try {
      const updated = await submitRsvp(slug, {
        attending: choice === "accept",
      });

      setInvite(updated);
    } catch {
      setAttendance(previous);
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
      {/* 
        Canvas اصلی.
        تمام المان‌ها داخل این container هستند،
        بنابراین با scale همگی با یک نسبت بزرگ/کوچک می‌شوند.
      */}
      <div
        className="relative shrink-0 origin-top overflow-hidden"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {/* -----------------------------
            Decorative Assets
        ----------------------------- */}

        {decorativeAssets.map((asset) => (
          <img
            key={asset.src}
            className={asset.className}
            alt={asset.alt}
            src={asset.src}
          />
        ))}

        {/* -----------------------------
            Top Illustrations
        ----------------------------- */}

        {illustrationAssets.slice(0, 3).map((asset) => (
          <img
            key={asset.src}
            className={asset.className}
            alt={asset.alt}
            src={asset.src}
          />
        ))}

        {/* -----------------------------
            Invitation Text
        ----------------------------- */}

        <section
          className="absolute left-[calc(50%_-_260px)] top-[1520px] w-[520px] text-center"
          style={{ direction: "rtl" }}
          aria-labelledby="invitation-title"
        >
          <h1
            id="invitation-title"
            className="absolute -top-[59px] left-1/2 w-full -translate-x-1/2 whitespace-nowrap text-[26.4px] font-semibold leading-[normal] text-white"
          >
            {loading
              ? "در حال بارگذاری…"
              : `${displayName} عزیز 🌱`}
          </h1>

          <p className="text-xl font-normal leading-[30px] text-white">
            خیلی خوشحال می‌شیم شما رو در جشن اورست ماز ببینیم؛
            جشنی که به مناسبت رسیدن ماز به قله آموزش کشور برگزار
            میشه. در مسیر این موفقیت، تک‌تک همراهان ماز، از جمله
            شما، سهیم بودید و دوست داریم این اتفاق بزرگ رو کنار
            هم جشن بگیریم.
          </p>
        </section>

        {/* -----------------------------
            Video
        ----------------------------- */}

        <div
          className="absolute left-[calc(50%_-_132px)] top-[1870px] h-[369px] w-[264px] overflow-hidden rounded-[26px] bg-black"
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
        </div>

        {/* Video Name */}

        {!loading && (
          <p
            className="absolute left-[calc(50%_-_132px)] top-[2249px] w-[264px] text-center text-base font-medium text-white"
            style={{ direction: "rtl" }}
          >
            {displayName}
          </p>
        )}

        {/* -----------------------------
            Attendance Instructions
        ----------------------------- */}

        <section
          className="absolute left-[calc(50%_-_267px)] top-[2272px] w-[533px] text-center"
          style={{ direction: "rtl" }}
          aria-label="راهنمای حضور"
        >
          <p className="text-xl font-normal leading-[normal] text-white">
            برای اینکه برنامه بدون حاشیه و با خیال راحت برگزار بشه
            و به هممون خوش بگذره، لطفاً با خودتون هیچ کس رو همراه
            نیارید و پوشش متناسب رو رعایت کنید. ممنون که با
            همکاری‌تون به ما کمک می‌کنید تا میزبان خوبی براتون
            باشیم.
          </p>
        </section>

        {/* -----------------------------
            Date & Location
        ----------------------------- */}

        <section
          className="absolute left-[calc(50%_-_198px)] top-[2439px] w-[398px] text-center"
          style={{ direction: "rtl" }}
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
        </section>

        {/* -----------------------------
            Map
        ----------------------------- */}

        <button
          type="button"
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
          <img
            src="https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/image-1.png"
            alt="نقشه مسیر"
            className="h-full w-full object-cover"
          />
        </button>

        {/* -----------------------------
            Navigation Button
        ----------------------------- */}

        <Button
          type="button"
          variant="secondary"
          className="absolute left-[calc(50%_-_158px)] top-[2950px] h-[27px] w-[90px] rounded-[10.25px] bg-[#d9d9d9] p-0 text-[15.9px] font-normal text-black hover:bg-[#d9d9d9]/90"
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

        {/* -----------------------------
            RSVP Question
        ----------------------------- */}

        <section
          className="absolute left-[calc(50%_-_158px)] top-[3004px] w-[306px] text-center"
          style={{ direction: "rtl" }}
          aria-labelledby="attendance-question"
        >
          <h2
            id="attendance-question"
            className="text-xl font-normal leading-[normal] text-white"
          >
            راستی، اگر بهمون بگی می‌تونی بیای یا نه ممنون میشیم.
          </h2>
        </section>

        {/* -----------------------------
            RSVP Buttons
        ----------------------------- */}

        <div
          className="absolute left-[calc(50%_-_166px)] top-[3079px] flex w-[335px] justify-between"
          dir="rtl"
          role="group"
          aria-label="پاسخ حضور در مراسم"
        >
          {attendanceOptions.map((option) => (
            <Button
              key={option.id}
              type="button"
              variant="ghost"
              disabled={rsvpSubmitting || loading}
              aria-pressed={attendance === option.id}
              onClick={() => handleAttendance(option.id)}
              className={option.className}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* -----------------------------
            RSVP Error
        ----------------------------- */}

        {rsvpError && (
          <p
            className="absolute left-[calc(50%_-_150px)] top-[3140px] w-[300px] text-center text-sm text-red-300"
            style={{ direction: "rtl" }}
          >
            {rsvpError}
          </p>
        )}

        {/* -----------------------------
            Accepted Message
        ----------------------------- */}

        {attendance === "accept" && (
          <>
            <p
              className="absolute left-[calc(50%_-_125px)] top-[3166px] w-[249px] text-center text-xl font-medium leading-[normal] text-white"
              style={{ direction: "rtl" }}
            >
              عالی؛ پس همدیگه رو می‌بینیم
            </p>

            <img
              className="absolute left-[calc(50%_-_14px)] top-[3211px] h-7 w-7"
              alt="Line md confirm"
              src="https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/line-md-confirm-circle-filled.svg"
            />
          </>
        )}

        {/* -----------------------------
            Loading / API Error
        ----------------------------- */}

        {loadError && (
          <p
            className="absolute left-[calc(50%_-_200px)] top-[400px] w-[400px] text-center text-lg text-red-300"
            style={{ direction: "rtl" }}
          >
            {loadError}
          </p>
        )}

        {/* -----------------------------
            Bottom Illustrations
        ----------------------------- */}

        {illustrationAssets.slice(3).map((asset) => (
          <img
            key={asset.src}
            className={asset.className}
            alt={asset.alt}
            src={asset.src}
          />
        ))}
      </div>
    </main>
  );
};

export default LandingPage;
