import type { FilterOptions } from "./types"

export interface Opportunity {
  id: string
  title: string
  organization: string
  description: string
  location: string
  date: string
  commitmentLevel: string
  cause: string
  imageUrl?: string
}

export function filterOpportunities(
  opportunities: Opportunity[],
  filters: FilterOptions,
  bookmarks: string[],
): Opportunity[] {
  return opportunities.filter((opportunity) => {
    // Filter by bookmarks if showBookmarksOnly is true
    if (filters.showBookmarksOnly && !bookmarks.includes(opportunity.id)) {
      return false
    }

    // Filter by causes
    if (filters.causes.length > 0 && !filters.causes.includes(opportunity.cause)) {
      return false
    }

    // Filter by commitment level
    if (filters.commitmentLevels.length > 0 && !filters.commitmentLevels.includes(opportunity.commitmentLevel)) {
      return false
    }

    // Filter by date range
    if (filters.dateRange.start || filters.dateRange.end) {
      const opportunityDate = new Date(opportunity.date)

      if (filters.dateRange.start && opportunityDate < filters.dateRange.start) {
        return false
      }

      if (filters.dateRange.end) {
        // Add one day to include the end date in the range
        const endDatePlusOne = new Date(filters.dateRange.end)
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1)

        if (opportunityDate >= endDatePlusOne) {
          return false
        }
      }
    }

    return true
  })
}

