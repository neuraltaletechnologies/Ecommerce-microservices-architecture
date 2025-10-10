import { Star, Shield, Truck, RotateCcw, CheckCircle, Users, Award } from "lucide-react";

const TrustIndicators = () => {
  const trustMetrics = [
    {
      icon: <Star className="w-5 h-5 text-yellow-500 fill-current" />,
      rating: "4.9/5",
      label: "Customer Rating",
      description: "Based on 12,847 reviews"
    },
    {
      icon: <Truck className="w-5 h-5 text-green-600" />,
      label: "Free Shipping",
      description: "On orders over TZs 115,000"
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      label: "Secure Checkout",
      description: "SSL encrypted"
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-purple-600" />,
      label: "Easy Returns",
      description: "30-day return policy"
    }
  ];

  const achievements = [
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      count: "50K+",
      label: "Happy Customers"
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-600" />,
      count: "2024",
      label: "Best Tech Store Award"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      count: "99.9%",
      label: "Uptime Guarantee"
    }
  ];

  return (
    <div className="bg-gray-50 py-8 border-y border-gray-200">
      <div className="container mx-auto px-4">
        {/* Main Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {trustMetrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border">
              <div className="mb-2">
                {metric.icon}
              </div>
              {metric.rating && (
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.rating}
                </div>
              )}
              <div className="font-semibold text-gray-900 text-sm mb-1">
                {metric.label}
              </div>
              <div className="text-xs text-gray-600">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Trust Elements */}
        <div className="flex flex-wrap justify-center items-center gap-8 py-4 border-t border-gray-200">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3">
              {achievement.icon}
              <div>
                <div className="font-bold text-lg text-gray-900">
                  {achievement.count}
                </div>
                <div className="text-sm text-gray-600">
                  {achievement.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>256-bit SSL Encryption</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4" />
            <span>PCI DSS Compliant</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Award className="w-4 h-4" />
            <span>BBB A+ Rating</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Trusted by Tech Professionals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;