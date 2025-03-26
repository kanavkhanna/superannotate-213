"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { BookmarkCheck, AlertCircle, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, isBefore, startOfToday } from "date-fns"
import type { FilterOptions } from "@/lib/types"
import { causes, commitmentLevels } from "@/lib/mock-data"
import { toast } from "sonner"

interface FilterSidebarProps {
  filterOptions: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  bookmarksCount: number
}

export default function FilterSidebar({ filterOptions, onFilterChange, bookmarksCount }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filterOptions)
  const [hasError, setHasError] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const today = startOfToday()

  useEffect(() => {
    setLocalFilters(filterOptions)
  }, [filterOptions])

  const handleCauseChange = (cause: string, checked: boolean) => {
    try {
      const updatedCauses = checked ? [...localFilters.causes, cause] : localFilters.causes.filter((c) => c !== cause)

      const updatedFilters = {
        ...localFilters,
        causes: updatedCauses,
      }

      setLocalFilters(updatedFilters)
      onFilterChange(updatedFilters)
    } catch (error) {
      console.error("Error updating cause filters:", error)
      setHasError(true)
      toast.error("Error updating filters", {
        description: "There was a problem updating your cause filters",
      })
    }
  }

  const handleCommitmentChange = (level: string, checked: boolean) => {
    try {
      const updatedLevels = checked
        ? [...localFilters.commitmentLevels, level]
        : localFilters.commitmentLevels.filter((l) => l !== level)

      const updatedFilters = {
        ...localFilters,
        commitmentLevels: updatedLevels,
      }

      setLocalFilters(updatedFilters)
      onFilterChange(updatedFilters)
    } catch (error) {
      console.error("Error updating commitment filters:", error)
      setHasError(true)
      toast.error("Error updating filters", {
        description: "There was a problem updating your commitment level filters",
      })
    }
  }

  const handleDateChange = (date: Date | null, type: "start" | "end") => {
    try {
      const updatedFilters = {
        ...localFilters,
        dateRange: {
          ...localFilters.dateRange,
          [type]: date,
        },
      }

      setLocalFilters(updatedFilters)
      onFilterChange(updatedFilters)
      setIsCalendarOpen(false)
    } catch (error) {
      console.error("Error updating date filters:", error)
      setHasError(true)
      toast.error("Error updating filters", {
        description: "There was a problem updating your date filters",
      })
    }
  }

  const handleBookmarksOnlyChange = (checked: boolean) => {
    try {
      const updatedFilters = {
        ...localFilters,
        showBookmarksOnly: checked,
      }

      setLocalFilters(updatedFilters)
      onFilterChange(updatedFilters)
    } catch (error) {
      console.error("Error updating bookmark filter:", error)
      setHasError(true)
      toast.error("Error updating filters", {
        description: "There was a problem updating your bookmark filter",
      })
    }
  }

  const clearFilters = () => {
    try {
      const resetFilters = {
        causes: [],
        commitmentLevels: [],
        dateRange: { start: null, end: null },
        showBookmarksOnly: false,
      }

      setLocalFilters(resetFilters)
      onFilterChange(resetFilters)
      toast.success("Filters cleared", {
        description: "All filters have been reset",
      })
    } catch (error) {
      console.error("Error clearing filters:", error)
      setHasError(true)
      toast.error("Error clearing filters", {
        description: "There was a problem clearing your filters",
      })
    }
  }

  const hasActiveFilters =
    localFilters.causes.length > 0 ||
    localFilters.commitmentLevels.length > 0 ||
    localFilters.dateRange.start !== null ||
    localFilters.dateRange.end !== null ||
    localFilters.showBookmarksOnly

  return (
    <div className="space-y-6" role="group" aria-label="Filter options">
      {hasError && (
        <div className="bg-destructive/10 p-3 rounded-lg flex items-start gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Filter Error</p>
            <p className="text-sm text-destructive/80">There was a problem with your filters. Please try again.</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-primary" id="cause-filter-heading">
            Cause
          </h4>
        </div>
        <div className="space-y-2" role="group" aria-labelledby="cause-filter-heading">
          {causes.map((cause) => (
            <div key={cause} className="flex items-center space-x-2">
              <Checkbox
                id={`cause-${cause}`}
                checked={localFilters.causes.includes(cause)}
                onCheckedChange={(checked) => handleCauseChange(cause, checked === true)}
                aria-label={`Filter by ${cause} cause`}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label
                htmlFor={`cause-${cause}`}
                className={cn(
                  "text-sm transition-colors",
                  localFilters.causes.includes(cause) ? "text-foreground font-medium" : "text-muted-foreground",
                )}
              >
                {cause}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary" id="commitment-filter-heading">
          Commitment Level
        </h4>
        <div className="space-y-2" role="group" aria-labelledby="commitment-filter-heading">
          {commitmentLevels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`level-${level}`}
                checked={localFilters.commitmentLevels.includes(level)}
                onCheckedChange={(checked) => handleCommitmentChange(level, checked === true)}
                aria-label={`Filter by ${level} commitment level`}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label
                htmlFor={`level-${level}`}
                className={cn(
                  "text-sm transition-colors",
                  localFilters.commitmentLevels.includes(level)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border/50" />

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary" id="date-filter-heading">
          Date Availability
        </h4>
        <div className="grid gap-2" role="group" aria-labelledby="date-filter-heading">
          <div className="grid grid-cols-1 gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-full",
                    !localFilters.dateRange.start && "text-muted-foreground",
                  )}
                  aria-label="Select start date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">
                    {localFilters.dateRange.start ? format(localFilters.dateRange.start, "MMM d, yyyy") : "Start date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localFilters.dateRange.start || undefined}
                  onSelect={(date) => handleDateChange(date, "start")}
                  initialFocus
                  disabled={(date) => isBefore(date, today)}
                  aria-label="Start date calendar"
                  className="rounded-md border-border/60"
                />
              </PopoverContent>
            </Popover>

            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-full",
                    !localFilters.dateRange.end && "text-muted-foreground",
                  )}
                  aria-label="Select end date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">
                    {localFilters.dateRange.end ? format(localFilters.dateRange.end, "MMM d, yyyy") : "End date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localFilters.dateRange.end || undefined}
                  onSelect={(date) => handleDateChange(date, "end")}
                  initialFocus
                  disabled={(date) =>
                    isBefore(date, today) ||
                    (localFilters.dateRange.start ? isBefore(date, localFilters.dateRange.start) : false)
                  }
                  aria-label="End date calendar"
                  className="rounded-md border-border/60"
                />
              </PopoverContent>
            </Popover>
          </div>

          {(localFilters.dateRange.start || localFilters.dateRange.end) && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-8 text-xs text-muted-foreground"
              onClick={() => {
                handleDateChange(null, "start")
                handleDateChange(null, "end")
              }}
            >
              Clear dates
            </Button>
          )}
        </div>
      </div>

      <Separator className="bg-border/50" />

      <div className="space-y-4">
        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
          <Checkbox
            id="bookmarks-only"
            checked={localFilters.showBookmarksOnly}
            onCheckedChange={(checked) => handleBookmarksOnlyChange(checked === true)}
            disabled={bookmarksCount === 0}
            aria-label="Show only bookmarked opportunities"
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <Label
            htmlFor="bookmarks-only"
            className={cn(
              "text-sm flex items-center gap-1 cursor-pointer",
              localFilters.showBookmarksOnly ? "text-foreground font-medium" : "text-muted-foreground",
            )}
          >
            <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
            Bookmarked only ({bookmarksCount})
          </Label>
        </div>
      </div>

      <Separator className="bg-border/50" />

      <Button
        variant="outline"
        size="sm"
        className="w-full rounded-full"
        onClick={clearFilters}
        disabled={!hasActiveFilters}
        aria-label="Clear all filters"
        aria-disabled={!hasActiveFilters}
      >
        Clear all filters
      </Button>
    </div>
  )
}

