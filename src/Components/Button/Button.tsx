import React from "react";
import style from "./button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled,
}) => {
  return (
    <button
      type={type}
      className={style.all_buttons}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
