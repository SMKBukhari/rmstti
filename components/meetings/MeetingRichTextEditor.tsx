"use client";

import type React from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Highlighter,
  CheckSquare,
  Palette,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MeetingRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

const MeetingRichTextEditor: React.FC<MeetingRichTextEditorProps> = ({
  content,
  onChange,
  placeholder = "Start typing your notes...",
  editable = true,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Add mounted state

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-5",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-5",
          },
        },
      }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextStyle,
      Color,
    ],
    content,
    immediatelyRender: false,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  if (!isMounted || !editor) {
    // Check isMounted
    return null;
  }

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
  ];

  return (
    <div className='border rounded-lg'>
      {editable && (
        <div className='border-b p-2 flex flex-wrap items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive("bold")
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Bold className='h-4 w-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive("italic")
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Italic className='h-4 w-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={
              editor.isActive("strike")
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Strikethrough className='h-4 w-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={
              editor.isActive("code")
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Code className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='h-6' />

          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 })
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Heading1 className='h-4 w-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 })
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Heading2 className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='h-6' />

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList")
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <List className='h-4 w-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive("orderedList")
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <ListOrdered className='h-4 w-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={
              editor.isActive("taskList")
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <CheckSquare className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='h-6' />

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={
              editor.isActive("blockquote")
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Quote className='h-4 w-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={
              editor.isActive("highlight")
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            <Highlighter className='h-4 w-4' />
          </Button>

          <div className='relative'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Palette className='h-4 w-4' />
            </Button>

            {showColorPicker && (
              <div className='absolute top-full left-0 mt-1 p-2 bg-white border rounded-lg shadow-lg z-10'>
                <div className='grid grid-cols-5 gap-1'>
                  {colors.map((color) => (
                    <motion.button
                      type='button'
                      aria-label={`Set text color to ${color}`}
                      key={color}
                      className='w-6 h-6 rounded border border-gray-300'
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator orientation='vertical' className='h-6' />

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className='h-4 w-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className='h-4 w-4' />
          </Button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className='min-h-[200px] max-h-[400px] overflow-y-auto'
        placeholder={placeholder}
      />

      {editable && (
        <div className='border-t p-2 text-xs text-gray-500'>
          Use <kbd className='px-1 py-0.5 bg-gray-100 rounded'>Ctrl+B</kbd> for
          bold,
          <kbd className='px-1 py-0.5 bg-gray-100 rounded ml-1'>Ctrl+I</kbd> for
          italic,
          <kbd className='px-1 py-0.5 bg-gray-100 rounded ml-1'>
            Ctrl+Shift+X
          </kbd>{" "}
          for strikethrough
        </div>
      )}
    </div>
  );
};

export default MeetingRichTextEditor;
