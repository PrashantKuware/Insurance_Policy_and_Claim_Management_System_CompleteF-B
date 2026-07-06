import React from "react";
import { motion } from "framer-motion";

const GlassCard = ({
  children,
  className = "",
  hoverable = false,
  onClick,
  padding = true,
  as: Component = "div",
  delay = 0,
}) => {
  const hoverProps = hoverable
    ? {
        whileHover: { y: -4, scale: 1.01 },
        transition: { duration: 0.25, ease: "easeOut" },
      }
    : {};

  const Element = onClick || hoverable ? motion.div : Component;

  return (
    <Element
      onClick={onClick}
      className={`
        page-card
        ${padding ? "p-6 sm:p-8" : ""}
        ${hoverable ? "hover-card cursor-pointer" : ""}
        ${className}
      `}
      {...hoverProps}
    >
      {children}
    </Element>
  );
};

export default GlassCard;
