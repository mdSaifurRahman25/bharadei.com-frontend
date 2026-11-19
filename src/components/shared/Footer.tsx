import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import BrandLogo from "./BrandLogo";

function XBrandIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[var(--night)] text-[#E6E1EF] border-t border-[var(--night-border)]">
      <div className="bd-container py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand summary */}
          <div className="space-y-4">
            <BrandLogo inverted />
            <p className="text-sm leading-relaxed text-[#B7B0C8]">
              Everything You Need, Ready to Rent. Bangladesh&apos;s trusted
              equipment rental marketplace connecting verified owners and
              renters across cameras, tools, vehicles, and event gear.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F2940] bg-[#262036] px-3 py-1.5 text-xs font-medium text-[#D8CCF4]">
              <ShieldCheck size={14} className="text-[#8B46FF]" />
              Stripe Secured Checkout
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white mb-4">
              Marketplace
            </h3>
            <ul className="space-y-2.5 text-sm text-[#B7B0C8]">
              <li>
                <Link href="/equipment" className="hover:text-white transition-colors">
                  All Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Photography+Equipment"
                  className="hover:text-white transition-colors"
                >
                  Photography Gear
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Construction+Equipment"
                  className="hover:text-white transition-colors"
                >
                  Construction Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Event+Equipment"
                  className="hover:text-white transition-colors"
                >
                  Event &amp; Stage Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm text-[#B7B0C8]">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Become a Member
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
              Connect
            </h3>
            <ul className="space-y-2.5 text-sm text-[#B7B0C8]">
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-[#8B46FF] shrink-0" />
                <span>Banani, Dhaka 1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-[#8B46FF] shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-[#8B46FF] shrink-0" />
                <span>support@bharadei.com</span>
              </li>
            </ul>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="BharaDei on X"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2F2940] bg-[#262036] text-[#E6E1EF] transition-colors hover:border-[#8B46FF] hover:text-white"
              >
                <XBrandIcon />
              </a>
              <a
                href="mailto:support@bharadei.com"
                aria-label="Email BharaDei"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2F2940] bg-[#262036] text-[#E6E1EF] transition-colors hover:border-[#8B46FF] hover:text-white"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--night-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C84A0]">
          <p>&copy; 2026 BharaDei.com. All rights reserved.</p>
          <p className="font-mono">Rent what you need, lend what you own.</p>
        </div>
      </div>
    </footer>
  );
}
