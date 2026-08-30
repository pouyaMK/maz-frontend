import { motion } from "framer-motion";
import AnimatedMaze from "../maze/AnimatedMaze";
const HeroSection = () => {
  return (
    <section
      dir="rtl"
      className="
        relative
        h-screen
        w-full
        overflow-hidden
        bg-[#102D6B]
        flex
        items-center
        justify-center
      "
      style={{
        fontFamily: "YekanBakh",
      }}
    >
      {/* =========================
          MAZ LOGO
      ========================== */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute
          top-[6%]
          right-[7%]
          z-20
        "
      >
        <img
          src="/img/logo-landing.png"
          alt="Maz"
          className="
            h-auto
            w-[85px]
            object-contain
            sm:w-[85px]
            md:w-[95px]
          "
        />
      </motion.div>
      {/* =========================
          MAIN HERO CONTENT
      ========================== */}
      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-center
          -translate-y-[10vh]
        "
      >
        {/* ==================================================
            LINE 1 + LINE 2
        ================================================== */}

        <div
          className="
            flex
            flex-row
            items-center
            justify-center
            gap-0.5
            m-0
            p-0
            whitespace-nowrap
            leading-none
          "
          dir="rtl"
        >
          {/* ==========================================
              DIV اول
              فقط عدد ۱۳
          =========================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 15,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              flex
              items-center
              justify-center
              m-0
              mt-2
              p-0
              leading-none
            "
          >
            <span
              className="
                block
                m-0
                p-0
                font-semibold
                text-[#45C83A]
                text-[65px]
                leading-[0.72]
                tracking-[-0.08em]
                sm:text-[74px]
                md:text-[80px]
              "
            >
              ۱۳
            </span>
          </motion.div>

          {/* ==========================================
              DIV دوم
              سال تا قله
              +
              13 YEARS TO THE PEAK
          =========================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -15,
              filter: "blur(6px)",
            }}
            animate={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.9,
              delay: 0.95,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              flex
              flex-col
              items-start
              justify-center
              m-0
              p-0
              leading-none
            "
          >
            {/* =========================
                سال تا قله
            ========================== */}

            <span
              className="
                block
                m-0
                p-0
                font-normal
                text-white
                text-[30px]
                leading-[0.78]
                tracking-[-0.06em]
                sm:text-[40px]
                md:text-[50px]
              "
            >
              سال تا قله
            </span>

            {/* =========================
                13 YEARS TO THE PEAK
            ========================== */}

            <motion.span
              initial={{
                opacity: 0,
                y: 4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 1.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              dir="ltr"
              className="
                block
                m-0
                p-0
                font-light
                text-white
                text-[11px]
                mt-1
                leading-[0.8]
                tracking-[0.01em]
                sm:text-[14px]
                md:text-[18.5px]
              "
            >
              13 YEARS TO THE PEAK
            </motion.span>
          </motion.div>
        </div>

        {/* ==================================================
            EVEREST
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
            scale: 0.96,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1,
            delay: 1.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          dir="ltr"
          className="
            m-0
            p-0
            font-light
            text-white
            text-[55px]
            leading-none
            tracking-[-0.055em]
            sm:text-[63px]
            md:text-[70px]
          "
        >
          EVEREST
        </motion.div>
      </div>

      {/* =========================
            ANIMATED MAZE
        ========================= */}
         <div
        className="
          absolute
          bottom-0
          left-0
          z-0
          w-full
          h-[55vh]
          pointer-events-none
        "
      >
        <AnimatedMaze />
      </div>

    </section>
  );
};

export default HeroSection;