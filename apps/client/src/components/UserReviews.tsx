"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface UserReviewsProps {
  productId: number;
}

export default function UserReviews({ productId }: UserReviewsProps) {
  const [sortBy, setSortBy] = useState("helpful");

  // Mock review data - in production, fetch based on productId
  console.log(`Loading reviews for product ${productId}`);
  const reviews = [
    {
      id: 1,
      author: "John D.",
      verified: true,
      rating: 5,
      date: "2 weeks ago",
      title: "Excellent sound quality and battery life!",
      content: "These are by far the best wireless headphones I've owned. The ANC is impressive, blocking out most ambient noise. Battery life easily lasts 2-3 days with moderate use. Build quality feels premium and the touch controls are responsive.",
      helpful: 47,
      images: []
    },
    {
      id: 2,
      author: "Sarah M.",
      verified: true,
      rating: 4,
      date: "1 month ago",
      title: "Great product, minor connectivity issues",
      content: "Love the sound quality and comfort. Occasionally have brief connectivity drops when moving between rooms, but overall excellent value for money. The app is intuitive and allows good customization of EQ settings.",
      helpful: 32,
      images: []
    },
    {
      id: 3,
      author: "Tech Reviewer",
      verified: true,
      rating: 5,
      date: "3 weeks ago",
      title: "Best in class for the price point",
      content: "As someone who tests audio equipment professionally, these punch well above their weight class. The frequency response is balanced, ANC rivals products 2x the price, and codec support is comprehensive. Highly recommended for audiophiles on a budget.",
      helpful: 89,
      images: []
    }
  ];

  const ratingBreakdown = [
    { stars: 5, count: 1847, percentage: 65 },
    { stars: 4, count: 723, percentage: 25 },
    { stars: 3, count: 198, percentage: 7 },
    { stars: 2, count: 57, percentage: 2 },
    { stars: 1, count: 22, percentage: 1 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">User Reviews</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FDB913]"
          title="Sort reviews"
        >
          <option value="helpful">Most Helpful</option>
          <option value="recent">Most Recent</option>
          <option value="rating-high">Highest Rating</option>
          <option value="rating-low">Lowest Rating</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Overall Rating */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#FDB913]/10 to-[#0A7EA4]/10 border border-[#FDB913]/30 rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-gray-900 mb-2">4.8</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? "text-[#FDB913] fill-[#FDB913]" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Based on 2,847 reviews</p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {ratingBreakdown.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-8">{rating.stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-[#FDB913] rounded-full h-2 ${
                        rating.percentage >= 75 ? 'w-3/4' :
                        rating.percentage >= 50 ? 'w-1/2' :
                        rating.percentage >= 25 ? 'w-1/4' :
                        rating.percentage >= 10 ? 'w-1/12' : 'w-px'
                      }`}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {rating.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{review.author}</span>
                    {review.verified && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-[#FDB913] fill-[#FDB913]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>

              <div className="flex items-center gap-4 text-sm">
                <button className="text-gray-600 hover:text-[#0A7EA4] transition-colors">
                  Helpful ({review.helpful})
                </button>
                <button className="text-gray-600 hover:text-[#0A7EA4] transition-colors">
                  Report
                </button>
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all">
              Load More Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
