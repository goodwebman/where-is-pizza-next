import { FC, SVGProps } from 'react';
const SvgEgg: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  }
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48" {...props}>
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M34 22c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10"
    />
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M28 22a4 4 0 0 0-4-4"
    />
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M24 3C12 3 3 13.81 3 27c0 9.823 6.366 18 14.219 18 2.89 0 5.577-1.078 7.82-2.93 2.544-2.1 5.874-3.036 8.92-3.036 6.098 0 11.041-6.183 11.041-13.81C45 14 37.5 3 24 3"
    />
  </svg>
);
export default SvgEgg;
