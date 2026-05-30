import { codeToHtml } from 'shiki'

const langByFile = {
  config: 'typescript',
  app: 'vue',
} as const

export type HeroCodeFile = keyof typeof langByFile

export async function highlightHeroCode(
  code: string,
  file: HeroCodeFile,
  colorMode: string,
): Promise<string> {
  const theme = colorMode === 'dark' ? 'github-dark' : 'github-light'

  return codeToHtml(code, {
    lang: langByFile[file],
    theme,
  })
}
