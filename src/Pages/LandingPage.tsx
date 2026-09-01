import { useEffect, useRef, useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/button";
import { useCanvasScale } from "../hooks/useCanvasScale";
import { getInvite, submitRsvp, buildVideoUrl, type InvitePublic } from "../lib/api";

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
    className: "absolute left-[30.44%] top-[57.18%] h-[9.62%] w-[11.03%]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/vector-2-1.svg",
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

const illustrationAssets = [
  {
    alt: "Layer",
    className: "absolute left-[1194px] top-[2624px] h-[184px] w-[303px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/layer-1-1.svg",
  },
  {
    alt: "Group",
    className: "absolute left-[557px] top-[638px] h-[812px] w-[836px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/group-11.png",
  },
  {
    alt: "Group",
    className: "absolute left-[1499px] top-[76px] h-[99px] w-[179px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/group-1.png",
  },
  {
    alt: "Layer",
    className: "absolute left-[801px] top-[345px] h-[149px] w-[381px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/layer-1-2.svg",
  },
  {
    alt: "Layer",
    className: "absolute left-0 top-[3301px] h-[386px] w-[818px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/layer-1.svg",
  },
  {
    alt: "Layer",
    className: "absolute left-[880px] top-[1512px] h-[629px] w-[613px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/layer-1-3.svg",
  },
  {
    alt: "Group",
    className: "absolute left-[562px] top-[2631px] h-[266px] w-[51px]",
    src: "https://c.animaapp.com/yMsQIt4gcRaRivWzIussoA/img/group-10.png",
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

// کاور ثابتی که رو همه ویدیوها تا قبل از پخش/در حالت لودینگ نشون داده میشه
// این فایل باید توی public/img/section2-cover.png خود فرانت باشه (استاتیک، نه از بک‌اند).
const COVER_IMAGE_SRC = "/img/section2-cover.png";

// راه‌حل موقت: بک‌اند فعلاً هیچ فیلدی نداره که بگه یک مهمون ویدیوی اختصاصی
// داره یا نه (نه has_video، نه video_url قابل‌اعتماد). پس وقتی ویدیوی
// اختصاصیِ ساخته‌شده از name_en با خطا مواجه بشه (404 و غیره)، به این ویدیوی
// پیش‌فرض عمومی فال‌بک می‌کنیم. باید از بک‌اند خواسته بشه فیلدی مثل
// has_video اضافه کنه تا این حدس‌زدن/تلاش‌وخطا لازم نباشه.
const DEFAULT_GUEST_VIDEO_SRC = "/videos/nameLastname.mp4";

// طبق بک‌اند: وقتی attending=true باشه، phone الزامیه.
// فرمت شماره موبایل ایران: 09xxxxxxxxx
const IRAN_MOBILE_REGEX = /^09\d{9}$/;

export const LandingPage = (): JSX.Element => {
  const { slug } = useParams<{ slug: string }>();
  const scale = useCanvasScale(DESIGN_WIDTH);

  const [invite, setInvite] = useState<InvitePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // attendance و savedPhone = چیزی که واقعاً روی سرور ثبت شده (منبع حقیقت).
  // این دو، مستقل از "آیا فرم شماره تلفن الان بازه یا نه" هستن.
  const [attendance, setAttendance] = useState<"accept" | "decline" | null>(null);
  const [savedPhone, setSavedPhone] = useState<string | null>(null);

  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  // showPhoneInput فقط با اکشن صریح کاربر true می‌شه؛
  // هیچ‌جای دیگه‌ای از کد به صورت خودکار بازش نمی‌کنه.
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [videoReady, setVideoReady] = useState(false);
  // آیا کاربر روی دکمه Play زده؛ تا این true نشه، کاور روی ویدیو می‌مونه
  // حتی اگه ویدیو از نظر فنی آماده پخش باشه (videoReady=true).
  const [videoPlaying, setVideoPlaying] = useState(false);
  // آیا ویدیوی اختصاصیِ ساخته‌شده از name_en با خطا مواجه شد (404 و غیره)؛
  // در این حالت به ویدیوی پیش‌فرض بی‌صدا (section2.mp4) سوییچ می‌کنیم.
  const [guestVideoFailed, setGuestVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ---- گرفتن اطلاعات دعوت‌نامه بر اساس اسلاگ توی url ----
  useEffect(() => {
    if (!slug) {
      setLoadError("لینک دعوت‌نامه نامعتبر است.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    // هر بار که اسلاگ عوض میشه، وضعیت ویدیوی قبلی رو ریست کن
    // وگرنه کاور دیگه هیچوقت دوباره نشون داده نمیشه
    setVideoReady(false);
    setVideoPlaying(false);
    setGuestVideoFailed(false);

    getInvite(slug)
      .then((data) => {
        if (cancelled) return;
        setInvite(data);
        // اگر قبلاً پاسخ داده بوده، وضعیتش رو منعکس کن
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
        // مهمون با این اسلاگ توی دیتابیس پیدا نشد. صفحه بازم کامل با نام
        // عمومی "مهمان عزیز" و ویدیوی پیش‌فرض نشون داده میشه؛ دکمه‌های RSVP
        // هم فعال می‌مونن — اگه کاربر کلیک کنه و سرور رد کنه، همون خطای
        // معمولی RSVP (rsvpError) پایین دکمه‌ها نشون داده میشه.
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

  // کلیک روی "بله ، حتما میام"
  const handleAcceptClick = () => {
    if (rsvpSubmitting) return;

    // اگر از قبل با موفقیت "بله" + شماره روی سرور ثبت شده، کلیک دوباره
    // نباید فرم رو باز کنه. تغییر شماره فقط با دکمه "ویرایش شماره" ممکنه.
    if (attendance === "accept" && savedPhone) {
      return;
    }

    setPhoneError(null);
    setRsvpError(null);
    setPhone(savedPhone ?? "");
    setShowPhoneInput(true);
  };

  // دکمه جدا برای ویرایش شماره‌ی از قبل ثبت‌شده
  const handleEditPhoneClick = () => {
    if (rsvpSubmitting) return;
    setPhoneError(null);
    setRsvpError(null);
    setPhone(savedPhone ?? "");
    setShowPhoneInput(true);
  };

  // کلیک روی "نه ، برنامه دیگه ای دارم"
  const handleDeclineClick = async () => {
    if (!slug || rsvpSubmitting) return;

    // اگر از قبل decline ثبت شده، دوباره درخواست نفرست
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

  // تایید شماره تلفن داخل فرم و ارسال نهایی "بله میام"
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
      // فقط بعد از موفقیت واقعی سرور فرم بسته میشه
      setShowPhoneInput(false);
    } catch {
      setAttendance(previousAttendance);
      setSavedPhone(previousPhone);
      setRsvpError("ثبت پاسخ با مشکل مواجه شد، لطفاً دوباره تلاش کنید.");
      // فرم رو باز نگه می‌داریم تا کاربر بدون تایپ دوباره، فقط دکمه رو بزنه
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

  // فیلد video_url که از API میاد قابل اعتماد نیست؛ آدرس واقعی ویدیو بر اساس
  // name_en مهمون ساخته میشه: http://mazeverest.ir/videos/{name_en}.mp4
  const guestVideoUrl = buildVideoUrl(invite?.name_en);
  // اگه ویدیوی اختصاصی نداریم (name_en خالیه) یا لود/پخشش با خطا مواجه شد،
  // به ویدیوی پیش‌فرض بی‌صدا فال‌بک می‌کنیم؛ در غیر این صورت همون ویدیوی اختصاصیه.
  const activeVideoSrc =
    guestVideoUrl && !guestVideoFailed ? guestVideoUrl : DEFAULT_GUEST_VIDEO_SRC;

  // اگه اسلاگ نامعتبره یا مهمون توی بک‌اند پیدا نشد (404)، کل صفحه‌ی اصلی
  // (که پر از "مهمان عزیز" و بقیه محتواست) اصلاً رندر نمیشه — فقط همین پیام خطا
  // به تنهایی نشون داده میشه، تا با محتوای واقعی صفحه قاطی نشه.
  if (!loading && loadError) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#02205f] px-6">
        <p className="max-w-md text-center text-lg text-white [direction:rtl]">{loadError}</p>
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
        {decorativeAssets.map((asset) => (
          <img key={asset.src} className={asset.className} alt={asset.alt} src={asset.src} />
        ))}

        {illustrationAssets.slice(0, 3).map((asset) => (
          <img key={asset.src} className={asset.className} alt={asset.alt} src={asset.src} />
        ))}

        <section
          className="absolute left-[calc(50%_-_260px)] top-[1520px] w-[520px] text-center [direction:rtl]"
          aria-labelledby="invitation-title"
        >
          <h1
            id="invitation-title"
            className="absolute -top-[59px] left-1/2 w-full -translate-x-1/2 whitespace-nowrap text-[26.4px] font-semibold leading-[normal] text-white"
          >
            {loading ? "در حال بارگذاری…" : `${displayName} عزیز 🌱`}
          </h1>
          <p className="text-xl font-normal leading-[30px] text-white">
            خیلی خوشحال می‌شیم شما رو در جشن اورست ماز ببینیم؛ جشنی که به
            مناسبت رسیدن ماز به قله آموزش کشور برگزار میشه. در مسیر این
            موفقیت، تک‌تک همراهان ماز، از جمله شما، سهیم بودید و دوست داریم
            این اتفاق بزرگ رو کنار هم جشن بگیریم.
          </p>
        </section>

        {/* ---- ویدیوی داینامیک روی کاور عکس section2-cover.png با دکمه Play؛ فال‌بک به ویدیوی پیش‌فرض اگه ویدیوی اختصاصی نبود/fail شد ---- */}
        <div className="absolute left-[calc(50%_-_132px)] top-[1870px] h-[369px] w-[264px] overflow-hidden rounded-[26px] bg-black">
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
              // فقط وقتی هنوز روی ویدیوی اختصاصی هستیم سوییچ کن به پیش‌فرض،
              // وگرنه اگه ویدیوی پیش‌فرض هم خطا بده وارد حلقه بی‌نهایت میشیم.
              if (guestVideoUrl && !guestVideoFailed) {
                setGuestVideoFailed(true);
              }
            }}
            onPause={() => setVideoPlaying(false)}
            onEnded={() => setVideoPlaying(false)}
          />
          {!videoPlaying && (
            <button
              type="button"
              onClick={() => {
                if (!activeVideoSrc || !videoReady) return;
                setVideoPlaying(true);
                videoRef.current?.play().catch(() => {
                  // اگه پخش به هر دلیلی (مثلاً autoplay policy) ناموفق بود، به حالت کاور برگرد
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
                <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-105">
                  {/* آیکن پلی ساده با CSS (مثلث)، بدون نیاز به فایل svg اضافه */}
                  <span
                    className="ml-1 h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-[#02205f]"
                    aria-hidden="true"
                  />
                </span>
              )}
            </button>
          )}
        </div>
        {!loading && (
          <p className="absolute left-[calc(50%_-_132px)] top-[2249px] w-[264px] text-center text-base font-medium text-white [direction:rtl]">
            {displayName}
          </p>
        )}

        <section
          className="absolute left-[calc(50%_-_267px)] top-[2272px] w-[533px] text-center [direction:rtl]"
          aria-label="راهنمای حضور"
        >
          <p className="text-xl font-normal leading-[normal] text-white">
            برای اینکه برنامه بدون حاشیه و با خیال راحت برگزار بشه و به هممون
            خوش بگذره، لطفاً با خودتون هیچ کس رو همراه نیارید و پوشش متناسب
            رو رعایت کنید. ممنون که با همکاری‌تون به ما کمک می‌کنید تا میزبان
            خوبی براتون باشیم.
          </p>
        </section>

        <section
          className="absolute left-[calc(50%_-_198px)] top-[2439px] w-[398px] text-center [direction:rtl]"
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
        </section>

        <button
          type="button"
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
        </button>

        <Button
          type="button"
          variant="secondary"
          className="absolute left-[calc(50%_-_158px)] top-[2950px] h-[27px] w-[90px] rounded-[10.25px] bg-[#d9d9d9] p-0 text-[15.9px] font-normal text-black hover:bg-[#d9d9d9]/90"
          dir="rtl"
          onClick={() =>
            window.open("https://maps.app.goo.gl/7KhUzJXBzJSDo5Tm7", "_blank", "noopener")
          }
        >
          مسیریابی
        </Button>

        <section
          className="absolute left-[calc(50%_-_158px)] top-[3004px] w-[306px] text-center [direction:rtl]"
          aria-labelledby="attendance-question"
        >
          <h2 id="attendance-question" className="text-xl font-normal leading-[normal] text-white">
            راستی، اگر بهمون بگی می‌تونی بیای یا نه ممنون میشیم.
          </h2>
        </section>

        <div
          className="absolute left-[calc(50%_-_166px)] top-[3079px] flex w-[335px] justify-between"
          dir="rtl"
          role="group"
          aria-label="پاسخ حضور در مراسم"
        >
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
        </div>

        {/*
          فرم شماره تلفن: دقیقاً همون جایی که قبلاً پیام "عالی همدیگه رو
          می‌بینیم" نمایش داده می‌شد (top-3166) قرار می‌گیره، چون این دو هیچ‌وقت
          هم‌زمان نمایش داده نمی‌شن (یا فرم بازه، یا پیام تایید نشون داده میشه).
        */}
        {showPhoneInput && (
          <div className="absolute left-[calc(50%_-_150px)] top-[3160px] w-[300px] text-center [direction:rtl]">
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
              <p className="mt-1 text-sm text-red-300">{phoneError}</p>
            )}
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                className="h-[34px] flex-1 rounded-[10.32px] bg-[#89cf84] p-0 font-semibold text-base text-[#555555] hover:bg-[#89cf84]/90"
                disabled={rsvpSubmitting}
                onClick={handlePhoneSubmit}
              >
                {rsvpSubmitting ? "در حال ثبت…" : "ثبت و تایید"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-[34px] flex-1 rounded-[10.32px] bg-white/10 p-0 font-medium text-base text-white"
                disabled={rsvpSubmitting}
                onClick={handleCancelPhoneInput}
              >
                انصراف
              </Button>
            </div>
          </div>
        )}

        {rsvpError && (
          <p className="absolute left-[calc(50%_-_150px)] top-[3140px] w-[300px] text-center text-sm text-red-300 [direction:rtl]">
            {rsvpError}
          </p>
        )}

        {/*
          پیام تایید نهایی فقط وقتی نشون داده میشه که:
          - جواب ثبت‌شده روی سرور "accept" باشه
          - شماره تلفن واقعاً ذخیره شده باشه
          - فرم شماره الان بسته باشه (تا با فرم هم‌پوشانی نداشته باشه)
        */}
        {attendance === "accept" && savedPhone && !showPhoneInput && (
          <>
            <p className="absolute left-[calc(50%_-_125px)] top-[3166px] w-[249px] text-center text-xl font-medium leading-[normal] text-white [direction:rtl]">
              عالی؛ پس همدیگه رو می‌بینیم
            </p>
            <img
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
          </>
        )}

        {illustrationAssets.slice(3).map((asset) => (
          <img key={asset.src} className={asset.className} alt={asset.alt} src={asset.src} />
        ))}
      </div>
    </main>
  );
};

export default LandingPage;