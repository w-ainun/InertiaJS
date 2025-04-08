import React from "react";
import { cn } from "@/lib/utils";

type InputProps = {
  className: string
} & React.HTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      autoComplete="off"
      className={cn( className )}
      { ...props }
    />
  );
}

export default Input;