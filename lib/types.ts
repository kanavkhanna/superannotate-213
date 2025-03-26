export interface FilterOptions {
  causes: string[]
  commitmentLevels: string[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
  showBookmarksOnly: boolean
}

