import { FC, SVGProps } from 'react';
const SvgFacebook: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--text-primary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 20 20" {...props}>
    <path
      fill="#FF7010"
      fillRule="evenodd"
      d="M0 10.056C0 15.028 3.611 19.162 8.333 20l.056-.045-.056-.01v-7.096h-2.5v-2.793h2.5V7.821c0-2.514 1.611-3.91 3.89-3.91.721 0 1.5.111 2.221.223v2.57h-1.277c-1.223 0-1.5.615-1.5 1.397v1.955h2.666l-.444 2.793h-2.222v7.095l-.056.011.056.045C16.389 19.162 20 15.028 20 10.056 20 4.526 15.5 0 10 0S0 4.525 0 10.056"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgFacebook;
