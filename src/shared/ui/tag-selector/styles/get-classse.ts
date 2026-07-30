import classNames from 'classnames/bind';
import classes from './tag-selector.module.scss';

const cn = classNames.bind(classes);

type ButtonArgs = {
  selected?: boolean;
  className?: string;
};

export const getTagContainerClasses = (className?: string) => ({
  cnContainer: cn('tagContainer', className),
});

export const getTagButtonClasses = ({ selected, className }: ButtonArgs) => ({
  cnButton: cn('tagButton', { selected }, className),
});
