import { FC, SVGProps } from 'react';
const SvgInfo: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  }
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="#A5A5A5"
      d="M12.033 10c-.414 0-.75.371-.75.83v5.34c0 .459.336.83.75.83s.75-.371.75-.83v-5.34c0-.459-.336-.83-.75-.83M12 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
    />
    <circle cx={12} cy={12} r={11.25} stroke="#A5A5A5" strokeWidth={1.5} />
  </svg>
);
export default SvgInfo;
