import { FC, SVGProps } from 'react';
const SvgPepperoni: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 42 42" {...props}>
    <path
      fill="#FF7010"
      stroke={color}
      strokeWidth={2}
      d="M21 1C9.972 1 1 9.972 1 21s8.972 20 20 20 20-8.972 20-20S32.028 1 21 1Zm0 36.364c-9.023 0-16.364-7.341-16.364-16.364S11.977 4.636 21 4.636 37.364 11.977 37.364 21 30.023 37.364 21 37.364Z"
    />
    <path
      fill="#FF7010"
      stroke={color}
      d="M17.572 26.755a1.819 1.819 0 0 0-3.033 2.006l.502.758a1.818 1.818 0 0 0 3.033-2.006zM14.81 16.096l.449-.79a1.818 1.818 0 0 0-3.162-1.797l-.449.79a1.818 1.818 0 1 0 3.161 1.797ZM27.307 28.217l-.902-.119a1.817 1.817 0 1 0-.474 3.605l.901.12a1.817 1.817 0 1 0 .474-3.606ZM29.525 14.084a1.817 1.817 0 1 0-3.507.96l.24.877a1.818 1.818 0 0 0 3.507-.96zM22.301 18.288a1.818 1.818 0 1 0-2.622 2.518l.63.656a1.818 1.818 0 1 0 2.622-2.518z"
    />
  </svg>
);
export default SvgPepperoni;
