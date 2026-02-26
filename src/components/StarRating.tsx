import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
}

export function StarRating({ rating, onChange, size = 14 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className="disabled:cursor-default hover:scale-110 transition-transform"
        >
          <Star
            size={size}
            className={star <= rating ? "fill-warning text-warning" : "text-muted-foreground/30"}
          />
        </button>
      ))}
    </div>
  );
}
