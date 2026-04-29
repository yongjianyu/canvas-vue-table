import type { Column } from '../types'

export interface ExportCsvOptions {
  columns: Column[]
  items: unknown[]
  filename?: string
  separator?: string
  withBOM?: boolean
}

function escapeCsvField(value: string, sep: string): string {
  if (
    value.includes(sep) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r')
  ) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function getCellValue(item: unknown, field: string): string {
  if (item == null) return ''
  if (typeof item === 'object' && field in item) {
    const v = (item as Record<string, unknown>)[field]
    return v == null ? '' : String(v)
  }
  return ''
}

export function exportCsv(options: ExportCsvOptions) {
  const {
    columns,
    items,
    filename = 'export.csv',
    separator = ',',
    withBOM = true,
  } = options

  const header = columns
    .map((col) => escapeCsvField(col.title, separator))
    .join(separator)

  const rows = items.map((item) =>
    columns
      .map((col) =>
        escapeCsvField(getCellValue(item, col.field), separator)
      )
      .join(separator)
  )

  const csv = [header, ...rows].join('\r\n')
  const content = withBOM ? '﻿' + csv : csv
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
