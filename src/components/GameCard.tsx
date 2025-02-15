
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  playTime: string;
  isCheckedOut: boolean;
}

interface GameCardProps {
  game: Game;
  isAdmin: boolean;
  onCheckout?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const GameCard = ({ game, isAdmin, onCheckout, onEdit, onDelete }: GameCardProps) => {
  return (
    <Card className="glass-card hover-scale overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={game.imageUrl || "/placeholder.svg"}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        {game.isCheckedOut && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-red-500/90 text-white"
          >
            Checked Out
          </Badge>
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
            onClick={onCheckout}
          >
            {game.isCheckedOut ? "Unavailable" : "Borrow Game"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GameCard;
