import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  showValue = false,
  interactive = false,
  onRatingChange,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const current = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1" style={{ display: 'inline-flex' }}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = current >= starValue;
          const isHalf = current >= starValue - 0.5 && current < starValue;

          return (
            <button
              type="button"
              key={index}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: interactive ? 'pointer' : 'default',
                color: isFilled || isHalf ? '#f59e0b' : '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Star
                size={size}
                fill={isFilled ? '#f59e0b' : isHalf ? 'url(#half-star)' : 'none'}
                strokeWidth={2}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span style={{ fontSize: `${size * 0.85}px`, fontWeight: 600, color: 'var(--text-muted)', marginLeft: '4px' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
