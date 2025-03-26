"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Bookmark, BookmarkCheck, User } from "lucide-react"
import type { Opportunity } from "@/lib/opportunities"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface OpportunityCardProps {
  opportunity: Opportunity
  isBookmarked: boolean
  onBookmarkToggle: () => void
}

export default function OpportunityCard({ opportunity, isBookmarked, onBookmarkToggle }: OpportunityCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const { id, title, organization, location, date, commitmentLevel, cause, description, imageUrl } = opportunity

  const formattedDate = format(new Date(date), "PPP")

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md bg-card/50 backdrop-blur-sm border-border/60 group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg?height=192&width=384"}
            alt={`Volunteer opportunity: ${title} by ${organization}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Handle image loading error
              e.currentTarget.src = "/placeholder.svg?height=192&width=384&text=Image+Not+Available"
              toast.error("Image failed to load", {
                description: "The opportunity image could not be loaded",
              })
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/80 hover:bg-background/90 rounded-full shadow-sm transition-transform duration-300 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation()
              onBookmarkToggle()
            }}
            aria-label={isBookmarked ? `Remove ${title} from bookmarks` : `Bookmark ${title}`}
            aria-pressed={isBookmarked}
          >
            {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
            <span className="sr-only">{isBookmarked ? "Remove bookmark" : "Bookmark"}</span>
          </Button>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge variant="outline" className="bg-background/20 text-white border-white/20 backdrop-blur-sm">
              {cause}
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-2 pt-4">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1 text-lg">{title}</CardTitle>
            <CardDescription className="line-clamp-1 flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              {organization}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <span>{location}</span>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
              <span>{commitmentLevel}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-4">
          <Button
            className="w-full rounded-full transition-all duration-300 hover:shadow-md"
            onClick={() => setShowDetails(true)}
            aria-label={`View details for ${title}`}
            aria-haspopup="dialog"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg rounded-lg overflow-hidden p-0 gap-0 max-h-[85vh] overflow-y-auto">
          <div className="relative h-56 overflow-hidden">
            <img
              src={imageUrl || "/placeholder.svg?height=300&width=600"}
              alt={`Volunteer opportunity: ${title} by ${organization}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=300&width=600&text=Image+Not+Available"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            {/* Removed bookmark icon from modal header to avoid overlap with close button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm text-white/80">{organization}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                <MapPin className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Location</p>
                  <p>{location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                <Calendar className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Date</p>
                  <p>{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                <Clock className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Commitment</p>
                  <p>{commitmentLevel}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded-lg">
                <User className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Organization</p>
                  <p>{organization}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2 text-primary">About this opportunity</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full">{cause}</Badge>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 sm:justify-between gap-3">
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onBookmarkToggle()
              }}
              className={cn(
                "flex gap-2 h-9 rounded-full",
                isBookmarked && "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20",
              )}
              aria-label={isBookmarked ? `Remove ${title} from bookmarks` : `Bookmark ${title}`}
              aria-pressed={isBookmarked}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
                  Bookmarked
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" aria-hidden="true" />
                  Bookmark
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(false)}
              aria-label="Close details"
              className="rounded-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

