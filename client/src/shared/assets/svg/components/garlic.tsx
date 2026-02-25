import { FC, SVGProps } from 'react';
const SvgGarlic: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48" {...props}>
    <g
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      clipPath="url(#clip0_1207_1961)"
    >
      <path d="M24 10s12 2.056 12 24.666A12.6 12.6 0 0 1 24 47a12.6 12.6 0 0 1-12-12.334C12 12.056 24 10 24 10" />
      <path d="m31.498 12.42-.032-.02a6.01 6.01 0 0 1-3.826-5L27 1h-6l-.64 6.4a6 6 0 0 1-3.826 5l-.032.012" />
      <path d="M24 47c17 0 23-4.058 23-14 0-9.188-8.8-20.186-20.16-21.8M21.16 11.2C9.8 12.814 1 23.812 1 33c0 9.942 6 14 23 14" />
    </g>
    <defs>
      <clipPath id="clip0_1207_1961">
        <path fill={color} d="M0 0h48v48H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgGarlic;
