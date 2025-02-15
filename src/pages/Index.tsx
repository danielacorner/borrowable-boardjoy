
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const mockGames = [
  {
    id: "1",
    title: "Cytosis",
    description: "A cell biology game that takes place inside a human cell. Players compete to build enzymes, hormones and receptors.",
    imageUrl: "https://cf.geekdo-images.com/bWlUJKRXlR7lgYO56ZiJTw__thumb/img/ZwWCWlZ3ZRhPwNOws1EZHBLiXL4=/fit-in/200x150/filters:strip_icc()/pic3618083.jpg",
    minPlayers: 2,
    maxPlayers: 5,
    playTime: "45-60 min",
    isCheckedOut: false,
  },
  {
    id: "2",
    title: "Pandemic",
    description: "Work together as disease control specialists to save humanity from four deadly diseases.",
    imageUrl: "https://cf.geekdo-images.com/S3ybV1LAp-8SnHIXLLjVqA__thumb/img/oqViRj6nVxK3m36NluUKvQCb3GM=/fit-in/200x150/filters:strip_icc()/pic1534148.jpg",
    minPlayers: 2,
    maxPlayers: 4,
    playTime: "45 min",
    isCheckedOut: false,
  },
  {
    id: "3",
    title: "Jenga",
    description: "Classic block-stacking, stack-crashing game of physical and mental skill.",
    imageUrl: "https://cf.geekdo-images.com/EI3Ssf22eeh9FaDS8-bf4g__thumb/img/284yMV_ah0IuqaKe7ZjFm3yHBiA=/fit-in/200x150/filters:strip_icc()/pic2247657.jpg",
    minPlayers: 1,
    maxPlayers: 8,
    playTime: "20 min",
    isCheckedOut: false,
  },
  {
    id: "4",
    title: "Guess Who?",
    description: "Ask yes/no questions to figure out your opponent's mystery character.",
    imageUrl: "https://cf.geekdo-images.com/7PB3hOPtK76UJ8Ao7q8txw__thumb/img/T4NGcCyOYKvcjZKh_Xq5tzQnxGI=/fit-in/200x150/filters:strip_icc()/pic4779508.jpg",
    minPlayers: 2,
    maxPlayers: 2,
    playTime: "20 min",
    isCheckedOut: false,
  },
  {
    id: "5",
    title: "Carcassonne",
    description: "Build a medieval landscape tile by tile, claiming cities, roads, and monasteries.",
    imageUrl: "https://cf.geekdo-images.com/Z3upN53-fsVPUDimN9SpOA__thumb/img/_C_tX0BC9OwnSena-Rmb0TeaRfI=/fit-in/200x150/filters:strip_icc()/pic2337577.jpg",
    minPlayers: 2,
    maxPlayers: 5,
    playTime: "30-45 min",
    isCheckedOut: false,
  },
  {
    id: "6",
    title: "Mage Wars",
    description: "Tactical fantasy dueling game where players take on the role of powerful mages.",
    imageUrl: "https://cf.geekdo-images.com/qAqJyw0Y6dTaJ3OQVluI0A__thumb/img/k-MH9xJPZf998OeVbV7zcJtLCjQ=/fit-in/200x150/filters:strip_icc()/pic1258575.jpg",
    minPlayers: 2,
    maxPlayers: 2,
    playTime: "90 min",
    isCheckedOut: false,
  },
  {
    id: "7",
    title: "Cribbage",
    description: "Classic card game combining hand management and pegging for points.",
    imageUrl: "https://cf.geekdo-images.com/CGk88JH5AENz0fkAr9home__thumb/img/Q9acELlWW1A99OLKBFXN-XDLtDs=/fit-in/200x150/filters:strip_icc()/pic6483874.jpg",
    minPlayers: 2,
    maxPlayers: 4,
    playTime: "30 min",
    isCheckedOut: false,
  },
  {
    id: "8",
    title: "Playing Cards",
    description: "Standard 52-card deck for countless card games.",
    imageUrl: "https://cf.geekdo-images.com/ZqWGxsO2NOJckZ_N6RdXlg__thumb/img/6VAFexD4JQPT2JRJVhxNWxPfTZE=/fit-in/200x150/filters:strip_icc()/pic3893506.jpg",
    minPlayers: 1,
    maxPlayers: 10,
    playTime: "varies",
    isCheckedOut: false,
  },
  {
    id: "9",
    title: "Go Stop",
    description: "Traditional Korean card game of matching and strategy.",
    imageUrl: "https://cf.geekdo-images.com/thumb/img/placeholder-card-game.jpg",
    minPlayers: 2,
    maxPlayers: 6,
    playTime: "30 min",
    isCheckedOut: false,
  },
  {
    id: "10",
    title: "Mysterium",
    description: "Cooperative mystery game where a ghost communicates with psychics through visions.",
    imageUrl: "https://cf.geekdo-images.com/wfeAiLK5n5dNTrQ4KVnHpg__thumb/img/DyRqAxQ1uRBVVB9ZV9F9UO8MG-k=/fit-in/200x150/filters:strip_icc()/pic2601683.jpg",
    minPlayers: 2,
    maxPlayers: 7,
    playTime: "42 min",
    isCheckedOut: false,
  },
  {
    id: "11",
    title: "Wingspan",
    description: "Competitive bird collection and habitat building game.",
    imageUrl: "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__thumb/img/VNToqgS2-pOGU6MuvIkMPKn_y-s=/fit-in/200x150/filters:strip_icc()/pic4458123.jpg",
    minPlayers: 1,
    maxPlayers: 5,
    playTime: "40-70 min",
    isCheckedOut: false,
  },
  {
    id: "12",
    title: "Bananagrams (Édition Française)",
    description: "Course rapide de construction de mots croisés en français.",
    imageUrl: "https://cf.geekdo-images.com/thumb/img/placeholder-word-game.jpg",
    minPlayers: 1,
    maxPlayers: 8,
    playTime: "15 min",
    isCheckedOut: false,
  },
  {
    id: "13",
    title: "Unearth",
    description: "Roll dice to claim ruins and collect stones to build wonders.",
    imageUrl: "https://cf.geekdo-images.com/5Zc-YXVnC1UaIC0I1pL1og__thumb/img/OIfFEwQGl8x4GLvEI6bg5FOTe6k=/fit-in/200x150/filters:strip_icc()/pic3565654.jpg",
    minPlayers: 2,
    maxPlayers: 4,
    playTime: "45-60 min",
    isCheckedOut: false,
  },
  {
    id: "14",
    title: "Balderdash",
    description: "Bluff your way to victory by creating convincing definitions for obscure words.",
    imageUrl: "https://cf.geekdo-images.com/thumb/img/placeholder-party-game.jpg",
    minPlayers: 2,
    maxPlayers: 6,
    playTime: "60 min",
    isCheckedOut: false,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [games, setGames] = useState(mockGames);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      // Check if the user is an admin (danielcorner7@gmail.com)
      setIsAdmin(user.email === "danielcorner7@gmail.com");
    }
  }, [user, loading]);

  const handleCheckout = (gameId: string) => {
    if (!user) {
      // Instead of showing a toast, redirect to auth with return URL
      navigate("/auth", { 
        state: { 
          returnTo: "/",
          gameId: gameId,
          action: "checkout"
        } 
      });
      return;
    }

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Board Game Library</h1>
          <p className="text-muted-foreground">
            Browse and borrow from our collection of board games
          </p>
        </div>
        <div className="flex gap-4">
          {isAdmin && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Game
            </Button>
          )}
          {user ? (
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
