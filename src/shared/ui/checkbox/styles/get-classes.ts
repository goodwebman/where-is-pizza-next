import classNames from 'classnames/bind';
import classes from './checkbox.module.scss';

const cn = classNames.bind(classes);

type ButtonArgs = {
  checked?: boolean;
  className?: string;
};

export const getCheckboxContainerClasses = (className?: string) => ({
  cnContainer: cn('container', className),
});

export const getCheckboxButtonClasses = ({
  checked,
  className,
}: ButtonArgs) => {
  const cnButton = cn('button', className);
  const cnBox = cn('box', { checked });
  const cnLabel = cn('label');
  const cnCheckIcon = cn('check-icon')

  return {
    cnButton,
    cnBox,
    cnLabel,
    cnCheckIcon
  };
};
