import { useRef, useState } from "react"
import { motion } from "framer-motion"

import {
  sectionTwoBluePaths,
  sectionTwoGreenPaths,
} from "../maze/sectionTwoPaths"

const SectionTwo = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleVideo = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }

  return (
    <section
      dir="rtl"
      className="
        relative isolate
        min-h-screen
        w-full
        overflow-hidden
        bg-[#102D6B]
        text-white
      "
    >

      {/* =================================================
          MAZE
      ================================================= */}

      <svg
        viewBox="0 0 508 552"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          h-full
          w-full
          overflow-visible
          top-[10px]
        "
      >

        {/* GREEN */}

        {sectionTwoGreenPaths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            fill="none"
            stroke="#48B85A"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            whileInView={{
              pathLength: 1,
              opacity: 1,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: path.duration,
              delay: path.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* BLUE */}

        {sectionTwoBluePaths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            fill="none"
            stroke="#6880BD"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            whileInView={{
              pathLength: 1,
              opacity: 0.9,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: path.duration,
              delay: path.delay,
              ease: "easeInOut",
            }}
          />
        ))}

      </svg>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
        
          min-h-screen
          w-full
          max-w-[760px]
          flex-col
          items-center
          px-5
          pb-16
          pt-7
          text-center
          sm:px-6
          sm:pt-10
        "
      >

        {/* =================================================
            TOP TEXT
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: -40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            flex
            w-full
            max-w-[440px]
            flex-col
            items-center
          "
        >

          {/* TITLE */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="
              mb-3
              text-[17px]
              font-black
              leading-[1.7]
              sm:mb-5
              sm:text-[22px]
              md:text-[25px]
            "
          >
            جناب آقای مهدی حسینی
          </motion.h2>


          {/* DESCRIPTION */}

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
            className="
              m-0
              w-full
              text-[14px]
              font-semibold
              leading-loose
              text-white/90
              sm:text-[12px]
              sm:leading-[2.1]
              md:text-[14px]
            "
          >
خیلی خوشحال می‌شیم شما رو در جشن اورست ماز ببینیم؛ جشنی که به مناسبت رسیدن ماز به قله آموزش کشور برگزار میشه.
در مسیر این موفقیت، تک‌تک همراهان ماز، از جمله شما، سهیم بودید و دوست داریم این اتفاق بزرگ رو کنار هم جشن بگیریم. 
برای اینکه برنامه بدون حاشیه و با خیال راحت برگزار بشه و به هممون خوش بگذره ، لطفاً با خودتون هیچ کس رو همراه نیارید و پوشش متناسب رو رعایت کنید. ممنون که با همکاری تون به ما کمک میکنید تا میزبان خوبی براتون باشیم.
          </motion.p>


          {/* LAST TEXT */}

          <motion.strong
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.55,
              ease: "backOut",
            }}
            className="
              mt-2
              text-[14px]
              font-semibold
              leading-[1.8]
              sm:text-[16px]
              md:text-[18px]
            "
          >
            منتظرتون هستیم.
          </motion.strong>

        </motion.div>


        {/* =================================================
            VIDEO
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 65,
            scale: 0.78,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 1,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            relative
            z-20
            mt-[105px]
            aspect-[0.715]
            w-[55vw]
            max-w-[225px]
            overflow-visible
            rounded-[15px]
            sm:mt-[125px]
            sm:w-[250px]
            sm:max-w-[250px]
            sm:rounded-[18px]
            md:mt-[140px]
            md:w-[265px]
            md:max-w-[265px]
          "
        >

          {/* VIDEO GLOW */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 1.2,
              delay: 0.35,
            }}
            className="
              pointer-events-none
              absolute
              -inset-4
              -z-10
              rounded-[30px]
              bg-[radial-gradient(ellipse,rgba(90,120,200,0.2),transparent_70%)]
              blur-xl
            "
          />

          {/* VIDEO */}

          <video
            ref={videoRef}
            src="/videos/section2.mp4"
            playsInline
            poster="/img/section2-cover.png"
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="
              relative
              block
              h-full
              w-full
              rounded-[15px]
              bg-[#081D4B]
              object-cover
              shadow-[0_20px_55px_rgba(0,0,0,0.25)]
              outline-none
              sm:rounded-[18px]
            "
          />


          {/* PLAY BUTTON */}

          {!isPlaying && (
            <motion.button
              type="button"
              onClick={toggleVideo}
              aria-label="پخش ویدیو"
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: 0.7,
                ease: "backOut",
              }}
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.92,
              }}
              className="
                absolute
                left-1/2
                top-1/2
                z-30
                flex
                aspect-square
                w-[50px]
                -translate-x-1/2
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border-0
                bg-white/95
                p-0
                shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                backdrop-blur-md
                transition
                sm:w-[58px]
                md:w-[62px]
              "
            >

              <span
                className="
                  ml-1
                  h-0
                  w-0
                  border-b-[9px]
                  border-l-[15px]
                  border-t-[9px]
                  border-b-transparent
                  border-t-transparent
                  border-l-[#596070]
                  sm:border-b-[10px]
                  sm:border-l-[16px]
                  sm:border-t-[10px]
                "
              />

            </motion.button>
          )}

        </motion.div>


        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-7
            w-full
            max-w-120
            text-center
            sm:mt-9
          "
        >

          <p
            className="
              m-0
              text-[14px]
              font-semibold
              leading-loose
              text-white/90
              sm:text-[12px]
              sm:leading-[2.1]
              md:text-[14px]
            "
          >
           برای اینکه برنامه بدون حاشیه و با خیال راحت برگزار بشه و به هممون خوش بگذره ، لطفاً با خودتون هیچ کس رو همراه نیارید و پوشش متناسب رو رعایت کنید. ممنون که با همکاری تون به ما کمک میکنید تا میزبان خوبی براتون باشیم.
          </p>

        </motion.div>


        {/* =================================================
            EVENT INFO
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
            delay: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-8
            w-full
            text-center
            sm:mt-10
          "
        >

          <p className="m-0 text-[14px] font-semibold leading-[1.9] text-white/90 sm:text-[12px] md:text-[14px]">
            زمان: ۲۰ شهریور، ساعت ۱۷
          </p>

          <p className="m-0 text-[14px] font-semibold leading-[1.9] text-white/90 sm:text-[12px] md:text-[14px]">
            مکان: نمایشگاه بین‌المللی تهران، درب جنوبی
          </p>

          <p className="m-0 text-[14px] font-semibold leading-[1.9] text-white/90 sm:text-[12px] md:text-[14px]">
            درب شمالی غربی سالن شماره ۵
          </p>

        </motion.div>

      </div>

    </section>
  )
}

export default SectionTwo