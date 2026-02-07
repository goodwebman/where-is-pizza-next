import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.resolve(
  __dirname,
  '../assets/svg/components',
);

const INDEX_FILE = path.join(COMPONENTS_DIR, 'index.ts');

// 1️⃣ Читаем ТОЛЬКО реальные svg-компоненты
const files = fs
  .readdirSync(COMPONENTS_DIR)
  .filter((file) => {
    if (!file.endsWith('.tsx')) return false;
    if (file === 'index.tsx' || file === 'index.ts') return false;
    return true;
  });

// 2️⃣ Генерируем импорты и объект Icons
const imports = [];
const icons = [];

for (const file of files) {
  const fileName = file.replace('.tsx', '');

  const componentName = fileName
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

  imports.push(`import ${componentName} from './${fileName}';`);
  icons.push(`  ${componentName},`);
}

// 3️⃣ Финальный index.ts
const content = `
// ⚠️ AUTO-GENERATED FILE — DO NOT EDIT

${imports.join('\n')}

export const Icons = {
${icons.join('\n')}
};

export type IconName = keyof typeof Icons;
`;

fs.writeFileSync(INDEX_FILE, content.trim() + '\n');

console.log(`✅ Icons index.ts generated (${icons.length} icons)`);
