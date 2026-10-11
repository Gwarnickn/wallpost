import {
  createContext,
  useState,
  type FunctionComponent,
  type HTMLAttributes,
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

  const triggerClose = (onClose?: () => void) => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      onClose ? onClose() : handleClose();
    }, 500);
  };

  // natywny "wstecz" zamyka modal (z animacją) zamiast cofać stronę
  useBackOverride(true, () => triggerClose());

  return (
    <>
      <ModalContext.Provider value={triggerClose}>
        <div
          className={`modal-background blur-background ${closing ? "disappear-background" : ""}`}
          onClick={() => triggerClose()}
        ></div>
        <div
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
