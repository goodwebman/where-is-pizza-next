const customTemplate = ({ componentName, jsx }, { tpl }) => {
  return tpl`
    import { FC, SVGProps } from 'react';

    const ${componentName}: FC<SVGProps<SVGSVGElement> & { color?: string }> = ({
      color = 'var(--icon-secondary)',
      ...props
    }) => ${jsx};

    export default ${componentName};
  `;
};

module.exports = customTemplate;
