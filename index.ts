import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import tailwindTypography from '@tailwindcss/typography';
import tailwindForms from '@tailwindcss/forms';
import tailwindAspectRatio from '@tailwindcss/aspect-ratio';
import tailwindContainerQueries from '@tailwindcss/container-queries';
import fs from 'fs/promises';

interface TailwindConfig {
  [key: string]: any;
}

async function generateTailwindCSS(
  tailwindConfig: TailwindConfig = {},
  content: string
): Promise<string> {

  // Base CSS input with Tailwind directives
  const cssInput = `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `;

  let { base, ...config } = tailwindConfig;
  if (!base || base.trim().length < 10) base = cssInput;

  // Merge the plugins with the tailwindConfig
  const configWithPlugins = {
    ...config,
    plugins: [
      ...(tailwindConfig.plugins || []),
      tailwindTypography,
      tailwindForms,
      tailwindAspectRatio,
      tailwindContainerQueries,
    ],
    content: [{ raw: content, extension: 'html' }],
  };

  // Process the CSS using PostCSS and Tailwind CSS
  const result = await postcss([
    tailwindcss(configWithPlugins),
  ]).process(base, { from: undefined });

  return result.css;
}

async function main() {
    try {
      const content = await fs.readFile('test.html', 'utf-8');
      const css = await generateTailwindCSS({}, content);
      console.log(css);
    } catch (error) {
      console.error('Error reading file or generating CSS:', error);
    }
  }
  
  main();