import {
  createContext,
  useRef,
  useState,
  type FunctionComponent,
  type HTMLAttributes,
  type TouchEvent,
} from "react";
import "./modal.scss";
import { useBackOverride } from "../../hooks/useBackOverride";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  handleClose: () => void;
  title?: string;
  description?: string;
  bottom?: boolean;
}
export const ModalContext = createContext<
  ((onClose?: () => void) => void) | null
>(null);

const Modal: FunctionComponent<ModalProps> = ({
  handleClose,
  title,
  description,
  className,
  children,
  bottom,
}) => {
  const [closing, setClosing] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);

  const triggerClose = (onClose?: () => void) => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      onClose ? onClose() : handleClose();
    }, 500);
  };

  useBackOverride(true, () => triggerClose());

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    dragStart.current =
      bottom && event.currentTarget.scrollTop <= 0
        ? event.touches[0].clientY
        : null;
  };

  const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const element = sheet.current;
    if (dragStart.current === null || !element) return;

    if (element.scrollTop > 0) {
      dragStart.current = null;
      element.style.translate = "0 0";
      return;
    }
    const distance = Math.max(0, event.touches[0].clientY - dragStart.current);
    element.style.transition = "none";
    element.style.translate = `0 ${distance}px`;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const element = sheet.current;
    if (dragStart.current === null || !element) return;

    const distance = event.changedTouches[0].clientY - dragStart.current;
    dragStart.current = null;
    if (distance > 100) {
      triggerClose();
    } else {
      element.style.transition = "translate 0.2s ease";
      element.style.translate = "0 0";
    }
  };

  return (
    <>
      <ModalContext.Provider value={triggerClose}>
        <div
          className={`modal-background blur-background ${closing ? "disappear-background" : ""}`}
          onClick={() => triggerClose()}
        ></div>
        <div
          ref={sheet}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          className={`modal ${className || ""} ${bottom ? "modal-bottom" : "modal-center"} ${closing ? "disappear-modal" : ""}`}
        >
          {title && <h1>{title}</h1>}
          {description && <p>{description}</p>}
          {children}
        </div>
      </ModalContext.Provider>
    </>
  );
};
export default Modal;
