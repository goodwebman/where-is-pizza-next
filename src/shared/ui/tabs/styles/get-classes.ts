import classNames from 'classnames/bind';
import classes from './tabs.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  active?: boolean;
  disabled?: boolean;
};

export const getClasses = ({ className }: Args) => {
  const cnRoot = cn('tabs', className);

  const cnTab = (args?: { active?: boolean; disabled?: boolean }) =>
    cn('tab', {
      active: args?.active,
      disabled: args?.disabled,
    });

    

  return {
    cnRoot,
    cnTab,
  };
};
