import React, { useState, useEffect, useRef } from "react";
import * as GriddyIcons from "griddy-icons";
import "./iconpicker.scss";
import { useBackOverride } from "../../../hooks/useBackOverride";

type IconPickerProps = {
  name: string;
  value?: string;
  onChange?: (iconName: string) => void;
  availableIcons: string[];
};

export const renderIcon = (iconName: string, size: number) => {
  if (!iconName) return null;
  const Component = (
    GriddyIcons as Record<
      string,
      React.ComponentType<{ size?: string | number; color?: string }>
    >
  )[iconName];
  return Component ? <Component size={`${size}px`} /> : null;
};

const IconPicker: React.FunctionComponent<IconPickerProps> = ({
  name,
  value = "",
  onChange,
  availableIcons,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // natywny "wstecz" zamyka listę ikon zamiast cofać stronę
  useBackOverride(isOpen, () => setIsOpen(false));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (iconName: string) => {
    setSelectedValue(iconName);
    if (onChange) {
      onChange(iconName);
    }
    setIsOpen(false);
  };

  return (
    <div className="form-icon-picker-wrapper" ref={containerRef}>
      <button
        type="button"
        className="form-icon-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValue ? (
          <span className="selected-icon">
            {renderIcon(selectedValue, 20)}
            {selectedValue}
          </span>
        ) : (
          <span className="placeholder">Select icon</span>
        )}
      </button>

      {isOpen && (
        <div className="form-icon-picker-dropdown">
          {availableIcons.map((iconName) => (
            <button
              key={iconName}
              type="button"
              className={`icon-option ${selectedValue === iconName ? "active" : ""}`}
              onClick={() => handleSelect(iconName)}
            >
              {renderIcon(iconName, 20)}
            </button>
          ))}
        </div>
      )}
      <input type="hidden" name={name} value={selectedValue} />
    </div>
  );
};

export default IconPicker;
