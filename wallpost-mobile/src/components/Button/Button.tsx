import {
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useRef,
} from 'react';
import './button.scss';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  rippleColor?: "black" | "white" 
}

const Button = ({
  children,
  className,
  onMouseDown,
  rippleColor,
  type,
  ...rest
}: ButtonProps) => {
  const rippleContainerRef = useRef<HTMLSpanElement>(null);

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const container = rippleContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'button__ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    container.appendChild(ripple);

    const remove = () => ripple.remove();
    ripple.addEventListener('animationend', remove, { once: true });
    // safety net in case the animation is interrupted/skipped
    setTimeout(remove, 500);
  };

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    onMouseDown?.(event);
    createRipple(event);
  };

  return (
    <button
      className={`button ${className ?? 'button-basic'} ${rippleColor}-ripple`}
      onMouseDown={handleMouseDown}
      type={type ?? 'button'}
      {...rest}
    >
      <span ref={rippleContainerRef} className="button__ripples" />
      <div className="button__content">{children}</div>
    </button>
  );
};

export default Button;
