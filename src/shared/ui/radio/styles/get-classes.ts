import classNames from 'classnames/bind';
import classes from './radio.module.scss';

const cn = classNames.bind(classes);

type ButtonArgs = {
  checked?: boolean;
  className?: string;
};

export const getRadioContainerClasses = (className?: string) => ({
  cnContainer: cn('container', className),
});

export const getRadioButtonClasses = ({
  checked,
  className,
}: ButtonArgs) => {
  const cnButton = cn('button', className);
  const cnCircle = cn('circle', { checked });
  const cnLabel = cn('label');

  return {
    cnButton,
    cnCircle,
    cnLabel,
  };
};
