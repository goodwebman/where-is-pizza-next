import { FC, SVGProps } from 'react';
const SvgCartBag: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  }
> = ({ color = 'var(--icon-secondary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
    <g fill={color} clipPath="url(#clip0_25104_7597)">
      <path d="M7.781 15.5h12.704a.7.7 0 0 0 .675-.508l2.813-9.8a.697.697 0 0 0-.676-.892H6.158l-.503-2.252A.7.7 0 0 0 4.97 1.5H.703a.701.701 0 1 0 0 1.4h3.701l2.54 11.375A2.1 2.1 0 0 0 5.672 16.2c0 1.158.946 2.1 2.11 2.1h12.703a.701.701 0 1 0 0-1.4H7.78a.7.7 0 0 1-.703-.7c0-.386.316-.7.703-.7" />
      <path d="M7.078 20.4c0 1.158.946 2.1 2.11 2.1s2.11-.942 2.11-2.1-.947-2.1-2.11-2.1c-1.164 0-2.11.942-2.11 2.1M16.969 20.4c0 1.158.946 2.1 2.11 2.1 1.162 0 2.109-.942 2.109-2.1s-.947-2.1-2.11-2.1-2.11.942-2.11 2.1" />
    </g>
    <defs>
      <clipPath id="clip0_25104_7597">
        <path fill={color} d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgCartBag;
