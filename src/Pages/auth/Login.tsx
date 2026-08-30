import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  Send,
  Check,
} from "lucide-react";

import { useState } from "react";

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

const initialValues: LoginValues = {
  email: "",
  password: "",
  remember: false,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("نام کاربری وارد شده معتبر نیست")
    .required("نام کاربری الزامی است"),

  password: Yup.string()
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
    .required("رمز عبور الزامی است"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: LoginValues) => {
    console.log("LOGIN:", values);

    /*
      اینجا API خودت رو قرار بده:
      const response = await axios.post("/api/login", values);
      console.log(response.data);
    */

    await new Promise((resolve) => setTimeout(resolve, 800));
  };

  return (
    <main
      dir="rtl"
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-[#021373]
      
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

    
        <div
          className="
            absolute
            inset-0
            z-0
            h-full
            w-full
          "
        >
          <img
            src="/maze-background.png"
            alt=""
            aria-hidden="true"
            className="
              h-full
              w-full
              object-cover
              object-center
            "
          />
        </div>


      {/* Dark overlay */}

      <div
        className="
          absolute
          inset-0
          -z-20
          bg-[#021373]/35
        "
      />

      {/* Cinematic gradient */}

      <div
        className="
          absolute
          inset-0
          -z-20
          bg-[radial-gradient(circle_at_center,transparent_15%,rgba(2,19,115,0.30)_55%,rgba(2,19,115,0.72)_100%)]
        "
      />

      {/* =====================================================
          BLUE GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          -z-10
          h-105
          w-105
          rounded-full
          bg-[#055AFF]/20
          blur-[130px]
          sm:h-[520px]
          sm:w-[520px]
        "
      />

      {/* =====================================================
          GREEN GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -bottom-48
          -right-40
          -z-10
          h-[430px]
          w-[430px]
          rounded-full
          bg-[#03D54A]/15
          blur-[140px]
          sm:h-[550px]
          sm:w-[550px]
        "
      />

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}

      <div
        className="
          relative
          flex
          min-h-screen
          min-h-[100svh]
          w-full
          items-center
          justify-center
          px-4
          py-8
          sm:px-6
          sm:py-12
        "
      >

        {/* =================================================
            GLASS CARD
        ================================================== */}

        <section
          className="
            relative
            w-full
            max-w-[470px]
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.20]
            bg-white/[0.075]
            p-5
            shadow-[0_35px_100px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]
            backdrop-blur-[28px]
            backdrop-saturate-150
            sm:rounded-4xl
            sm:p-9
          "
        >

          {/* =================================================
              GLASS TOP LIGHT
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-px
              w-[75%]
              -translate-x-1/2
              bg-linear-to-r
              from-transparent
              via-white/70
              to-transparent
            "
          />

          {/* =================================================
              INTERNAL BLUE GLOW
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-32
              -left-32
              h-72
              w-72
              rounded-full
              bg-[#055AFF]/15
              blur-[100px]
            "
          />

          {/* =================================================
              LOGO
          ================================================== */}

          <div
            className="
              relative
              z-10
              mb-7
              flex
              items-center
              justify-center
              gap-2.5
              direction-ltr
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-[13px]
                bg-linear-to-br
                from-[#055AFF]
                to-[#1476FF]
                text-xl
                font-black
                text-white
                shadow-[0_8px_30px_rgba(5,90,255,0.45)]
              "
            >
              M
            </div>

            <span
              className="
                text-[25px]
                font-extrabold
                tracking-[2px]
                text-white
              "
            >
              MAZE
            </span>

          </div>

          {/* =================================================
              HEADER
          ================================================== */}

          <div
            className="
              relative
              z-10
              mb-7
              text-center
            "
          >

            <h1
              className="
                mb-2
                text-[26px]
                font-extrabold
                leading-tight
                text-white
                sm:text-[30px]
              "
            >
              خوش آمدید!
            </h1>

            <p
              className="
                mx-auto
                max-w-82.5
                text-[12px]
                leading-7
                text-white/60
                sm:text-sm
              "
            >
              لطفاً برای ادامه وارد حساب کاربری خود شوید
            </p>

          </div>

          {/* =================================================
              FORMIK
          ================================================== */}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="relative z-10 flex flex-col gap-4">

                {/* =================================================
                    EMAIL
                ================================================== */}

                <div>
                  <div className="group relative">
                    <Mail
                      size={20}
                      strokeWidth={1.8}
                      className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        z-10
                        -translate-y-1/2
                        text-white/65
                        transition-colors
                        group-focus-within:text-[#055AFF]
                      "
                    />
                    <Field
                      name="email"
                      type="email"
                      placeholder="نام کاربری"
                      autoComplete="email"
                      className="
                        h-15
                        w-full
                        rounded-2xl
                        border
                        border-white/[0.16]
                        bg-white/[0.055]
                        pr-13
                        pl-5
                        text-sm
                        text-white
                        outline-none
                        transition-all
                        duration-200

                        placeholder:text-white/45

                        hover:border-white/[0.25]

                        focus:border-[#055AFF]/80
                        focus:bg-white/[0.08]
                        focus:ring-4
                        focus:ring-[#055AFF]/10

                        sm:h-15.5
                      "
                    />

                  </div>

                  <ErrorMessage
                    name="email"
                    component="p"
                    className="
                      mt-1.5
                      pr-1
                      text-[11px]
                      text-red-300
                    "
                  />

                </div>

                {/* =================================================
                    PASSWORD
                ================================================== */}

                <div>

                  <div className="group relative">

                    <LockKeyhole
                      size={20}
                      strokeWidth={1.8}
                      className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        z-10
                        -translate-y-1/2
                        text-white/65
                        transition-colors
                        group-focus-within:text-[#055AFF]
                      "
                    />

                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="رمز عبور"
                      autoComplete="current-password"
                      className="
                        h-15
                        w-full
                        rounded-2xl
                        border
                        border-white/[0.16]
                        bg-white/[0.055]
                        pr-13
                        pl-
                        text-sm
                        text-white
                        outline-none
                        transition-all
                        duration-200
                        placeholder:text-white/45
                        hover:border-white/[0.25]
                        focus:border-[#055AFF]/80
                        focus:bg-white/[0.08]
                        focus:ring-4
                        focus:ring-[#055AFF]/10
                        sm:h-15.5
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      aria-label={
                        showPassword
                          ? "مخفی کردن رمز"
                          : "نمایش رمز"
                      }
                      className="
                        absolute
                        left-3.5
                        top-1/2
                        flex
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        p-1.5
                        text-white/50
                        transition
                        hover:bg-white/10
                        hover:text-white
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={20} strokeWidth={1.8} />
                      ) : (
                        <Eye size={20} strokeWidth={1.8} />
                      )}
                    </button>

                  </div>

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="
                      mt-1.5
                      pr-1
                      text-[11px]
                      text-red-300
                    "
                  />

                </div>

                {/* =================================================
                    OPTIONS
                ================================================== */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    text-[11px]
                    sm:text-xs
                  "
                >

                  {/* Remember */}

                  <label
                    className="
                      flex
                      cursor-pointer
                      select-none
                      items-center
                      gap-2
                      text-white/65
                    "
                  >

                    <Field
                      type="checkbox"
                      name="remember"
                      className="peer sr-only"
                    />

                    <span
                      className="
                        flex
                        h-5.25
                        w-5.25
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        border
                        border-white/30
                        bg-white/4
                        transition-all

                        peer-checked:border-[#03D54A]
                        peer-checked:bg-[#03D54A]
                        peer-checked:shadow-[0_0_18px_rgba(3,213,74,0.3)]
                      "
                    >
                      <Check
                        size={13}
                        strokeWidth={3}
                        className="
                          scale-0
                          text-white
                          transition-transform
                          peer-checked:scale-100
                        "
                      />
                    </span>

                    <span>
                      مرا به خاطر بسپار
                    </span>

                  </label>

                  {/* Forgot */}

                  <button
                    type="button"
                    className="
                      shrink-0
                      border-none
                      bg-transparent
                      font-inherit
                      text-[#03D54A]
                      transition
                      hover:text-[#58ed88]
                      hover:underline
                    "
                  >
                    رمز عبور را فراموش کردید؟
                  </button>

                </div>

                {/* =================================================
                    SUBMIT
                ================================================== */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    group
                    relative
                    cursor-pointer
                    mt-1
                    flex
                    h-[60px]
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[16px]
                    bg-gradient-to-l
                    from-[#055AFF]
                    via-[#00C978]
                    to-[#03D54A]
                    text-sm
                    font-bold
                    text-white
                    shadow-[0_12px_35px_rgba(5,90,255,0.25)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_18px_45px_rgba(5,90,255,0.35)]
                    active:translate-y-0
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                    sm:h-[62px]
                  "
                >

                  {/* Shine */}

                  <span
                    className="
                      absolute
                      inset-y-0
                      -left-1/2
                      w-1/3
                      skew-x-[-20deg]
                      bg-gradient-to-r
                      from-transparent
                      via-white/25
                      to-transparent
                      transition-all
                      duration-700
                      group-hover:left-[120%]
                    "
                  />

                  <span className="relative z-10">
                    {isSubmitting
                      ? "در حال ورود..."
                      : "ورود به حساب"}
                  </span>

                  <ArrowLeft
                    size={21}
                    strokeWidth={2}
                    className="
                      absolute
                      left-5
                      transition-transform
                      duration-300
                      group-hover:-translate-x-1
                    "
                  />

                </button>

                {/* =================================================
                    DIVIDER
                ================================================== */}

                <div
                  className="
                    my-1
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span className="h-px flex-1 bg-white/[0.13]" />

                  <p
                    className="
                      whitespace-nowrap
                      text-[10px]
                      text-white/40
                    "
                  >
                    ورود به اکانت داشبرد ماز 
                  </p>

                  <span className="h-px flex-1 bg-white/[0.13]" />

                </div>

                
              </Form>
            )}
          </Formik>

    

        </section>

      </div>
    </main>
  );
}