import React, { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-white h-auto  p-6 rounded-lg shadow-md border-gray-300 border-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
