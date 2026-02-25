import { FC, SVGProps } from 'react';
const SvgSteak: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      stroke={color}
      strokeWidth={1.5}
      d="M17 16a5 5 0 0 0 4-8c-2.125-2.83-5-4-9-4S2 6.865 2 10.5A2.5 2.5 0 0 0 4.5 13H8c1.324-.033 4 .5 6.236 2.167A4.98 4.98 0 0 0 17 16Z"
    />
    <path
      stroke={color}
      strokeWidth={1.5}
      d="M2 10.5v.5c0 2.828 0 4.243.879 5.121C3.757 17 5.172 17 8 17c1.324-.032 4 .5 6.236 2.167A5 5 0 0 0 22 15v-4"
    />
    <path stroke={color} strokeWidth={1.5} d="M18.5 11a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
  </svg>
);
export default SvgSteak;
