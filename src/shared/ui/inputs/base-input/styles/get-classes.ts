import classNames from 'classnames/bind';
import classes from './base-input.module.scss';

const cn = classNames.bind(classes);

type GetFieldClassesArgs = {
  size?: 'small' | 'large';
  disabled?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  focused?: boolean;
  classNameField?: string;
  classNameOuter?: string;
  contentLeft?: boolean;
  contentRight?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  isTextarea?: boolean;
};

export const getBaseInputClasses = ({
  size = 'large',
  disabled,
  isError,
  isSuccess,
  focused,
  classNameField,
  classNameOuter,
  contentLeft,
  contentRight,
  isClearable,
  isLoading,
  isTextarea
}: GetFieldClassesArgs) => {
  const cnRoot = cn('root');
  const cnLabel = cn('label');
  const cnOuter = cn('outer', classNameOuter, {
    disabled,
    focused,
    error: isError,
    success: isSuccess,
  });
  const cnField = cn('field', classNameField, size, {
    textarea: isTextarea,
  },);
  const cnContentLeft = cn('contentLeft', { hasContent: !!contentLeft });
  const cnContentRight = cn('contentRight', {
    hasContent: !!contentRight,
    clearable: isClearable,
    loading: isLoading,
  });
  const cnCaption = cn('caption', {
    error: isError,
    success: isSuccess,
  });

  return {
    cnRoot,
    cnLabel,
    cnOuter,
    cnField,
    cnContentLeft,
    cnContentRight,
    cnCaption,
  };
};
