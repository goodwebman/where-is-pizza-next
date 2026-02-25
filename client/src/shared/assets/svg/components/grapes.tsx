import { FC, SVGProps } from 'react';
const SvgGrapes: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
    <path stroke={color} strokeWidth={1.5} d="M14.83 18a3 3 0 1 1-5.659 0" />
    <path stroke={color} strokeWidth={1.5} d="M11.236 13a3 3 0 1 1-4.472 0" />
    <path stroke={color} strokeWidth={1.5} d="M17.236 13a3 3 0 1 1-4.472 0" />
    <path
      stroke={color}
      strokeWidth={1.5}
      d="M15 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM9 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM3 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"
    />
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 7c0-1.667.8-5 4-5"
    />
  </svg>
);
export default SvgGrapes;
