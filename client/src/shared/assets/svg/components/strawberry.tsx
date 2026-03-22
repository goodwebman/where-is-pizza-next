import { FC, SVGProps } from 'react';
const SvgStrawberry: FC<
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
      d="M6 23.595C6 14.997 10.235 9 24 9s18 5.997 18 14.595C42 33 32 45 24 45S6 33 6 23.595"
    />
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M11.137 12.037c-1.443-2.125-2.451-4.594-3.033-6.25a1.73 1.73 0 0 1 1.337-2.305c2.781-.506 7.941-1.065 11.23.892 1.483.883 2.578 1.865 3.33 2.893.75-1.028 1.846-2.01 3.328-2.893 3.289-1.957 8.449-1.398 11.23-.892 1.08.196 1.7 1.27 1.337 2.306-.581 1.655-1.59 4.124-3.033 6.25M19 18v-2M20 36v-2M14 27v-2M29 18v-2M28 36v-2M34 27v-2M24 27v-2"
    />
  </svg>
);
export default SvgStrawberry;
