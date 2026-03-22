import { FC, SVGProps } from 'react';
const SvgModalXMark: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  }
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 32 32" {...props}>
    <g clipPath="url(#clip0_236_29161)">
      <path
        fill={color}
        fillRule="evenodd"
        d="M1.776.305A1.04 1.04 0 1 0 .305 1.776L14.529 16 .305 30.224a1.04 1.04 0 0 0 1.471 1.471L16 17.471l14.224 14.224a1.04 1.04 0 0 0 1.471-1.471L17.471 16 31.695 1.776A1.04 1.04 0 0 0 30.224.305L16 14.529z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0_236_29161">
        <path fill={color} d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgModalXMark;
