import TurndownService from 'turndown'

const turndown = new TurndownService()

export const processContent = (rawText: string): string => {
  return turndown.turndown(rawText)
}

export const processEnum = (data: unknown, fallback: string[]): string[] => {
  const raw = Array.isArray(data) ? data[0] : data
  if (typeof raw === 'string' && raw !== '') {
    return raw.replace(/{|}/g, '').split(',')
  }
  return fallback
}

export const buildPostgisPoint = (lat: number | null, long: number | null): string => {
  return `POINT(${long} ${lat})`
}