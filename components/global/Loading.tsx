import React from "react";

const Loading = () => {
  return (
    <div className='flex items-center justify-center h-64'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-300'></div>
    </div>
  );
};

export default Loading;
