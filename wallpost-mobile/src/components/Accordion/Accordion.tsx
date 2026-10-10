import type React from "react";
import "./Accordion.scss";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "griddy-icons";

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: string;
}

export default function Accordion({
  header,
  children,
  ...props
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={`accordion-wrapper ${isOpen ? "open" : ""}`} {...props}>
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <p>{header || "Accordion"}</p>
        <div className="header-line"></div>
        {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
      <div className="accordion-collapse">
        <div className="accordion-body">{children}</div>
      </div>
    </div>
  );
}
