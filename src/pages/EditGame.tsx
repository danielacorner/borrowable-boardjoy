
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import GameForm from "@/components/GameForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

type GameStatus = "available" | "reserved" | "borrowed" | "maintenance" | "retired";

interface Game {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  min_players: number | null;
  max_players: number | null;
  play_time: string | null;
  recommended_age: string | null;
  complexity_rating: number | null;
  status: GameStatus;
  condition_notes: string | null;
  created_at: string;
  updated_at: string;
}

const EditGame = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const { data: game, isLoading: isLoadingGame } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data as Game;
    },
  });

  const updateGame = useMutation({
    mutationFn: async (gameData: Partial<Game>) => {
      const { error } = await supabase
        .from("games")
        .update(gameData)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["game", id] });
      toast({
        title: "Success",
        description: "Game updated successfully",
      });
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoadingGame) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <GameForm
        initialData={game}
        onSubmit={updateGame.mutate}
        isLoading={updateGame.isPending}
      />
    </div>
  );
};

export default EditGame;
