
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameFormData {
  title: string;
  description: string;
  imageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  playTime: string;
}

interface GameFormProps {
  initialData?: Partial<GameFormData>;
  onSubmit: (data: GameFormData) => void;
  isLoading?: boolean;
}

const GameForm = ({ initialData, onSubmit, isLoading }: GameFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<GameFormData>({
    defaultValues: initialData,
  });

  return (
    <Card className="glass-card w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Game" : "Add New Game"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Game title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Game description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="Image URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPlayers">Min Players</Label>
              <Input
                id="minPlayers"
                type="number"
                {...register("minPlayers", { required: "Required" })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input
                id="maxPlayers"
                type="number"
                {...register("maxPlayers", { required: "Required" })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playTime">Play Time</Label>
            <Input
              id="playTime"
              {...register("playTime", { required: "Play time is required" })}
              placeholder="e.g., 30-45 min"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Game"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GameForm;
