import { describe, it, expect } from 'vitest'
import { zh } from '../src/i18n/zh'
import { en } from '../src/i18n/en'
import { ja } from '../src/i18n/ja'

function keys(o: unknown, prefix = ''): string[] {
  if (typeof o !== 'object' || o === null) return [prefix]
  return Object.entries(o).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
}
describe('i18n dictionaries', () => {
  it('en and ja have exactly the same keys as zh', () => {
    const base = keys(zh).sort()
    expect(keys(en).sort()).toEqual(base)
    expect(keys(ja).sort()).toEqual(base)
  })
  it('no empty strings', () => {
    for (const d of [zh, en, ja]) for (const k of keys(d)) { const v = k.split('.').reduce<unknown>((o, p) => (o as Record<string, unknown>)[p], d); expect(v, k).not.toBe('') }
  })
})
