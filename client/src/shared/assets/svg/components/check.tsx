import { FC, SVGProps } from 'react';
const SvgCheck: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  }
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 11 8" {...props}>
    <path
      fill={color}
      d="M10.872.124a.423.423 0 0 0-.598 0L3.418 6.979.722 4.283a.423.423 0 1 0-.598.598l2.995 2.995a.423.423 0 0 0 .598 0L10.872.722a.423.423 0 0 0 0-.598"
    />
  </svg>
);
export default SvgCheck;
