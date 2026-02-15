import { FC, SVGProps } from 'react';
const SvgAccount: FC<
  SVGProps<SVGSVGElement> & {
    color?: string,
  },
> = ({ color = 'var(--text-primary)', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="#FF7010"
      fillRule="evenodd"
      d="M12 0C8.83 0 6.25 2.58 6.25 5.75S8.83 11.5 12 11.5s5.75-2.58 5.75-5.75S15.17 0 12 0M7.53 5.75A4.474 4.474 0 0 1 12 1.28a4.474 4.474 0 0 1 4.47 4.47A4.474 4.474 0 0 1 12 10.22a4.474 4.474 0 0 1-4.47-4.47M7.157 14C4.314 14 2 16.375 2 19.292v4.094c0 .339.268.614.598.614h18.804c.33 0 .598-.275.598-.614v-4.094C22 16.375 19.686 14 16.843 14zm-3.96 5.292c0-2.24 1.776-4.064 3.96-4.064h9.686c2.184 0 3.96 1.823 3.96 4.064v3.48H3.197z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgAccount;
