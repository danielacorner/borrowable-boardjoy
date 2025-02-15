
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameFormData {
  title: string;
  description: string | null;
  imageUrl: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  playTime: string | null;
  recommendedAge: string | null;
  complexityRating: number | null;
  status: 'available' | 'reserved' | 'borrowed' | 'maintenance' | 'retired';
  conditionNotes: string | null;
}

interface GameFormProps {
  initialData?: Partial<GameFormData>;
  onSubmit: (data: GameFormData) => void;
  isLoading?: boolean;
}

const GameForm = ({ initialData, onSubmit, isLoading }: GameFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<GameFormData>({
    defaultValues: initialData || {
      status: 'available',
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
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
              {...register("description")}
              placeholder="Game description"
            />
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
                {...register("minPlayers", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input
                id="maxPlayers"
                type="number"
                {...register("maxPlayers", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playTime">Play Time</Label>
            <Input
              id="playTime"
              {...register("playTime")}
              placeholder="e.g., 30-45 min"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendedAge">Recommended Age</Label>
            <Input
              id="recommendedAge"
              {...register("recommendedAge")}
              placeholder="e.g., 12+"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complexityRating">Complexity Rating (1-5)</Label>
            <Input
              id="complexityRating"
              type="number"
              step="0.1"
              min="1"
              max="5"
              {...register("complexityRating", { 
                valueAsNumber: true,
                min: { value: 1, message: "Minimum rating is 1" },
                max: { value: 5, message: "Maximum rating is 5" }
              })}
            />
            {errors.complexityRating && (
              <p className="text-sm text-red-500">{errors.complexityRating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              defaultValue={initialData?.status || 'available'}
              onValueChange={(value) => register("status").onChange({ target: { value } })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="borrowed">Borrowed</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conditionNotes">Condition Notes</Label>
            <Textarea
              id="conditionNotes"
              {...register("conditionNotes")}
              placeholder="Notes about the game's condition"
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
