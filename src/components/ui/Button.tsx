import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Link } from "react-router-dom"

type Variant = "primary" | "secondary" | "ghost"
type Size = "md" | "lg"

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5",
  secondary:
    "border border-slate-300 text-slate-700 hover:border-brand-400 hover:text-brand-600 dark:border-white/15 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-300",
  ghost: "text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300",
}

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  icon?: ReactNode
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined }

type ButtonAsLink = CommonProps & {
  to: string
  href?: undefined
  onClick?: () => void
}
type ButtonAsAnchor = CommonProps & {
  href: string
  to?: undefined
  target?: string
  rel?: string
  onClick?: () => void
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children, icon } = props
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} onClick={props.onClick} className={classes}>
        {children}
        {icon}
      </Link>
    )
  }

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {children}
        {icon}
      </a>
    )
  }

  const { type, disabled, onClick, ...rest } = props as ButtonAsButton
  void rest
  return (
    <button type={type ?? "button"} disabled={disabled} onClick={onClick} className={classes}>
      {children}
      {icon}
    </button>
  )
}
