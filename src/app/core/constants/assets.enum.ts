/**
 * Enum com os caminhos dos assets do projeto
 * Centraliza todas as referências a imagens, ícones e outros recursos estáticos
 */
export enum Assets {
  // Logos
  LOGO_EMPRESA = 'assets/logo-empresa.png',

  // Ícones (caso precise adicionar ícones customizados)
  // ICON_EXAMPLE = 'assets/icons/example.svg',

  // Imagens gerais
  // IMAGE_EXAMPLE = 'assets/images/example.jpg',

  // Outros recursos
  // FAVICON = 'assets/favicon.ico',
}

/**
 * Helper function para obter o caminho completo de um asset
 * Útil quando precisar construir caminhos dinâmicos
 */
export function getAssetPath(asset: Assets): string {
  return asset;
}

/**
 * Helper function para verificar se um asset existe
 * Útil para validação antes de usar
 */
export function assetExists(_asset: Assets): boolean {
  // Em produção, isso poderia fazer uma verificação real
  // Por enquanto, apenas retorna true assumindo que o asset existe
  return true;
}

