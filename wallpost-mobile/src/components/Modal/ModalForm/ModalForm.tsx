import { useContext, type HTMLAttributes } from "react";
import { ModalContext } from "../Modal";

interface ModalForm extends HTMLAttributes<HTMLFormElement> {
  id: string;
  onSubmit: (e: React.FormEvent) => Promise<void | (() => void)>;
}

export default function ModalForm({
  id,
  onSubmit,
  children,
  ...props
}: ModalForm) {
  const triggerClose = useContext(ModalContext);
  if (!triggerClose) {
    throw new Error(
      "ModalForm component must be placed inside the Modal component.",
    );
  }
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const onCloseCallback = await onSubmit(e);

    if (typeof onCloseCallback === "function") {
      triggerClose(onCloseCallback);
    } else {
      triggerClose();
    }
  };
  return (
    <form id={id} onSubmit={handleFormSubmit} {...props}>
      {children}
    </form>
  );
}
