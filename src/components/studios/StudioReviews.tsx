import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  photos: string[];
}

interface StudioReviewsProps {
  reviews: Review[];
  rating: number;
  reviewsCount: number;
}

export const StudioReviews = ({ reviews, rating, reviewsCount }: StudioReviewsProps) => {
  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === stars).length;
    const percentage = reviewsCount > 0 ? (count / reviewsCount) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Отзывы</h2>

      {/* Rating Overview */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Overall Rating */}
        <div className="bg-secondary/30 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold mb-2">{rating}</div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-5 h-5 ${star <= rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{reviewsCount} отзывов</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {ratingDistribution.map(({ stars, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16 shrink-0">
                <span className="text-sm font-medium">{stars}</span>
                <Star className="w-3 h-3 text-primary fill-primary" />
              </div>
              <Progress value={percentage} className="h-2 flex-1" />
              <span className="text-sm text-muted-foreground w-12 text-right">{Math.round(percentage)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-start gap-3 mb-3">
              <Avatar>
                <AvatarFallback>{review.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold">{review.author}</p>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-3 h-3 ${star <= review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">{review.text}</p>
            {review.photos.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.photos.map((photo, idx) => (
                  <img 
                    key={idx}
                    src={photo} 
                    alt={`Review photo ${idx + 1}`}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
