import { FC, SVGProps } from 'react';
const SvgBackDropXMark: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
    <g clipPath="url(#clip0_230_22549)">
      <path
        fill="#A5A5A5"
        fillRule="evenodd"
        d="M1.332.229A.78.78 0 0 0 .23 1.332L10.896 12 .23 22.668a.78.78 0 1 0 1.103 1.103L12 13.104 22.668 23.77a.78.78 0 1 0 1.103-1.103L13.104 12 23.77 1.332A.78.78 0 1 0 22.668.23L12 10.896z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0_230_22549">
        <path fill={color} d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgBackDropXMark;
