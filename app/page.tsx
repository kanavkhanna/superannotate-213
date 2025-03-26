"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Filter, BookmarkCheck, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import FilterSidebar from "@/components/filter-sidebar"
import OpportunityCard from "@/components/opportunity-card"
import ThemeToggle from "@/components/theme-toggle"
import { type Opportunity, filterOpportunities } from "@/lib/opportunities"
import type { FilterOptions } from "@/lib/types"
import { toast } from "sonner"

export default function VolunteerOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    causes: [],
    commitmentLevels: [],
    dateRange: { start: null, end: null },
    showBookmarksOnly: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    // Simulate loading data from an API
    const loadData = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        // Simulate a potential network error (1 in 10 chance)
        if (Math.random() < 0.1) {
          throw new Error("Network error occurred while fetching opportunities")
        }

        // In a real app, this would be an API call
        const data = await import("@/lib/mock-data").then((module) => module.opportunities)
        setOpportunities(data)
        setFilteredOpportunities(data)
      } catch (error) {
        console.error("Failed to load opportunities:", error)
        setHasError(true)
        toast.error("Failed to load opportunities", {
          description: error instanceof Error ? error.message : "Please try again later",
          action: {
            label: "Retry",
            onClick: () => loadData(),
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Load bookmarks from localStorage
    try {
      const savedBookmarks = localStorage.getItem("bookmarkedOpportunities")
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks))
      }
    } catch (error) {
      console.error("Failed to load bookmarks:", error)
      toast.error("Failed to load your bookmarks", {
        description: "Your saved bookmarks could not be retrieved",
      })
    }

    loadData()
  }, [])

  useEffect(() => {
    // Apply filters whenever filter options, search query, or bookmarks change
    try {
      let filtered = filterOpportunities(opportunities, filterOptions, bookmarks)

      // Apply search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        filtered = filtered.filter(
          (opp) =>
            opp.title.toLowerCase().includes(query) ||
            opp.organization.toLowerCase().includes(query) ||
            opp.description.toLowerCase().includes(query) ||
            opp.location.toLowerCase().includes(query) ||
            opp.cause.toLowerCase().includes(query),
        )
      }

      setFilteredOpportunities(filtered)
    } catch (error) {
      console.error("Error applying filters:", error)
      toast.error("Error applying filters", {
        description: "There was a problem filtering the opportunities",
      })
    }
  }, [opportunities, filterOptions, bookmarks, searchQuery])

  const toggleBookmark = (id: string) => {
    try {
      const updatedBookmarks = bookmarks.includes(id)
        ? bookmarks.filter((bookmarkId) => bookmarkId !== id)
        : [...bookmarks, id]

      setBookmarks(updatedBookmarks)
      localStorage.setItem("bookmarkedOpportunities", JSON.stringify(updatedBookmarks))

      const opportunity = opportunities.find((opp) => opp.id === id)
      if (opportunity) {
        if (bookmarks.includes(id)) {
          toast.success(`Removed from bookmarks`, {
            description: `${opportunity.title} has been removed from your bookmarks`,
          })
        } else {
          toast.success(`Added to bookmarks`, {
            description: `${opportunity.title} has been added to your bookmarks`,
          })
        }
      }
    } catch (error) {
      console.error("Failed to update bookmarks:", error)
      toast.error("Failed to update bookmarks", {
        description: "Your bookmark could not be saved. Please try again.",
      })
    }
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    try {
      setFilterOptions(newFilters)
    } catch (error) {
      console.error("Error updating filters:", error)
      toast.error("Error updating filters", {
        description: "There was a problem applying your filter selections",
      })
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSearchQuery(e.target.value)
    } catch (error) {
      console.error("Error updating search:", error)
      toast.error("Error updating search", {
        description: "There was a problem with your search query",
      })
    }
  }

  const clearAllFilters = () => {
    try {
      setFilterOptions({
        causes: [],
        commitmentLevels: [],
        dateRange: { start: null, end: null },
        showBookmarksOnly: false,
      })
      setSearchQuery("")
      toast.success("Filters cleared", {
        description: "All filters have been reset",
      })
    } catch (error) {
      console.error("Error clearing filters:", error)
      toast.error("Error clearing filters", {
        description: "There was a problem clearing your filters",
      })
    }
  }

  const FilterContent = (
    <FilterSidebar
      filterOptions={filterOptions}
      onFilterChange={handleFilterChange}
      bookmarksCount={bookmarks.length}
    />
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto py-4 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Volunteer Connect
            </h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {!isDesktop && (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Open filters"
                      className="rounded-full border-border/60 bg-background/50 w-9 h-9"
                    >
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-4">Filters</h3>
                      {FilterContent}
                    </div>
                  </DrawerContent>
                </Drawer>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              className="pl-9 rounded-full border-border/60 bg-background/50 focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search volunteer opportunities"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {isDesktop && (
            <aside className="w-full md:w-1/4 lg:w-1/5 md:sticky md:top-24 md:self-start">
              <Card className="bg-card/50 backdrop-blur-sm border-border/60 shadow-sm">
                <CardContent className="p-4">{FilterContent}</CardContent>
              </Card>
            </aside>
          )}

          <section className="w-full md:w-3/4 lg:w-4/5" aria-label="Volunteer opportunities list">
            {(filterOptions.causes.length > 0 ||
              filterOptions.commitmentLevels.length > 0 ||
              filterOptions.showBookmarksOnly ||
              searchQuery.trim()) && (
              <div className="mb-4 flex flex-wrap gap-2 items-center" aria-live="polite">
                <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
                {filterOptions.causes.map((cause) => (
                  <Badge key={cause} variant="secondary" className="rounded-full bg-secondary/80 hover:bg-secondary/90">
                    {cause}
                  </Badge>
                ))}
                {filterOptions.commitmentLevels.map((level) => (
                  <Badge key={level} variant="secondary" className="rounded-full bg-secondary/80 hover:bg-secondary/90">
                    {level}
                  </Badge>
                ))}
                {filterOptions.showBookmarksOnly && (
                  <Badge variant="secondary" className="rounded-full bg-secondary/80 hover:bg-secondary/90">
                    <BookmarkCheck className="h-3 w-3 mr-1" />
                    Bookmarked
                  </Badge>
                )}
                {searchQuery.trim() && (
                  <Badge variant="secondary" className="rounded-full bg-secondary/80 hover:bg-secondary/90">
                    <Search className="h-3 w-3 mr-1" />"{searchQuery}"
                  </Badge>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading opportunities">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse bg-card/50 border-border/60 overflow-hidden">
                    <div className="h-48 bg-muted"></div>
                    <div className="p-4">
                      <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : hasError ? (
              <Card className="w-full bg-card/50 border-border/60 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-destructive/10 p-4 mb-4">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Failed to load opportunities</h3>
                  <p className="text-muted-foreground text-center mb-6" aria-live="assertive">
                    We couldn't load the volunteer opportunities. Please try again.
                  </p>
                  <Button
                    onClick={() => {
                      setIsLoading(true)
                      setHasError(false)
                      // Simulate loading data again
                      setTimeout(() => {
                        import("@/lib/mock-data")
                          .then((module) => {
                            setOpportunities(module.opportunities)
                            setFilteredOpportunities(module.opportunities)
                            setIsLoading(false)
                          })
                          .catch((error) => {
                            console.error("Failed to reload opportunities:", error)
                            setHasError(true)
                            setIsLoading(false)
                            toast.error("Failed to reload opportunities", {
                              description: "Please try again later",
                            })
                          })
                      }, 1000)
                    }}
                    className="rounded-full"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredOpportunities.length > 0 ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                aria-label={`${filteredOpportunities.length} volunteer opportunities found`}
              >
                {filteredOpportunities.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    isBookmarked={bookmarks.includes(opportunity.id)}
                    onBookmarkToggle={() => toggleBookmark(opportunity.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="w-full bg-card/50 border-border/60 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted/50 p-4 mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-center mb-4" aria-live="assertive">
                    No volunteer opportunities match your current filters.
                  </p>
                  <Button variant="outline" onClick={clearAllFilters} className="rounded-full">
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

