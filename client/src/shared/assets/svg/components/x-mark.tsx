import { FC, SVGProps } from 'react';
const SvgXMark: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 10 12" {...props}>
    <path
      fill="#A5A5A5"
      d="M0 11.273h1.594l3.008-4.445h.125l2.953 4.445h1.687l-3.82-5.609L9.453 0H7.852L4.836 4.484H4.71L1.742 0H.047l3.812 5.602z"
    />
  </svg>
);
export default SvgXMark;
