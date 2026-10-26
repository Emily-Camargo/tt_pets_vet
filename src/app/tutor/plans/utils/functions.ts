export function planArt(name: string) {
  if (name.includes('Básico')) return { emoji: '🐱', background: 'bg-amber-100' }
  if (name.includes('Saúde')) return { emoji: '🐶', background: 'bg-sky-100' }
  if (name.includes('Total')) return { emoji: '🐾', background: 'bg-[#efe4ff]' }
  if (name.includes('Premium')) return { emoji: '🐕', background: 'bg-lime-100' }
  return { emoji: '🐾', background: 'bg-slate-100' }
}
