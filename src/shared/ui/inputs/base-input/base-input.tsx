import {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  ReactNode,
  useId,
  useState,
} from 'react';

import { Icons } from '@/src/shared/assets/svg/components';
import { getBaseInputClasses } from './styles/get-classes';

export type BaseInputProps = {
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
} & React.InputHTMLAttributes<HTMLInputElement>;

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      size = 'large',
      classNameOuter,
      classNameField,
      id,
      value,
      label,
      onChange,
      contentLeft,
      contentRight,
      type = 'text',
      disabled = false,
      successMessage,
      errorMessage,
      captionMessage,
      isLoading,
      isClearable,
      hasErrorIcon = true,
      hasError,
      hasSuccess,
      ...props
    },
    ref,
  ) => {
    const ownId = useId();
    const inputId = id || ownId;

    const [isFocused, setIsFocused] = useState(false);
    const stringValue = value !== undefined ? value.toString() : '';

    const isError = Boolean(errorMessage) || hasError;
    const isSuccess = Boolean(successMessage) || hasSuccess;
    const isShowClearButton =
      isClearable &&
      !isLoading &&
      !isError &&
      !contentRight &&
      !disabled &&
      stringValue.length >= 1;

    const isShowContentRight =
      ((!isError && !isLoading) || isFocused) && contentRight;

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
    });

    const handleClear = () => {
      onChange?.({
        target: { value: '' },
      } as ChangeEvent<HTMLInputElement>);
    };

    return (
      <label className={cnRoot}>
        {label && <p className={cnLabel}>{label}</p>}

        <div className={cnOuter}>
          {contentLeft && <div className={cnContentLeft}>{contentLeft}</div>}

          <input
            {...props}
            className={cnField}
            type={type}
            disabled={disabled || isLoading}
            value={value}
            id={inputId}
            onChange={onChange}
            ref={ref}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onFocus={(e: FocusEvent<HTMLInputElement>) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
          />

          {isLoading && (
            <div className={cnContentRight}>
              <Icons.Spinner />
            </div>
          )}

          {isShowContentRight && (
            <div className={cnContentRight}>{contentRight}</div>
          )}

          {isShowClearButton && (
            <button
              type="button"
              className={cnContentRight}
              onClick={handleClear}
            >
                <Icons.XMark width={20} height={10}/>
            </button>
          )}
        </div>

        {captionText && <p className={cnCaption}>{captionText}</p>}
      </label>
    );
  },
);

BaseInput.displayName = 'BaseInput';
