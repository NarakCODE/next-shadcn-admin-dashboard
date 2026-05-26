"use client";

import { mynauiIcons } from "@/icons/mynaui-icons";

interface LocalIconProps {
  icon: string;
  className?: string;
}

export function LocalIcon({ icon, className = "h-4 w-4" }: LocalIconProps) {
  const iconName = icon.replace("mynaui:", "");
  const svgContent = mynauiIcons[iconName];

  if (!svgContent) {
    console.warn(`Icon not found: ${icon}`);
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
