"use client";

interface ConfirmSubmitButtonProps {
  label: string;
  confirmMessage: string;
  className?: string;
  ariaLabel?: string;
}

export function ConfirmSubmitButton({
  label,
  confirmMessage,
  className,
  ariaLabel,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      aria-label={ariaLabel}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
