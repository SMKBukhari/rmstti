"use client";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

const Editor = ({ onChange, value }: EditorProps) => {
  return (
    <div className='bg-background'>
      <ReactQuill theme='snow' value={value} onChange={onChange} />
    </div>
  );
};

export default Editor;
