import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GameCard from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GameStatus } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

const gameImageMap: { [key: string]: string } = {
  Wingspan: "wingspan.jpeg",
  Pandemic: "pandemic game.webp",
  Mysterium: "mysterium.png",
  "Mage Wars": "magewars.jpg",
  Jenga: "jenga.jpg",
  "Guess Who?": "guesswho.jpg",
  "Go-Stop": "gostop.webp",
  Cytosis: "cytosis.png",
  Unearth: "Unearth-Board-Game-Feature.webp",
  Cribbage: "H2P_cribbage.jpg",
  Bananagrams: "Bananagrams-French-891-FBN001.webp",
  "Playing Cards": "playingcards.jpg",
};

const Index = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data: hasAdminRole, error } = await supabase.rpc("has_role", {
          user_id: user.id,
          role: "admin",
        });

        if (error) {
          console.error("Error checking admin role:", error);
          return;
        }

        console.log("Admin role check result:", hasAdminRole); // Debug log
        setIsAdmin(
          hasAdminRole || user.email === "danielcorner7@gmail.com" || false
        );
      } catch (err) {
        console.error("Error in checkAdminRole:", err);
      }
    };

    checkAdminRole();
  }, [user]);

  const { data: games, isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select("*")
        .order("title");

      if (gamesError) throw gamesError;

      const { data: reservationsData, error: reservationsError } =
        await supabase
          .from("reservations")
          .select("*")
          .in(
            "game_id",
            gamesData.map((g) => g.id)
          )
          .eq("status", "active");

      if (reservationsError) throw reservationsError;

      const reservationsMap = reservationsData.reduce((acc, reservation) => {
        acc[reservation.game_id] = reservation;
        return acc;
      }, {});

      return gamesData.map((game) => ({
        ...game,
        image_url: gameImageMap[game.title]
          ? `/images/${gameImageMap[game.title]}`
          : "/placeholder.svg",
        status: determineGameStatus(game),
        reservation: reservationsMap[game.id],
      }));
    },
  });

  const determineGameStatus = (game: any): GameStatus => {
    if (game.status === "maintenance" || game.status === "retired") {
      return game.status;
    }

    if (game.borrowed_until) {
      const borrowedUntil = new Date(game.borrowed_until);
      if (borrowedUntil >= new Date()) {
        return "borrowed";
      }
    }

    return "available";
  };

  const createReservationMutation = useMutation({
    mutationFn: async ({
      gameId,
      dates,
      borrowerName,
      borrowerEmail,
      message,
    }: {
      gameId: string;
      dates: { from: Date; to: Date };
      borrowerName: string;
      borrowerEmail: string;
      message: string;
    }) => {
      const { data: reservation, error: reservationError } = await supabase
        .from("reservations")
        .insert([
          {
            game_id: gameId,
            borrower_name: borrowerName,
            borrower_email: borrowerEmail,
            pickup_date: dates.from.toISOString(),
            return_date: dates.to.toISOString(),
            message: message || null,
          },
        ])
        .select()
        .single();

      if (reservationError) throw reservationError;

      const { error: gameError } = await supabase
        .from("games")
        .update({
          borrowed_until: dates.to.toISOString(),
          status: "borrowed",
        })
        .eq("id", gameId);

      if (gameError) throw gameError;

      return reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast({
        title: "Success",
        description:
          "Your reservation request has been submitted. You'll receive an email confirmation shortly.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit reservation. Please try again.",
        variant: "destructive",
      });
      console.error("Reservation error:", error);
    },
  });

  const markGameAsReturnedMutation = useMutation({
    mutationFn: async (gameId: string) => {
      const { error: gameError } = await supabase
        .from("games")
        .update({
          borrowed_until: null,
          status: "available",
        })
        .eq("id", gameId);

      if (gameError) throw gameError;

      const { error: reservationError } = await supabase
        .from("reservations")
        .update({ status: "completed" })
        .eq("game_id", gameId)
        .eq("status", "active");

      if (reservationError) throw reservationError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast({
        title: "Success",
        description: "Game has been marked as returned",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark game as returned",
        variant: "destructive",
      });
      console.error("Return error:", error);
    },
  });

  const handleCheckout = async (
    gameId: string,
    dates: { from: Date; to: Date },
    borrowerName: string,
    borrowerEmail: string,
    message: string
  ) => {
    createReservationMutation.mutate({
      gameId,
      dates,
      borrowerName,
      borrowerEmail,
      message,
    });
  };

  const handleReturn = (gameId: string) => {
    markGameAsReturnedMutation.mutate(gameId);
  };

  const filteredGames = games?.filter(
    (game) =>
      game.title.toLowerCase().includes(search.toLowerCase()) ||
      game.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 items-center flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search games..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isAdmin && (
            <Button
              variant="default"
              onClick={() => navigate("/games/new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Game
            </Button>
          )}
        </div>
        {isAdmin && (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await logout();
                toast({
                  title: "Success",
                  description: "Logged out successfully",
                });
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.message,
                  variant: "destructive",
                });
              }
            }}
          >
            Logout
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Board Game Library</h1>
          <p className="text-muted-foreground">
            Browse and borrow from our collection of board games
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[400px] rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames?.map((game) => (
              <GameCard
                key={game.id}
                game={{
                  id: game.id,
                  title: game.title,
                  description: game.description,
                  imageUrl: game.image_url,
                  minPlayers: game.min_players,
                  maxPlayers: game.max_players,
                  playTime: game.play_time,
                  recommendedAge: game.recommended_age,
                  complexityRating: game.complexity_rating,
                  status: game.status as GameStatus,
                  conditionNotes: game.condition_notes,
                  borrowedUntil: game.borrowed_until,
                  borrowerEmail: game.reservation?.borrower_email,
                }}
                isAdmin={isAdmin}
                onCheckout={(dates, borrowerName, borrowerEmail, message) =>
                  handleCheckout(
                    game.id,
                    dates,
                    borrowerName,
                    borrowerEmail,
                    message
                  )
                }
                onReturn={() => handleReturn(game.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
