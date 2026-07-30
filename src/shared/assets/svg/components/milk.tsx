import { FC, SVGProps } from 'react';
const SvgMilk: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  }
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48" {...props}>
    <path
      stroke={color}
      strokeWidth={3}
      d="M7.125 44.625h33.75v-26.25l-7.5-7.5h-18.75l-7.5 7.5zM14.625 3.375v7.5h18.75v-7.5zM7.125 20.25h33.75"
    />
  </svg>
);
export default SvgMilk;
