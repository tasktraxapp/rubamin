
import React from 'react';

interface RecentFeedbackProps {
  darkMode: boolean;
}

const RecentFeedback = ({ darkMode }: RecentFeedbackProps) => {
  const feedbacks = [
    {
      name: 'Jean-Pierre Mukendi',
      email: 'jp.mukendi@gmail.com',
      message:
        'Excellent service quality for medical oxygen supply. Very reliable and timely delivery to our hospital.',
      rating: 5,
      date: '2h ago',
      type: 'Contact Form',
      avatar: 'JM',
    },
    {
      name: 'Sarah Van Der Berg',
      email: 's.vanderberg@mining.co.za',
      message:
        'Interested in copper blister pricing for bulk orders. Please share your latest catalog and MOQ details.',
      rating: 4,
      date: '5h ago',
      type: 'Inquiry',
      avatar: 'SV',
    },
    {
      name: 'Patrick Kabongo',
      email: 'p.kabongo@yahoo.fr',
      message:
        'The CSR initiatives in Likasi are making a real difference. Thank you for supporting our community.',
      rating: 5,
      date: '1d ago',
      type: 'Feedback',
      avatar: 'PK',
    },
    {
      name: 'Amit Patel',
      email: 'amit.p@industrialgas.in',
      message:
        'Would like to discuss partnership opportunities for industrial gas distribution in the region.',
      rating: 4,
      date: '2d ago',
      type: 'Partnership',
      avatar: 'AP',
    },
    {
      name: 'Marie Tshilombo',
      email: 'm.tshilombo@unilu.ac.cd',
      message:
        'Great to see the training programs for local youth. Can we collaborate on internship placements?',
      rating: 5,
      date: '3d ago',
      type: 'Contact Form',
      avatar: 'MT',
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <i
        key={i}
        className={`ri-star-${i < rating ? 'fill' : 'line'} text-xs ${
          i < rating ? 'text-yellow-500' : darkMode ? 'text-gray-600' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Contact Form':
        return darkMode ? 'text-red-400 bg-red-600/20' : 'text-red-600 bg-red-50';
      case 'Inquiry':
        return darkMode ? 'text-gray-300 bg-gray-600' : 'text-gray-700 bg-gray-100';
      case 'Feedback':
        return darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-50';
      case 'Partnership':
        return darkMode ? 'text-gray-400 bg-gray-600' : 'text-gray-600 bg-gray-100';
      default:
        return darkMode ? 'text-gray-400 bg-gray-600' : 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div
      className={`rounded-lg p-6 border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <h2
          className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
          style={{ fontFamily: 'Merriweather, serif' }}
        >
          Recent Feedback
        </h2>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-md ${
            darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
          }`}
        >
          {feedbacks.length} new
        </span>
      </div>

      <div className="space-y-4">
        {feedbacks.map((fb, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              darkMode
                ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">{fb.avatar}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {fb.name}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-md flex-shrink-0 ${getTypeColor(
                        fb.type
                      )}`}
                    >
                      {fb.type}
                    </span>
                  </div>
                  <span
                    className={`text-xs flex-shrink-0 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    {fb.date}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 mt-1">{renderStars(fb.rating)}</div>

                <p
                  className={`text-sm mt-2 leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {fb.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentFeedback;
