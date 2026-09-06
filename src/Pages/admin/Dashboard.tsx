import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  LogOut,
  Printer,
  MoreHorizontal,
  UserRound,
  QrCode,
  Crown,
  CheckCircle2,
  Phone,
  CalendarDays,
  Edit3,
  Filter,
  SlidersHorizontal,
  Check,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type HighlightColor = "blue" | "purple" | "green";

interface HighlightProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: HighlightColor;
}

interface InfoProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color?: HighlightColor;
}

interface EditInputProps {
  label: string;
  value: string;
}

/* ============================================================
   DASHBOARD
============================================================ */

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("همه");
  const [editing, setEditing] = useState(false);
  const [entered, setEntered] = useState(false);

  const guest = {
    name: "سعید محمدی",
    number: "A12",
    status: "تأیید شده",
    type: "VIP",
    phone: "0912 345 6789",
    email: "saeed.mohammadi@email.com",
    registerDate: "1403/09/15",
    companions: "۲ نفر",
    updatedAt: "1403/11/20 - 14:30",
  };

  const filters = [
    "همه",
    "VIP",
    "تأیید شده",
  ];

  /* ============================================================
     SEARCH
  ============================================================ */

  const matchesSearch =
    !search ||
    Object.values(guest).some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    );

  /* ============================================================
     FILTER
  ============================================================ */

  const matchesFilter =
    selectedFilter === "همه" ||
    (selectedFilter === "VIP" && guest.type === "VIP") ||
    (selectedFilter === "تأیید شده" &&
      guest.status === "تأیید شده");

  const showGuest = matchesSearch && matchesFilter;

  /* ============================================================
     ENTER GUEST
  ============================================================ */

  const handleEnter = () => {
    setEntered(true);

    setTimeout(() => {
      setEntered(false);
    }, 2500);
  };

  return (
    <div
      dir="rtl"
      className="
        relative
        h-dvh
        w-full
        overflow-hidden
        bg-[#010817]
        text-white
        selection:bg-blue-500/30
      "
    >
      {/* ======================================================
          BACKGROUND IMAGE
      ====================================================== */}

        <div
          className="
            fixed inset-0 -z-50
            bg-[#010817]
            bg-cover
            bg-center
            bg-no-repeat
          "
          style={{
            backgroundImage: `
              linear-gradient(
                180deg,
                rgba(1,8,28,.18) 0%,
                rgba(1,8,28,.40) 35%,
                rgba(1,7,24,.88) 100%
              ),
              url('/img/bg-desktop.png')
            `,
          }}
        />

      {/* ======================================================
          BACKGROUND LIGHT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          fixed inset-0
          z-10
          bg-[radial-gradient(ellipse_at_50%_10%,rgba(0,100,255,.20),transparent_38%)]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          -top-48
          left-[30%]
          z-10
          h-105
          w-105
          rounded-full
          bg-blue-600/20
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          fixed
          -bottom-40
          -right-40
          z-10
          h-100
          w-100
          rounded-full
          bg-blue-700/15
          blur-[120px]
        "
      />

      {/* ======================================================
          MAIN APP WRAPPER
      ====================================================== */}

      <div
        className="
          relative
          z-20
          flex
          h-full
          min-h-0
          flex-col
        "
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <header
          className="
            relative
            z-50
            shrink-0
            border-b
            border-blue-500/15
            bg-[#03132f]/35
            backdrop-blur-[22px]
          "
        >
          <div
            className="
              mx-auto
              flex
              sm:h-20.5
    
              w-[calc(100%-52px)]
              max-w-370
              items-center
              justify-between

              max-[1100px]:h-[64px]
              max-[700px]:h-[58px]
              max-[700px]:w-[calc(100%-28px)]
            "
          >
            {/* ================================================
                ADMIN
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="
                flex
                items-center
                gap-3.5
              "
            >
              {/* Avatar */}

              <div
                className="
                  relative
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-blue-300/60
                  bg-linear-to-br
                  from-blue-900
                  to-[#061a3c]
                  shadow-[0_0_25px_rgba(0,132,255,.20)]

                  max-[700px]:h-[32px]
                  max-[700px]:w-[32px]
                "
              >
          <UserRound
            size={24}
            strokeWidth={1.8}
            className="
              text-blue-100
              drop-shadow-[0_0_10px_rgba(80,170,255,.45)]
            "
          />
                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    h-3
                    w-3
                    rounded-full
                    border-2
                    border-[#03142e]
                    bg-emerald-400
                    shadow-[0_0_8px_#00f5a0,0_0_18px_rgba(0,245,160,.7)]
                  "
                />
              </div>

              <div
                className="
                  flex
                  flex-col
            
                  items-start
                  gap-0.5

                  max-[500px]:hidden
                "
              >
                <span
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  ادمین
                </span>

                <button
                  className="
                    text-[12px]
                    text-blue-300/80
                    cursor-pointer
                    transition
                    hover:text-blue-300
                  "
                >
                  خروج از حساب
                </button>
              </div>

              <button
                className="
                  flex
                  h-11.25
                  w-11.25
                  items-center
                  justify-center
                  cursor-pointer
                  rounded-[13px]
                  border
                  border-blue-500/35
                  bg-blue-950/30
                  text-blue-200
                  backdrop-blur-xl
                  transition
                  hover:border-blue-400/70
                  hover:bg-blue-900/40
                  hover:shadow-[0_0_25px_rgba(0,130,255,.15)]

                  max-[700px]:h-[32px]
                  max-[700px]:w-[32px]
                "
              >
                <LogOut size={20} />
              </button>
            </motion.div>

            {/* ================================================
                LOGO / TITLE
            ================================================= */}

            <div
              className="
                flex
                items-center
                gap-8

                max-[700px]:gap-4
              "
            >
             <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: -8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                scale: 1.08,
                rotate: -3,
                filter:
                  "drop-shadow(0 0 10px rgba(30,150,255,.7)) drop-shadow(0 0 25px rgba(30,100,255,.35))",
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="
                relative
                flex
                cursor-pointer
                items-center
                justify-center
              "
            >
              <img
                src="/img/logo-landing.png"
                alt="Logo"
                className="
                  h-14.5
                  w-auto
                  object-contain
                  max-[700px]:h-[36px]
                "
              />

              {/* Glow زیر لوگو */}
              <motion.div
                className="
                  pointer-events-none
                  absolute
                  -bottom-2
                  left-1/2
                  h-3
                  w-14
                  -translate-x-1/2
                  rounded-full
                  bg-blue-500/50
                  blur-xl
                "
                whileHover={{
                  scale: 1.5,
                  opacity: 1,
                }}
              />
            </motion.div>

              {/* Menu */}

              <motion.button
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                onClick={() =>
                  setMenuOpen((v) => !v)
                }
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-[14px]
                  border
                  border-blue-500/40
                  bg-blue-950/30
                  text-blue-100
                  cursor-pointer
                  p-1
                  backdrop-blur-xl
                  transition
                  hover:border-blue-400/80
                  hover:bg-blue-900/40
                  hover:shadow-[0_0_30px_rgba(0,120,255,.15)]

                  max-[700px]:h-[32px]
                  max-[700px]:w-[32px]
                "
              >
                {menuOpen ? (
                  <X size={25} />
                ) : (
                  <Menu size={25} />
                )}
              </motion.button>
            </div>
          </div>

          {/* ==================================================
              MENU DROPDOWN
          ================================================== */}

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="
                  mx-auto
                  w-[calc(100%-52px)]
                  max-w-370
                  overflow-hidden

                  max-[700px]:w-[calc(100%-28px)]
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-1
                    pb-4
                  "
                >
                  {[
                    "مدیریت مهمان‌ها",
                    "تنظیمات",
                    "خروج",
                  ].map((item) => (
                    <button
                      key={item}
                      className="
                        rounded-xl
                        px-4
                        py-2.5
                        cursor-pointer
                        text-right
                        text-xs
                        sm:text-base
                        text-blue-100/80
                        transition
                        hover:bg-blue-500/10
                        hover:text-white
                      "
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* ====================================================
            MAIN
        ==================================================== */}

        <main
          className="
            relative
            z-30
            min-h-0
            flex-1
            overflow-hidden
          "
        >
          <div
            className="
              mx-auto
              flex
              h-full
              min-h-0
              w-[calc(100%-52px)]
              max-w-370
              flex-col
              items-center
              pt-7
              pb-6
              max-[1100px]:pt-[20px]
              max-[1100px]:pb-[18px]
              max-[700px]:w-[calc(100%-28px)]
              max-[700px]:pt-[14px]
              max-[700px]:pb-[14px]
            "
          >
            {/* =================================================
                SEARCH
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
              }}
              className="
                flex
                w-full
                max-w-[1057px]
                shrink-0
                flex-row-reverse
                gap-3

                max-[700px]:gap-2
              "
            >
              {/* FILTER */}

              <div
                className="
                  relative
                  shrink-0
                "
              >
                <button
                  onClick={() =>
                    setFilterOpen((v) => !v)
                  }
                  className="
                    flex
                    h-14.5
                    w-30
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-blue-400/40
                    bg-linear-to-br
                    from-blue-950/60
                    to-[#03193e]/70
                    text-sm
                    text-white
                    cursor-pointer
                    shadow-[0_0_30px_rgba(0,115,255,.07),inset_0_1px_0_rgba(255,255,255,.04)]
                    backdrop-blur-2xl
                    transition
                    hover:border-blue-400/75
                    hover:shadow-[0_0_30px_rgba(0,115,255,.13)]
                    max-[700px]:h-[54px]
                    max-[700px]:w-[54px]
                  "
                >
                  <Filter
                    size={21}
                    className="text-blue-200"
                  />

                  <span
                    className="
                      max-[700px]:hidden
                    "
                  >
                    فیلترها
                  </span>

                  <SlidersHorizontal
                    size={17}
                    className="
                      text-blue-300

                      max-[700px]:hidden
                    "
                  />
                </button>

                {/* FILTER MENU */}

                <AnimatePresence>
                  {filterOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -8,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 8,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -5,
                        scale: 0.96,
                      }}
                      className="
                      absolute
                      right-[-150px]
                      top-full
                      mt-2
                      z-100
                      w-50
                      sm:w-57.5
                      rounded-2xl
                      border
                      border-blue-400/30
                      bg-[#031a3d]/95
                      p-2
                      shadow-[0_25px_65px_rgba(0,0,0,.5),0_0_30px_rgba(0,91,255,.1)]
                      backdrop-blur-2xl
                      "
                    >
                      {filters.map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            setSelectedFilter(
                              filter
                            );
                            setFilterOpen(false);
                          }}
                          className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-xl
                            px-3
                            cursor-pointer
                            py-3
                            text-right
                            text-sm
                            transition

                            ${
                              selectedFilter ===
                              filter
                                ? "bg-blue-500/15 text-white"
                                : "text-blue-200/80 hover:bg-blue-500/10 hover:text-white"
                            }
                          `}
                        >
                          {filter}

                          {selectedFilter ===
                            filter && (
                            <Check
                              size={17}
                              className="text-emerald-400"
                            />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SEARCH BOX */}

              <div
                className="
                  relative
                  flex
                  h-14.5
                  min-w-0
                  flex-1
                  items-center
                  rounded-2xl
                  border
                  border-blue-400/55
                  bg-linear-to-br
                  from-blue-950/60
                  to-[#03183e]/75
                  px-4
                  shadow-[0_0_35px_rgba(0,120,255,.08),inset_0_1px_0_rgba(255,255,255,.04)]
                  backdrop-blur-2xl
                  transition
                  focus-within:border-blue-300/80
                  focus-within:shadow-[0_0_35px_rgba(0,120,255,.14)]

                  max-[700px]:h-[54px]
                  max-[700px]:px-3
                "
              >
                <Search
                  size={24}
                  className="
                    shrink-0
                    text-white
                    max-[700px]:size-[21px]
                  "
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="جستجو در مهمان‌ها..."
                  className="
                    h-full
                    min-w-0
                    flex-1
                    border-0
                    bg-transparent
                    px-3
                    text-xs
                    sm:text-base
                    text-white
                    outline-none
                    placeholder:text-blue-100/40
                  "
                />
              </div>
            </motion.div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div
              className="
                flex
                min-h-0
                w-full
                flex-1
                flex-col
                items-center
              "
            >
              <AnimatePresence mode="wait">
                {showGuest ? (
                  <motion.section
                    key="guest-card"
                    initial={{
                      opacity: 0,
                      y: 25,
                      scale: 0.985,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                    relative
                    mx-auto
                    mt-5.75
                    w-full
                    max-w-[1035px]               
                    max-h-[calc(100%-23px)]              
                    overflow-y-auto
                    overflow-x-hidden       
                    rounded-3xl
                    border
                    border-blue-400/45          
                    bg-linear-to-br
                    from-[#06275b]/75
                    to-[#021438]/85
                  
                    p-7
                
                    shadow-[0_35px_90px_rgba(0,0,0,.48),0_0_60px_rgba(0,95,255,.09),inset_0_1px_0_rgba(255,255,255,.055)]
                  
                    backdrop-blur-[27px]
                  
                    h-fit
                    shrink-0
                  
                    max-[900px]:max-h-[calc(100%-15px)]
                    max-[700px]:mt-[14px]
                    max-[700px]:max-h-[calc(100%-14px)]
                    max-[700px]:p-4
                  
                    scrollbar-thin
                    scrollbar-track-transparent
                    scrollbar-thumb-blue-500/40
                    hover:scrollbar-thumb-blue-400/60
                  "
                  >
                    {/* TOP LIGHT */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-[5%]
                        right-[5%]
                        top-0
                        h-px
                        bg-linear-to-r
                        from-transparent
                        via-blue-400/80
                        to-transparent
                        shadow-[0_0_15px_rgba(47,157,255,.6)]
                      "
                    />

                    {/* =========================================
                        CARD HEADER
                    ========================================= */}

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-4

                        max-[700px]:gap-2
                      "
                    >
                      {/* PROFILE */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-4

                          max-[700px]:gap-2.5
                        "
                      >
                        {/* AVATAR */}

                        <div
  className="
    relative
    flex
    h-21.5
    w-21.5
    shrink-0
    items-center
    justify-center
    rounded-full
    border
    border-cyan-400/55
    bg-[radial-gradient(circle_at_50%_35%,#315e91,#08264c_72%)]
    shadow-[0_0_0_3px_rgba(0,125,255,.08),0_0_12px_rgba(0,136,255,.16)]
    max-[900px]:h-[50px]
    max-[900px]:w-[50px]

    max-[700px]:h-[42px]
    max-[700px]:w-[42px]
  "
>
  <UserRound
    size={34}
    strokeWidth={1.8}
    className="
      text-blue-100
      drop-shadow-[0_0_6px_rgba(80,170,255,.25)]
    "
  />

  <span
    className="
      absolute
      sm:bottom-4
      bottom-1
      left-0
      h-3
      w-3
      rounded-full
      border-2
      border-[#07244b]
      bg-emerald-400
      shadow-[0_0_6px_rgba(0,245,160,.45)]
    "
  />
</div>

                        {/* NAME */}

                        <div
                          className="
                            flex
                            min-w-0
                            flex-col
                            items-start
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <h1
                              className="
                                m-0
                                truncate
                                text-xs
                                sm:text-[24px]
                                font-bold
                                text-white
                                
                         
                          
                              "
                            >
                              {guest.name}
                            </h1>

                          </div>

                          <div
                            className="
                              mt-1.5
                              flex
                              items-center
                              gap-1.5
                              text-xs
                              text-blue-300

                              max-[700px]:text-[10px]
                            "
                          >
                            <UserRound
                              size={16}
                            />

                            <span>
                              اطلاعات مهمان
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div
                        className="
                          flex
                          shrink-0
                          gap-2
                        "
                      >
                        <button
                          className="
                            flex
                            cursor-pointer
                            h-10.5
                            w-10.5
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-blue-400/30
                            bg-blue-950/40
                            text-blue-200
                            backdrop-blur-xl
                            transition
                            hover:border-blue-400/75
                            hover:bg-blue-900/50
                            max-[700px]:h-[38px]
                            max-[700px]:w-[38px]
                          "
                        >
                          <MoreHorizontal
                            size={21}
                          />
                        </button>

                        <button
                          onClick={() =>
                            window.print()
                          }
                          className="
                            flex
                            h-10.5
                            w-10.5
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-blue-400/30
                            bg-blue-950/40
                            text-blue-200
                            backdrop-blur-xl
                            transition
                            hover:border-blue-400/75
                            hover:bg-blue-900/50

                            max-[700px]:h-[38px]
                            max-[700px]:w-[38px]
                          "
                        >
                          <Printer size={20} />
                        </button>
                      </div>
                    </div>

                    {/* =========================================
                        HIGHLIGHTS
                    ========================================= */}

                    <div
                      className="
                        mt-4
                        grid
                        shrink-0
                        sm:grid-cols-3
                        grid-cols-1
                        gap-3

                        max-[700px]:gap-2
                      "
                    >
                      <Highlight
                        color="blue"
                        icon={<QrCode size={24} />}
                        value={guest.number}
                        label="شماره مهمان"
                      />

                      <Highlight
                        color="purple"
                        icon={<Crown size={25} />}
                        value={guest.type}
                        label="نوع مهمان"
                      />

                      <Highlight
                        color="green"
                        icon={
                          <CheckCircle2
                            size={24}
                          />
                        }
                        value="تأیید حضور"
                        label="وضعیت"
                      />
                    </div>

                    {/* DIVIDER */}

                    <div
                      className="
                        my-4
                        h-px
                        w-full
                        shrink-0
                        bg-linear-to-r
                        from-transparent
                        via-blue-400/20
                        to-transparent
                      "
                    />

                    {/* =========================================
                        INFORMATION
                    ========================================= */}

                    <div
                      className="
                        grid
                        min-h-0
                        shrink
                        grid-cols-3
                        gap-2.5

                        max-[1100px]:grid-cols-6
                        max-[900px]:grid-cols-3
                        max-[700px]:grid-cols-2
                      "
                    >
                      <Info
                        label="شماره مهمان:"
                        value={guest.number}
                        icon={<QrCode />}
                      />

                      <Info
                        label="نام و نام خانوادگی:"
                        value={guest.name}
                        icon={<UserRound />}
                      />

                      <Info
                        label="وضعیت حضور:"
                        value={guest.status}
                        icon={<CheckCircle2 />}
                        color="green"
                      />

                      <Info
                        label="نوع مهمان:"
                        value={guest.type}
                        icon={<Crown />}
                        color="purple"
                      />

                      <Info
                        label="شماره تلفن:"
                        value={guest.phone}
                        icon={<Phone />}
                      />

                      <Info
                        label="تاریخ ثبت نام:"
                        value={guest.registerDate}
                        icon={<CalendarDays />}
                      />
                    </div>

                    {/* =========================================
                        BUTTONS
                    ========================================= */}

                    <div
                      className="
                        mt-4
                        grid
                        shrink-0
                        sm:grid-cols-2
                        grid-cols-1
                        gap-3

                        max-[700px]:gap-2
                      "
                    >
                      {/* REGISTER */}

                      <motion.button
                        whileHover={{
                          y: -2,
                        }}
                        whileTap={{
                          scale: 0.985,
                        }}
                        onClick={handleEnter}
                        className={`
                          group
                          relative
                          min-h-13.5
                          overflow-hidden
                          flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          text-xs
                          sm:text-base
                          font-semibold
                          transition

                          ${
                            entered
                              ? "border-emerald-300/90 bg-emerald-500/20 text-emerald-300 shadow-[0_0_30px_rgba(0,245,160,.16)]"
                              : "border-emerald-400/80 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 hover:shadow-[0_0_28px_rgba(0,245,160,.15)]"
                          }
                        `}
                      >
                        <span
                          className="
                            absolute
                            inset-y-0
                            -left-full
                            w-1/2
                            skew-x-[-20deg]
                            bg-linear-to-r
                            from-transparent
                            via-white/10
                            to-transparent
                            transition-all
                            duration-700
                            group-hover:left-[150%]
                          "
                        />

                        {entered ? (
                          <CheckCircle2
                            size={21}
                          />
                        ) : (
                          <QrCode size={21} />
                        )}

                        <span>
                          {entered
                            ? "ورود ثبت شد"
                            : "ثبت ورود مهمان"}
                        </span>
                      </motion.button>

                      {/* EDIT */}

                      <motion.button
                        whileHover={{
                          y: -2,
                        }}
                        whileTap={{
                          scale: 0.985,
                        }}
                        onClick={() =>
                          setEditing(
                            (v) => !v
                          )
                        }
                        className="
                          flex
                          min-h-13.5
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-blue-400/80
                          bg-blue-500/5
                          text-xs
                          sm:text-base
                          font-semibold
                          text-blue-400
                          transition
                          hover:bg-blue-500/10
                          hover:shadow-[0_0_28px_rgba(0,140,255,.13)]
                        "
                      >
                        <Edit3 size={21} />

                        <span>
                          {editing
                            ? "بستن ویرایش"
                            : "ویرایش اطلاعات"}
                        </span>
                      </motion.button>
                    </div>

                    {/* =========================================
                        EDIT PANEL
                    ========================================= */}

                    <AnimatePresence>
                      {editing && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                            y: -10,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            y: -10,
                          }}
                          className="
                            mt-3
                            grid
                            shrink-0
                            sm:grid-cols-3
                            grid-cols-1
                            gap-2.5
                            overflow-hidden
                            rounded-2xl
                            border
                            border-blue-400/20
                            bg-[#02183a]/60
                            p-3
                            backdrop-blur-xl

               
                          "
                        >
                          <EditInput
                            label="نام و نام خانوادگی"
                            value={guest.name}
                          />

                          <EditInput
                            label="شماره تلفن"
                            value={guest.phone}
                          />

                          <EditInput
                            label="ایمیل"
                            value={guest.email}
                          />

                          <button
                            className="
                              h-11
                              self-end
                              rounded-lg
                              bg-linear-to-br
                              from-blue-500
                              to-blue-700
                              text-sm
                              font-medium
                              text-white
                              shadow-[0_8px_20px_rgba(0,108,255,.17)]
                              transition
                              hover:from-blue-400
                              hover:to-blue-600
                            "
                          >
                            ذخیره تغییرات
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.section>
                ) : (
                  /* ============================================
                     EMPTY
                  ============================================ */

                  <motion.div
                    key="empty"
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      mx-auto
                      mt-3.5
                      flex
                      min-h-0
                      w-full
                      max-w-[1035px]
                      flex-1
                      flex-col
                      items-center
                      justify-center
                      rounded-[22px]
                      border
                      border-blue-400/20
                      bg-linear-to-br
                      from-blue-950/60
                      to-[#021332]/80
                      text-blue-400
                      shadow-[0_30px_80px_rgba(0,0,0,.35)]
                      backdrop-blur-2xl
                    "
                  >
                    <Search size={35} />

                    <h2
                      className="
                        mt-4
                        text-lg
                        font-bold
                        text-white
                      "
                    >
                      مهمانی پیدا نشد
                    </h2>

                    <p
                      className="
                        mt-2
                        text-xs
                        text-blue-300/70
                      "
                    >
                      عبارت جستجو یا فیلتر
                      انتخاب شده نتیجه‌ای ندارد.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* ============================================================
   HIGHLIGHT COMPONENT
============================================================ */

const Highlight = ({
  icon,
  value,
  label,
  color,
}: HighlightProps) => {
  const colors: Record<
    HighlightColor,
    {
      wrapper: string;
      icon: string;
      value: string;
    }
  > = {
    blue: {
      wrapper:
        "border-blue-500/25 bg-gradient-to-br from-cyan-500/[.10] to-blue-950/50",
      icon:
        "text-blue-400 drop-shadow-[0_0_8px_rgba(50,157,255,.45)]",
      value: "text-blue-400",
    },

    purple: {
      wrapper:
        "border-purple-500/30 bg-gradient-to-br from-purple-500/[.12] to-indigo-950/50",
      icon:
        "text-purple-400 drop-shadow-[0_0_10px_rgba(192,92,255,.65)]",
      value: "text-purple-400",
    },

    green: {
      wrapper:
        "border-emerald-400/25 bg-gradient-to-br from-emerald-500/[.10] to-cyan-950/50",
      icon:
        "text-emerald-400 drop-shadow-[0_0_10px_rgba(0,235,167,.65)]",
      value: "text-emerald-400",
    },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.45,
      }}
      className={`
        relative
        flex
        min-h-18
        items-center
        justify-center
        gap-2.5
        overflow-hidden
        rounded-xl
        border
        p-3
        backdrop-blur-xl
        transition

        max-[700px]:min-h-[64px]
        max-[700px]:gap-2
        max-[700px]:p-2

        ${colors[color].wrapper}
      `}
    >
      <div
        className={colors[color].icon}
      >
        {icon}
      </div>

      <div
        className="
          flex
          min-w-0
          flex-col
          gap-0.5
          text-right
        "
      >
        <strong
          className={`
            text-[20px]
            font-bold

            max-[900px]:text-[18px]
            max-[700px]:text-[16px]

            ${colors[color].value}
          `}
        >
          {value}
        </strong>

        <span
          className="
            text-[10px]
            text-blue-100/65

            max-[700px]:text-[9px]
          "
        >
          {label}
        </span>
      </div>

      {/* SHINE */}

      <span
        className="
          pointer-events-none
          absolute
          inset-0
          -translate-x-full
          bg-linear-to-r
          from-transparent
          via-white/5
          to-transparent
          transition-transform
          duration-700
          hover:translate-x-full
        "
      />
    </motion.div>
  );
};

/* ============================================================
   INFO COMPONENT
============================================================ */

const Info = ({
  label,
  value,
  icon,
  color = "blue",
}: InfoProps) => {
  const isGreen = color === "green";
  const isPurple = color === "purple";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      whileHover={{
        y: -2,
      }}
      className="
        flex
        min-h-14.5
        items-center
        gap-2.5
        overflow-hidden
        rounded-xl
        border
        border-blue-400/20
        bg-linear-to-br
        from-blue-950/60
        to-[#031c46]/75
        px-3
        py-2.5
        shadow-[inset_0_1px_0_rgba(255,255,255,.025),0_10px_35px_rgba(0,0,0,.13)]
        backdrop-blur-xl
        transition
        hover:border-blue-400/40
        hover:shadow-[0_12px_35px_rgba(0,90,255,.10)]
      
        max-[700px]:min-h-[54px]
        max-[700px]:px-2.5
      "
    >
      <div
        className={`
          shrink-0

          ${
            isGreen
              ? "text-emerald-400 drop-shadow-[0_0_7px_rgba(0,232,164,.42)]"
              : isPurple
              ? "text-purple-400 drop-shadow-[0_0_7px_rgba(188,89,255,.42)]"
              : "text-blue-400 drop-shadow-[0_0_6px_rgba(40,151,255,.28)]"
          }
        `}
      >
        {icon}
      </div>

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          gap-0.5
        "
      >
        <span
          className="
            truncate
            text-[14px]
            text-blue-200/65

            max-[700px]:text-[8px]
          "
        >
          {label}
        </span>

        <strong
          className={`
            truncate
            text-base
            font-medium

            max-[700px]:text-[11px]

            ${
              isGreen
                ? "text-emerald-400"
                : isPurple
                ? "text-purple-400"
                : "text-white"
            }
          `}
        >
          {value}
        </strong>
      </div>
    </motion.div>
  );
};

/* ============================================================
   EDIT INPUT
============================================================ */

const EditInput = ({
  label,
  value,
}: EditInputProps) => {
  return (
    <div
      className="
        flex
        min-w-0
        flex-col
        gap-1.5
      "
    >
      <label
        className="
          truncate
          text-[10px]
          text-blue-200/60
        "
      >
        {label}
      </label>

      <input
        defaultValue={value}
        className="
          h-10
          min-w-0
          rounded-lg
          border
          border-blue-400/25
          bg-[#021433]/70
          px-3
          text-xs
          text-white
          outline-none
          transition
          focus:border-blue-400/70
          focus:ring-1
          focus:ring-blue-400/20
        "
      />
    </div>
  );
};

export default Dashboard;