import Image from "next/image";
import { Phone, MapPin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import Link from "next/link";

// أيقونات مخصصة لوسائل التواصل (بديل للأيقونات المحذوفة من Lucide)
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.3 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
);

export function Footer() {
  const t = useTranslations("Navbar");
  const tf = useTranslations("Footer");

  const links = [
    { href: "#", label: t("home") },
    { href: "#", label: t("parts") },
    { href: "#", label: t("maintenance") },
    { href: "#", label: t("technicians") },
    { href: "#", label: t("about") },
    { href: "#", label: t("contact") },
  ];

  return (
    <footer className="bg-secondary text-white mt-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-16">
          
          {/* Brand Section - تمت إضافة اللوجو هنا */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image 
                src="/logos/logo.png" 
                alt="Ebtikar Al Khaleej Logo" 
                width={48} 
                height={48} 
                className="rounded-lg"
              />
              <h3 className="text-xl font-bold">ابتكار الخليج</h3>
            </div>
            <p className="text-sm text-white/70">{tf("brandDesc")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{tf("quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {links.map((link) => (
                <li key={link.label}><Link href={link.href} className="hover:text-accent transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{tf("contactInfo")}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-accent" />
                <span>{tf("location")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-accent" />
                <span dir="ltr">+965 6569 6342</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-accent" />
                <span>Kalruwaie@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">{tf("followUs")}</h4>
            <div className="flex gap-4">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <FacebookIcon />
              </div>
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <InstagramIcon />
              </div>
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors cursor-pointer">
                <TwitterIcon />
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 py-6 text-center text-sm text-white/50">
          {tf("rights")}
        </div>
      </Container>
    </footer>
  );
}