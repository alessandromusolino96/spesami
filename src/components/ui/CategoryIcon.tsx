interface CategoryIconProps {
  icon: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const imageSizes = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const emojiSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

export function isCategoryImage(icon: string): boolean {
  return icon.startsWith("/");
}

export function CategoryIcon({ icon, className = "", size = "md" }: CategoryIconProps) {
  if (isCategoryImage(icon)) {
    return <img src={icon} alt="" className={`${imageSizes[size]} object-contain ${className}`} />;
  }

  return <span className={`${emojiSizes[size]} leading-none ${className}`}>{icon}</span>;
}
