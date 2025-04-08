import React from "react";
import { cn } from "@/lib/utils";

type LabelProps = {
  className: string
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLLabelElement>

const Label: React.FC<LabelProps> = ({ className, children , ...props }) => {
  return (
    <label
      className={cn( className )}
      { ...props }
    >
      { children }
    </label>
  );
}

export default Label;