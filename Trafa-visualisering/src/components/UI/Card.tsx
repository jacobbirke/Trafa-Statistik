import React, { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
