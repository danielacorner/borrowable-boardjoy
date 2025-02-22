import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Calendar, User, Clock, Brain, Undo } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GameStatus } from "@/types";
import { format } from "date-fns";

interface Game {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  playTime: string | null;
  recommendedAge: string | null;
  complexityRating: number | null;
  status: GameStatus;
  conditionNotes: string | null;
  borrowedUntil?: string | null;
  borrowerEmail?: string | null;
}

interface GameCardProps {
  game: Game;
  isAdmin: boolean;
  onCheckout?: (
    dates: { from: Date; to: Date },
    borrowerName: string,
    borrowerEmail: string,
    message: string
  ) => void;
  onReturn?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const GameCard = ({
  game,
  isAdmin,
  onCheckout,
  onReturn,
  onEdit,
  onDelete,
}: GameCardProps) => {
  if (game.borrowerEmail) {
    console.log(game);
  }
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showBorrowDialog = searchParams.get("borrowing") === game.id;
  const [imageError, setImageError] = useState(false);
  const [borrowDates, setBorrowDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [borrowerName, setBorrowerName] = useState(() => {
    return localStorage.getItem("guestName") || "";
  });
  const [borrowerEmail, setBorrowerEmail] = useState(() => {
    return game.borrowerEmail ?? (localStorage.getItem("guestEmail") || "");
  });
  const [message, setMessage] = useState("");

  const handleBorrowSubmit = () => {
    if (
      !borrowDates.from ||
      !borrowDates.to ||
      !borrowerName.trim() ||
      !borrowerEmail.trim()
    ) {
      return;
    }
    localStorage.setItem("guestName", borrowerName);
    localStorage.setItem("guestEmail", borrowerEmail);
    if (onCheckout) {
      onCheckout(borrowDates, borrowerName, borrowerEmail, message);
    }
  };

  const handleEditClick = () => {
    navigate(`/games/${game.id}/edit`);
  };

  const getStatusBadgeColor = (status: Game["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500/90";
      case "borrowed":
      case "reserved":
        return "bg-yellow-500/90";
      case "maintenance":
        return "bg-orange-500/90";
      case "retired":
        return "bg-red-500/90";
      default:
        return "bg-gray-500/90";
    }
  };

  const handleImageError = () => {
    setImageError(true);
    console.error(`Failed to load image for game: ${game.title}`);
  };

  const getBorrowedUntilText = () => {
    if (game.borrowedUntil) {
      return `Unavailable until ${format(
        new Date(game.borrowedUntil),
        "MMM d, yyyy"
      )}`;
    }
    return "Unavailable";
  };

  const handleOpenBorrowDialog = () => {
    navigate(`?borrowing=${game.id}`, { replace: false });
  };

  const handleCloseBorrowDialog = useCallback(() => {
    // navigate(-1);
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      handleCloseBorrowDialog();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [handleCloseBorrowDialog]);

  return (
    <>
      <Card className="glass-card hover-scale overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              !imageError
                ? game.imageUrl || "/placeholder.svg"
                : "/placeholder.svg"
            }
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={handleImageError}
          />
          <Badge
            variant="secondary"
            className={`absolute top-2 right-2 ${getStatusBadgeColor(
              game.status
            )} text-white`}
          >
            {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-semibold line-clamp-1">
            {game.title}
          </CardTitle>
          <CardDescription className="flex flex-wrap gap-2">
            <Badge variant="outline">
              <User className="h-3 w-3 mr-1" />
              {game.minPlayers}-{game.maxPlayers} Players
            </Badge>
            {game.playTime && (
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {game.playTime}
              </Badge>
            )}
            {game.recommendedAge && (
              <Badge variant="outline">{game.recommendedAge}+</Badge>
            )}
            {game.complexityRating && (
              <Badge variant="outline">
                <Brain className="h-3 w-3 mr-1" />
                {game.complexityRating.toFixed(1)}
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {game.description}
          </p>
          {game.conditionNotes && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              Condition: {game.conditionNotes}
            </p>
          )}
          {isAdmin && game.borrowerEmail && game.status === "borrowed" && (
            <p className="text-sm text-muted-foreground mt-2">
              Borrowed by: {game.borrowerEmail}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {isAdmin ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleEditClick}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={onDelete}>
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
              {game.status === "borrowed" && (
                <Button size="sm" variant="secondary" onClick={onReturn}>
                  <Undo className="h-4 w-4 mr-1" />
                  Returned
                </Button>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              disabled={game.status !== "available"}
              onClick={handleOpenBorrowDialog}
            >
              <Calendar className="h-4 w-4 mr-1" />
              {game.status === "available"
                ? "Borrow Game"
                : getBorrowedUntilText()}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog
        open={showBorrowDialog}
        onOpenChange={(open) => {
          if (!open) handleCloseBorrowDialog();
        }}
      >
        <DialogContent className="sm:max-w-[425px] max-h-[100vh] overflow-y-auto py-8">
          <DialogHeader className="mt-16">
            <DialogTitle>Borrow {game.title}</DialogTitle>
            <DialogDescription>
              Enter your details and select the dates you'd like to borrow this
              game.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="borrower-name">Your Name</Label>
              <Input
                id="borrower-name"
                placeholder="Enter your name"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="borrower-email">Your Email</Label>
              <Input
                id="borrower-email"
                type="email"
                placeholder="Enter your email"
                value={borrowerEmail}
                onChange={(e) => setBorrowerEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Select Dates</Label>
              <CalendarComponent
                mode="range"
                selected={{
                  from: borrowDates.from,
                  to: borrowDates.to,
                }}
                onSelect={(range) => {
                  setBorrowDates({
                    from: range?.from,
                    to: range?.to,
                  });
                }}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Any special requests or notes?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="pb-36 flex gap-2">
            <Button variant="secondary" onClick={handleCloseBorrowDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleBorrowSubmit}
              disabled={
                !borrowDates.from ||
                !borrowDates.to ||
                !borrowerName.trim() ||
                !borrowerEmail.trim()
              }
            >
              Confirm Borrowing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GameCard;
