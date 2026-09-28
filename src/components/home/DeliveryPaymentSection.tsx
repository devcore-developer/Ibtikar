"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Truck, Wallet, Banknote, Landmark, CheckCircle2 } from "lucide-react";

export function DeliveryPaymentSection() {
  const t = useTranslations("Home");
  const [selectedDelivery, setSelectedDelivery] = useState("inside");
  const [selectedPayment, setSelectedPayment] = useState("wamd");

  const deliveryOptions = [
    { id: "inside", title: t("deliveryInside"), price: "0.500 د.ك" },
    { id: "outside", title: t("deliveryOutside"), price: "1.000 د.ك" },
  ];

  const paymentOptions = [
    { id: "wamd", label: t("paymentWamd"), Icon: Wallet },
    { id: "cod", label: t("paymentCod"), Icon: Banknote },
    { id: "bank", label: t("paymentBank"), Icon: Landmark },
  ];

  return (
    <section className="py-20 md:py-24 bg-[#FAFCFC] border-y border-[#F0F2F3]">
      <Container>
        {/* رأس القسم */}
        <div className="text-center mb-12">
          <div className="w-20 h-1 bg-[#086B70] mx-auto rounded-full mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#086B70] mb-4">
            {t("deliveryTitle")}
          </h2>
        </div>

        {/* تخطيط عمودين متوازنين */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* العمود الأيمن: خيارات التوصيل */}
          <div className="space-y-4">
            {deliveryOptions.map((option) => {
              const isSelected = selectedDelivery === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedDelivery(option.id)}
                  className={`flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-[#086B70] bg-[#EAF5F5] shadow-sm"
                      : "border-[#E8ECEE] bg-white hover:border-[#086B70]/50 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-[#086B70]" : "bg-[#EAF5F5]"}`}>
                      <Truck className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#086B70]"}`} strokeWidth={1.5} />
                    </div>
                    <span className="font-bold text-[#075F64]">{option.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#086B70]">{option.price}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#086B70]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* العمود الأيسر: طرق الدفع */}
          <Card className={`bg-white border ${selectedPayment ? "border-[#E8ECEE]" : ""} shadow-sm h-full flex flex-col`}>
            <CardContent className="p-6 flex flex-col h-full">
              <h3 className="font-bold text-[#075F64] mb-5">{t("paymentMethods")}</h3>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {paymentOptions.map((option) => {
                  const isSelected = selectedPayment === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => setSelectedPayment(option.id)}
                      className={`flex flex-col items-center text-center gap-2 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-[#086B70] bg-[#EAF5F5]"
                          : "border-[#E8ECEE] bg-white hover:border-[#086B70]/50"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#EAF5F5] flex items-center justify-center">
                        <option.Icon className="w-5 h-5 text-[#086B70]" strokeWidth={1.5} />
                      </div>
                      <span className="text-xs font-semibold text-[#075F64] leading-tight">{option.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* مربع المعلومات البنكية */}
              <div className="mt-auto bg-[#F6F8F9] p-4 rounded-lg text-xs text-[#7B8587] leading-relaxed">
                {t("paymentBankNote")}
              </div>
            </CardContent>
          </Card>

        </div>
      </Container>
    </section>
  );
}