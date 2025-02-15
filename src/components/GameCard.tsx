
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  playTime: string;
  isCheckedOut: boolean;
  borrowerName?: string;
}

interface GameCardProps {
  game: Game;
  isAdmin: boolean;
  onCheckout?: (dates: { from: Date; to: Date }, borrowerName: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const GameCard = ({ game, isAdmin, onCheckout, onEdit, onDelete }: GameCardProps) => {
  const [showBorrowDialog, setShowBorrowDialog] = React.useState(false);
  const [borrowDates, setBorrowDates] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [borrowerName, setBorrowerName] = React.useState(() => {
    return localStorage.getItem("guestName") || "";
  });

  const handleBorrowSubmit = () => {
    if (!borrowDates.from || !borrowDates.to || !borrowerName.trim()) {
      return;
    }
    localStorage.setItem("guestName", borrowerName);
    setShowBorrowDialog(false);
    if (onCheckout) {
      onCheckout(borrowDates, borrowerName);
    }
  };

  return (
    <>
      <Card className="glass-card hover-scale overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={game.imageUrl || "/placeholder.svg"}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {game.isCheckedOut && (
            <>
              <Badge 
                variant="secondary" 
                className="absolute top-2 right-2 bg-red-500/90 text-white"
              >
                Checked Out
              </Badge>
              {isAdmin && game.borrowerName && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-10 right-2 bg-blue-500/90 text-white"
                >
                  By: {game.borrowerName}
                </Badge>
              )}
            </>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-semibold line-clamp-1">{game.title}</CardTitle>
          <CardDescription className="flex gap-2">
            <Badge variant="outline">{game.minPlayers}-{game.maxPlayers} Players</Badge>
            <Badge variant="outline">{game.playTime}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isAdmin ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={onDelete}>
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          ) : (
            <Button 
              size="sm" 
              disabled={game.isCheckedOut}
              onClick={() => setShowBorrowDialog(true)}
            >
              {game.isCheckedOut ? "Unavailable" : "Borrow Game"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showBorrowDialog} onOpenChange={setShowBorrowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Borrow {game.title}</DialogTitle>
            <DialogDescription>
              Enter your name and select the dates you'd like to borrow this game.
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
            <Calendar
              mode="range"
              selected={{
                from: borrowDates.from,
                to: borrowDates.to,
              }}
              onSelect={(range) => {
                setBorrowDates({ 
                  from: range?.from, 
                  to: range?.to 
                });
              }}
              className="rounded-md border"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowBorrowDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBorrowSubmit}
              disabled={!borrowDates.from || !borrowDates.to || !borrowerName.trim()}
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
