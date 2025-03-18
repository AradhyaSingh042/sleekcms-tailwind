import { compile } from "@tailwindcss/node"; 
import { Scanner } from '@tailwindcss/oxide'
import fs from "fs/promises";

async function generateTailwindCSS(content: string): Promise<string> {
  const baseCSS = `
    @import "tailwindcss";
    @plugin "@tailwindcss/typography";
    @plugin "@tailwindcss/forms";
    @plugin "@tailwindcss/aspect-ratio";
    @plugin "@tailwindcss/container-queries";
    
    @theme {
      --color-avocado-100: oklch(0.99 0 0);
      --color-avocado-200: oklch(0.98 0.04 113.22);
      --color-avocado-300: oklch(0.94 0.11 115.03);
    }
  `;

  try {
    const compiler = await compile(baseCSS, {
      base: process.cwd(),      
      onDependency: (path) => {},
    });

    // Initialize scanner with raw content
    const scanner = new Scanner({});
    const candidates = scanner.scanFiles([{
      content: content,
      extension: "html",
    }]);

    // Generate CSS
    const compiledCSS = compiler.build(candidates);
    return compiledCSS;
  } catch (error) {
    console.error("Compilation failed:", error);
    throw error;
  }
}

async function main() {
  try {
    const content = await fs.readFile("test.html", "utf-8");
    const css = await generateTailwindCSS(content);
    console.log(css);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();