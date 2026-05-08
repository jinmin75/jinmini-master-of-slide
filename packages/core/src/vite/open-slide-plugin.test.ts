import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { normalizePath } from 'vite';
import { generateSlidesModule } from './open-slide-plugin.ts';

describe('generateSlidesModule', () => {
  it('includes known slide ids in not-found errors', async () => {
    const slidesRoot = path.resolve('/workspace/slides');
    const mod = generateSlidesModule(
      [path.join(slidesRoot, 'existing-slide', 'index.tsx')],
      slidesRoot,
      false,
    );

    expect(mod).toContain('export const slideIds = ["existing-slide"]');
    expect(mod).toContain('Known slides: ');
    expect(mod).toContain(`Expected file: ${normalizePath(slidesRoot)}/`);
    expect(mod).toContain('restart open-slide dev');
  });

  it('generates Vite /@fs imports for Windows absolute paths in dev', () => {
    const slidesRoot = 'C:\\Users\\pente\\slides';
    const mod = generateSlidesModule(
      ['C:\\Users\\pente\\slides\\demo-slide\\index.tsx'],
      slidesRoot,
      true,
    );

    expect(mod).toContain('case "demo-slide": return import("/@fs/C:/Users/pente/slides/demo-slide/index.tsx");');
  });
});
