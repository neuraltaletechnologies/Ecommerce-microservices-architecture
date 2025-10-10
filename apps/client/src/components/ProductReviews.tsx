"use client";

import { Star, ThumbsUp, ThumbsDown, User, Verified } from "lucide-react";
import { useState } from "react";

interface Review {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  userHasVoted: "helpful" | "not-helpful" | null;
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
}

// Mock reviews data - in production this would come from your API
const generateMockReviews = (productId: number): Review[] => {
  const reviews: Review[] = [
    {
      id: 1,
      userId: "user-1",
      userName: "Alex Thompson",
      rating: 5,
      title: "Exceptional quality and performance!",
      comment: "This product exceeded my expectations in every way. The build quality is outstanding, and the performance is exactly what I needed. Highly recommend to anyone looking for a reliable tech solution.",
      date: new Date("2024-01-15"),
      isVerifiedPurchase: true,
      helpfulCount: 24,
      notHelpfulCount: 2,
      userHasVoted: null,
    },
    {
      id: 2,
      userId: "user-2",
      userName: "Sarah Chen",
      rating: 4,
      title: "Great value for money",
      comment: "Really impressed with this purchase. The features are excellent and it works perfectly with my setup. Only minor complaint is the packaging could be better, but the product itself is fantastic.",
      date: new Date("2024-01-10"),
      isVerifiedPurchase: true,
      helpfulCount: 18,
      notHelpfulCount: 1,
      userHasVoted: null,
    },
    {
      id: 3,
      userId: "user-3",
      userName: "Mike Rodriguez",
      rating: 5,
      title: "Perfect for professional use",
      comment: "Been using this for my work for several months now. The reliability and performance are top-notch. Worth every penny and I would definitely buy again.",
      date: new Date("2024-01-05"),
      isVerifiedPurchase: true,
      helpfulCount: 31,
      notHelpfulCount: 0,
      userHasVoted: null,
    },
    {
      id: 4,
      userId: "user-4",
      userName: "Emma Wilson",
      rating: 4,
      title: "Solid choice",
      comment: "Good product overall. Setup was straightforward and it does everything advertised. The design is sleek and modern. One star off because delivery took longer than expected.",
      date: new Date("2023-12-28"),
      isVerifiedPurchase: false,
      helpfulCount: 12,
      notHelpfulCount: 3,
      userHasVoted: null,
    },
    {
      id: 5,
      userId: "user-5",
      userName: "David Kim",
      rating: 5,
      title: "Outstanding customer experience",
      comment: "Not only is the product excellent, but the customer service was also amazing. They helped me choose the right specifications and the delivery was fast. Couldn't be happier!",
      date: new Date("2023-12-20"),
      isVerifiedPurchase: true,
      helpfulCount: 27,
      notHelpfulCount: 1,
      userHasVoted: null,
    },
  ];

  // Modify reviews slightly based on productId for variation
  return reviews.map(review => ({
    ...review,
    id: review.id + (productId * 100),
    helpfulCount: review.helpfulCount + (productId % 10),
    rating: Math.max(3, review.rating - (productId % 3 === 0 ? 1 : 0)),
  }));
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<Review[]>(generateMockReviews(productId));
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest" | "helpful">("newest");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Calculate overall rating
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  
  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / totalReviews) * 100
  }));

  // Sort and filter reviews
  const filteredAndSortedReviews = reviews
    .filter(review => filterRating ? review.rating === filterRating : true)
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.date.getTime() - b.date.getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "helpful":
          return b.helpfulCount - a.helpfulCount;
        case "newest":
        default:
          return b.date.getTime() - a.date.getTime();
      }
    });

  const handleVote = (reviewId: number, voteType: "helpful" | "not-helpful") => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        if (review.userHasVoted === voteType) {
          // Remove vote
          return {
            ...review,
            helpfulCount: voteType === "helpful" ? review.helpfulCount - 1 : review.helpfulCount,
            notHelpfulCount: voteType === "not-helpful" ? review.notHelpfulCount - 1 : review.notHelpfulCount,
            userHasVoted: null,
          };
        } else {
          // Add or change vote
          const helpfulDelta = voteType === "helpful" ? 1 : (review.userHasVoted === "helpful" ? -1 : 0);
          const notHelpfulDelta = voteType === "not-helpful" ? 1 : (review.userHasVoted === "not-helpful" ? -1 : 0);
          
          return {
            ...review,
            helpfulCount: review.helpfulCount + helpfulDelta,
            notHelpfulCount: review.notHelpfulCount + notHelpfulDelta,
            userHasVoted: voteType,
          };
        }
      }
      return review;
    }));
  };

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
      
      {/* Overall Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <div>
              {renderStars(Math.round(averageRating), "md")}
              <p className="text-sm text-gray-600 mt-1">
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Rating Distribution</h4>
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600 w-8">{rating}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by rating</label>
          <select
            value={filterRating || ""}
            onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredAndSortedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">{review.userName}</span>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <Verified className="w-3 h-3" />
                      Verified Purchase
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-600">
                    {review.date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Was this helpful?</span>
                  <button
                    onClick={() => handleVote(review.id, "helpful")}
                    className={`flex items-center gap-1 text-sm px-2 py-1 rounded transition-colors ${
                      review.userHasVoted === "helpful"
                        ? "text-green-700 bg-green-50"
                        : "text-gray-600 hover:text-green-600"
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    {review.helpfulCount}
                  </button>
                  <button
                    onClick={() => handleVote(review.id, "not-helpful")}
                    className={`flex items-center gap-1 text-sm px-2 py-1 rounded transition-colors ${
                      review.userHasVoted === "not-helpful"
                        ? "text-red-700 bg-red-50"
                        : "text-gray-600 hover:text-red-600"
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                    {review.notHelpfulCount}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedReviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews match your filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;