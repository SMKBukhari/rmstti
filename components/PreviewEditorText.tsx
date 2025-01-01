"use client";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}

const Preview = ({ value }: PreviewProps) => {
  return (
    <div className='bg-background'>
      <ReactQuill value={value} readOnly theme='bubble' />
    </div>
  );
};

export default Preview;
