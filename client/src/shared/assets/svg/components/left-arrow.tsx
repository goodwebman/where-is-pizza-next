import { FC, SVGProps } from 'react';
const SvgLeftArrow: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  }
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 10 18" {...props}>
    <path
      fill={color}
      d="M8.667 17.455a.78.78 0 0 1-.557-.233L.23 9.288a.797.797 0 0 1 0-1.122L8.11.233a.783.783 0 0 1 1.114 0 .797.797 0 0 1 0 1.121L1.902 8.727 9.224 16.1a.797.797 0 0 1 0 1.122.78.78 0 0 1-.557.232"
    />
  </svg>
);
export default SvgLeftArrow;
