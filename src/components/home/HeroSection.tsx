"use client";

import { useTranslations, useLocale } from "next-intl";
import { Refrigerator, WashingMachine, Wind, Wrench, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function HeroSection() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const ArrowIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  const services = [
    { icon: WashingMachine, text: t("card1"), bg: "bg-[#EAF5F5]", textCol: "text-[#075F64]" },
    { icon: Refrigerator, text: t("card2"), bg: "bg-[#EAF5F5]", textCol: "text-[#075F64]" },
    { icon: Wrench, text: t("card3"), bg: "bg-[#EAF5F5]", textCol: "text-[#075F64]" },
    { icon: Wind, text: t("card4"), bg: "bg-[#FDF4E6]", textCol: "text-[#F6A623]" },
  ];

  return (
    // تمت إضافة كلاس hero-section
    <section className="hero-section relative bg-[#FAFCFC] overflow-hidden">
      <Container className="pt-10 md:pt-12 pb-16 md:pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* RIGHT SIDE - Text Content */}
          <div className="text-center lg:text-start">
            <span className="inline-block px-4 py-1.5 bg-[#EAF5F5] text-[#086B70] rounded-full text-sm font-semibold mb-6">
              {t("eyebrow")}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#086B70] mb-6 leading-tight">
              {t("title")}
            </h1>
            
            <p className="text-lg text-[#7B8587] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t("subtitle")}
            </p>

            {/* تمت إضافة كلاس hero-buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <button className="h-12 px-7 bg-[#086B70] text-white rounded-xl font-semibold hover:bg-[#075F64] transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#086B70]/20">
                {t("primaryBtn")}
                <ArrowIcon size={18} />
              </button>
              <button className="h-12 px-7 bg-white border border-[#086B70] text-[#086B70] rounded-xl font-semibold hover:bg-[#EAF5F5] transition-colors duration-300">
                {t("secondaryBtn")}
              </button>
            </div>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm font-medium text-[#075F64]">
              <span className="flex items-center gap-2"><CheckCircle size={18} className="text-[#F6A623]" /> {t("trust1")}</span>
              <span className="flex items-center gap-2"><CheckCircle size={18} className="text-[#F6A623]" /> {t("trust2")}</span>
              <span className="flex items-center gap-2"><CheckCircle size={18} className="text-[#F6A623]" /> {t("trust3")}</span>
            </div>
          </div>

          {/* LEFT SIDE - Service Grid */}
          <div className="relative flex justify-center items-center min-h-[450px] lg:min-h-[500px]">
            <div className="relative z-10 bg-white p-6 rounded-3xl shadow-2xl shadow-[#086B70]/10 border border-[#E8ECEE]/50 w-full max-w-sm">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {services.map((service, idx) => (
                  <div key={idx} className={`${service.bg} p-5 md:p-6 rounded-2xl flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.02] duration-200 aspect-square justify-center`}>
                    <div className="w-12 h-12 flex items-center justify-center">
                      <service.icon className={`w-8 h-8 ${service.textCol}`} strokeWidth={1.5} />
                    </div>
                    <span className={`text-xs md:text-sm font-semibold ${service.textCol}`}>{service.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}