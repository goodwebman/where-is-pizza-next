import { FC, SVGProps } from 'react';
const SvgCherry: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
    <path stroke={color} strokeWidth={1.5} d="M22 16.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z" />
    <path
      stroke={color}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M10.5 11c-.878-.63-1.948-1-3.104-1C4.416 10 2 12.462 2 15.5S4.416 21 7.396 21c.693 0 1.355-.133 1.963-.375"
    />
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 13c-1.837-1.896-4.27-5.863-2.205-9M16 2c-1.015.599-1.73 1.278-2.205 2m0 0c-2.394.5-7.704 2.5-6.66 8"
    />
  </svg>
);
export default SvgCherry;
