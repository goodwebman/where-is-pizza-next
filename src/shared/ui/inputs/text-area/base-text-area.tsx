import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  ReactNode,
  useId,
  useState,
} from 'react';

import { getBaseInputClasses } from '../base-input/styles/get-classes';

export type BaseTextareaProps = {
  classNameOuter?: string;
  classNameField?: string;
  label?: string;
  contentLeft?: ReactNode;
  contentRight?: ReactNode;
  successMessage?: string;
  errorMessage?: string;
  captionMessage?: string;
  isLoading?: boolean;
  isClearable?: boolean;
  hasErrorIcon?: boolean;
  hasError?: boolean;
  hasSuccess?: boolean;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const BaseTextarea = forwardRef<
  HTMLTextAreaElement,
  BaseTextareaProps
>(
  (
    {
      classNameOuter,
      classNameField,
      id,
      value,
      label,
      onChange,
      contentLeft,
      contentRight,
      disabled = false,
      successMessage,
      errorMessage,
      captionMessage,
      isLoading,
      isClearable,
      hasError,
      hasSuccess,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const ownId = useId();
    const textareaId = id || ownId;

    const [isFocused, setIsFocused] = useState(false);
    const stringValue = value?.toString() ?? '';

    const isError = Boolean(errorMessage) || hasError;
    const isSuccess = Boolean(successMessage) || hasSuccess;

    const isShowClearButton =
      isClearable &&
      !isLoading &&
      !isError &&
      !contentRight &&
      !disabled &&
      stringValue.length >= 1;

    const captionText = isError
      ? errorMessage
      : isSuccess
      ? successMessage
      : captionMessage;

    const {
      cnRoot,
      cnLabel,
      cnOuter,
      cnField,
      cnContentLeft,
      cnContentRight,
      cnCaption,
    } = getBaseInputClasses({
      disabled,
      isError,
      isSuccess,
      focused: isFocused,
      classNameField,
      classNameOuter,
      contentLeft: !!contentLeft,
      contentRight: !!contentRight,
      isClearable,
      isLoading,
      isTextarea: true,
    });

    const handleClear = () => {
      onChange?.({
        target: { value: '' },
      } as ChangeEvent<HTMLTextAreaElement>);
    };

    return (
      <label className={cnRoot}>
        {label && <p className={cnLabel}>{label}</p>}

        <div className={cnOuter}>
          {contentLeft && <div className={cnContentLeft}>{contentLeft}</div>}

          <textarea
            {...props}
            ref={ref}
            id={textareaId}
            rows={rows}
            value={value}
            disabled={disabled || isLoading}
            className={cnField}
            onChange={onChange}
            onFocus={(e: FocusEvent<HTMLTextAreaElement>) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
          />

          {isShowClearButton && (
            <button
              type="button"
              className={cnContentRight}
              onClick={handleClear}
            >
              ×
            </button>
          )}
        </div>

        {captionText && <p className={cnCaption}>{captionText}</p>}
      </label>
    );
  },
);

BaseTextarea.displayName = 'BaseTextarea';
