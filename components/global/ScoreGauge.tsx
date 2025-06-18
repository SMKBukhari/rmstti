"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  maxScore: number;
  isScoreVisible?: boolean;
  text?: string;
}

export const ScoreGauge = ({
  score,
  maxScore,
  isScoreVisible,
  text,
}: ScoreGaugeProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getScoreLabel = (percentage: number) => {
    if (percentage > 90.01) return "Excellent";
    if (percentage > 75.34) return "Very Good";
    if (percentage > 59.34) return "Good";
    if (percentage > 30.01) return "Fair";
    return "Poor (Needs Improvement)";
  };

  const getScoreColor = (percentage: number) => {
    if (percentage > 90) return "text-green-600 stroke-green-500"; // Excellent
    if (percentage > 75.33) return "text-blue-600 stroke-blue-500"; // Very Good
    if (percentage > 59.33) return "text-purple-600 stroke-purple-500"; // Good
    if (percentage > 30) return "text-yellow-600 stroke-yellow-500"; // Average
    return "text-red-600 stroke-red-500"; // Poor
  };

  // Create array of lines for the gauge background
  const gaugeLines = Array.from({ length: 40 }, (_, i) => {
    const rotation = (i * 360) / 40;
    const color =
      i / 40 <= percentage / 100 ? getScoreColor(percentage) : "text-gray-200";
    return (
      <motion.line
        key={i}
        x1='50'
        y1='10'
        x2='50'
        y2='15'
        className={`${color} stroke-[2.5]`}
        transform={`rotate(${rotation} 50 50)`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.02 }}
      />
    );
  });

  return (
    <div className='w-full max-w-xs mx-auto p-6 bg-background rounded-xl'>
      <h3
        className={`text-xl font-bold text-center mb-2 ${getScoreColor(
          percentage
        )}`}
      >
        {getScoreLabel(percentage)}
      </h3>

      <div className='relative h-48 w-48 mx-auto'>
        <svg className='w-full h-full' viewBox='0 0 100 100'>
          {gaugeLines}

          {/* Score circle */}
          <motion.circle
            className={`${getScoreColor(percentage)} fill-white`}
            r='35'
            cx='50'
            cy='50'
            strokeWidth='2'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          />
        </svg>

        {/* Score display */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {isScoreVisible && (
              <>
                <span
                  className={`text-4xl font-bold ${getScoreColor(percentage)}`}
                >
                  {score}
                </span>
                <span className='text-gray-500 text-lg'>{` / ${maxScore}`}</span>
              </>
            )}
            {text && <p className='mt-2 text-gray-600 text-sm'>{text}</p>}
            <span>
              <span
                className={` ${
                  isScoreVisible
                    ? "text-gray-500"
                    : `text-2xl font-bold ${getScoreColor(percentage)}`
                }`}
              >
                {" "}
                ({percentage.toFixed(2)}%)
              </span>
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
