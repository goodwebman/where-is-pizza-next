import { FC, SVGProps } from 'react';
const SvgRightArrow: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 8 15" {...props}>
    <path
      fill={color}
      d="M.657 14.546a.65.65 0 0 0 .464-.194L7.686 7.74a.664.664 0 0 0 0-.935L1.121.194a.653.653 0 0 0-.928 0 .664.664 0 0 0 0 .935l6.1 6.144-6.1 6.144a.664.664 0 0 0 0 .935c.128.129.296.194.464.194"
    />
  </svg>
);
export default SvgRightArrow;
