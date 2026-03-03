import classNames from 'classnames/bind';
import classes from './order-comment.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnComment = cn('comment', className);
  const cnCommentLabel = cn('comment--label');

  return {
    cnComment,
    cnCommentLabel,
  };
};
