import Link from "next/link";

interface BrandLogoProps {
  inverted?: boolean;
}

export default function BrandLogo({ inverted = false }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 group focus:outline-none"
      aria-label="BharaDei.com Home"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#7624F4] to-[#0C50FB] text-white shadow-sm transition-transform group-hover:scale-105">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 9.5L12 4L20 9.5V18.5C20 19.3284 19.3284 20 18.5 20H5.5C4.67157 20 4 19.3284 4 18.5V9.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9 14.5L11.5 17L15.5 11.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={`text-xl font-extrabold tracking-[-0.03em] ${
          inverted ? "text-white" : "text-[var(--ink-strong)]"
        }`}
      >
        BharaDei
        <span className="text-[var(--purple)]">.com</span>
      </span>
    </Link>
  );
}
