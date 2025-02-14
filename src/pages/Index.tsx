
import React, { useState } from "react";
import GameCard from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Temporary mock data until we integrate with a backend
const mockGames = [
  {
    id: "1",
    title: "Catan",
    description: "Trade, build and settle. Classic strategy game of resource management and negotiation.",
    imageUrl: "https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__thumb/img/8a9HeqFydO7Uun_le9bXWPnidcA=/fit-in/200x150/filters:strip_icc()/pic2419375.jpg",
    minPlayers: 3,
    maxPlayers: 4,
    playTime: "60-120 min",
    isCheckedOut: false,
  },
  {
    id: "2",
    title: "Ticket to Ride",
    description: "Build your railroad empire across North America. Connect cities and complete tickets.",
    imageUrl: "https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__thumb/img/a9rsFV6KR0aun8GobhRU16aU8Kc=/fit-in/200x150/filters:strip_icc()/pic38668.jpg",
    minPlayers: 2,
    maxPlayers: 5,
    playTime: "30-60 min",
    isCheckedOut: true,
  },
];

const Index = () => {
  const [games, setGames] = useState(mockGames);
  const [isAdmin] = useState(true); // Temporary, replace with actual auth
  const { toast } = useToast();

  const handleCheckout = (gameId: string) => {
    setGames(games.map(game => 
      game.id === gameId ? { ...game, isCheckedOut: true } : game
    ));
    toast({
      title: "Success",
      description: "Game checked out successfully!",
    });
  };

  const handleDelete = (gameId: string) => {
    setGames(games.filter(game => game.id !== gameId));
    toast({
      title: "Success",
      description: "Game deleted successfully!",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Board Game Library</h1>
          <p className="text-muted-foreground">
            Browse and borrow from our collection of board games
          </p>
        </div>
        {isAdmin && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Game
          </Button>
        )}
      </div>

      <div className="game-grid">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isAdmin={isAdmin}
            onCheckout={() => handleCheckout(game.id)}
            onDelete={() => handleDelete(game.id)}
            onEdit={() => console.log("Edit game:", game.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
