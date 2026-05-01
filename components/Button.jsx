import Link from "next/link";

const styles = {
  primary: "bg-gradient-to-r from-[#B11226] to-ax-hot text-white shadow-glow hover:-translate-y-0.5",
  secondary: "border border-white/20 bg-white/10 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-red-400/70",
  dark: "bg-ax-ink text-white hover:-translate-y-0.5",
  outline: "border border-ax-line bg-white text-ax-ink hover:-translate-y-0.5 hover:border-ax-red"
};

export default function Button({ href, children, variant = "primary", className = "", ...props }) {
  const classNames = `inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-black transition duration-300 ${styles[variant]} ${className}`;
  if (href) return <Link href={href} className={classNames}>{children}</Link>;
  return <button className={classNames} {...props}>{children}</button>;
}
