const SERVICE_ICONS: Record<string, string> = {
  erp: '▦',
  code: '</>',
  strategy: '◇',
  cloud: '☁',
  products: '◫',
  chart: '▲',
  support: '◎',
  shield: '■',
};

export function iconGlyph(name: string | null | undefined): string {
  return (name && SERVICE_ICONS[name]) || '◇';
}