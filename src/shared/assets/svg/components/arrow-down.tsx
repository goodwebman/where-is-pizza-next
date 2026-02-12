import { FC, SVGProps } from 'react';
const SvgArrowDown: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--text-primary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 12 12" {...props}>
    <g clipPath="url(#clip0_25081_3521)">
      <path
        fill="#191919"
        d="M12 3.263a.57.57 0 0 1-.16.397L6.386 9.285a.534.534 0 0 1-.772 0L.16 3.66a.575.575 0 0 1 0-.795.534.534 0 0 1 .771 0L6 8.092l5.069-5.227a.534.534 0 0 1 .771 0 .57.57 0 0 1 .16.398"
      />
    </g>
    <defs>
      <clipPath id="clip0_25081_3521">
        <path fill={color} d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgArrowDown;
