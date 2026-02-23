import { FC, SVGProps } from 'react';
const SvgFilter: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--text-primary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="#FF7010"
      d="M6.333 16A.334.334 0 0 1 6 15.667V8.932a1 1 0 0 0-.336-.747L.559 3.649A1.67 1.67 0 0 1 0 2.4V1c0-.551.449-1 1-1h14c.551 0 1 .449 1 1v1.4c0 .48-.204.935-.56 1.25l-5.104 4.535a1 1 0 0 0-.336.747v4.357c0 .348-.185.677-.485.857l-3.011 1.806a.33.33 0 0 1-.17.048M1 .667A.334.334 0 0 0 .667 1v1.4A1 1 0 0 0 1 3.15l5.106 4.536c.355.316.56.77.56 1.246v6.146l2.505-1.503c.1-.06.161-.17.161-.286V8.933c0-.476.205-.931.56-1.246L15 3.15c.212-.188.334-.462.334-.751V1A.334.334 0 0 0 15 .667z"
    />
  </svg>
);
export default SvgFilter;
