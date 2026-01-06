import React from "react";

type Props = {
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
};

export const Button: React.FC<Props> = ({
  onClick,
  variant = "primary",
  className = "",
  children,
  disabled,
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 disabled:opacity-50",
    secondary:
      "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
