import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-charcoal text-cream hover:bg-[#3b332f] focus-visible:outline-charcoal",
  secondary:
    "border border-charcoal/15 bg-transparent text-charcoal hover:border-charcoal/30 hover:bg-charcoal/[0.03] focus-visible:outline-charcoal",
  ghost:
    "text-charcoal/70 hover:text-charcoal focus-visible:outline-charcoal",
};

const sizes = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
};

const baseClass =
  "inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-wide whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40";

type CommonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: () => void;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { className, variant = "primary", size = "md", children } = props;
  const classes = cn(baseClass, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes} onClick={props.onClick}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  const {
    type = "button",
    variant: ignoredVariant,
    size: ignoredSize,
    className: ignoredClassName,
    children: ignoredChildren,
    href: ignoredHref,
    ...rest
  } = buttonProps;
  void ignoredVariant;
  void ignoredSize;
  void ignoredClassName;
  void ignoredChildren;
  void ignoredHref;

  return (
    <button {...rest} type={type} className={classes}>
      {children}
    </button>
  );
}
