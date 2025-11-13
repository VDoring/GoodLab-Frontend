"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  CodeSquare,
  Table as TableIcon,
  ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';
import type { TiptapContent } from '@/types';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content?: TiptapContent;
  onChange?: (content: TiptapContent) => void;
  editable?: boolean;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onChange,
  editable = true,
  placeholder = '내용을 입력하세요...',
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: content || {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [],
        },
      ],
    },
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(json as TiptapContent);
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {editable && (
        <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-200' : ''}
            type="button"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-200' : ''}
            type="button"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-gray-200' : ''}
            type="button"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'bg-gray-200' : ''}
            type="button"
          >
            <Code className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Headings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
            type="button"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
            type="button"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
            type="button"
          >
            <Heading3 className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Lists */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
            type="button"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
            type="button"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive('taskList') ? 'bg-gray-200' : ''}
            type="button"
          >
            <CheckSquare className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Blocks */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
            type="button"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
            type="button"
          >
            <CodeSquare className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            type="button"
          >
            <TableIcon className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            type="button"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            type="button"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none"
      />

      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding: 0 1rem;
          margin: 0.5em 0;
        }

        .ProseMirror ul[data-type='taskList'] {
          list-style: none;
          padding: 0;
        }

        .ProseMirror ul[data-type='taskList'] li {
          display: flex;
          align-items: start;
          gap: 0.5rem;
        }

        .ProseMirror ul[data-type='taskList'] li > label {
          flex: 0 0 auto;
          margin-top: 0.2rem;
        }

        .ProseMirror ul[data-type='taskList'] li > div {
          flex: 1 1 auto;
        }

        .ProseMirror code {
          background-color: #f3f4f6;
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          font-family: 'Courier New', Courier, monospace;
        }

        .ProseMirror pre {
          background: #1e293b;
          color: #e2e8f0;
          font-family: 'Courier New', Courier, monospace;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin: 0.5em 0;
          overflow-x: auto;
        }

        .ProseMirror pre code {
          color: inherit;
          padding: 0;
          background: none;
          font-size: 0.9em;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin: 0.5em 0;
          font-style: italic;
        }

        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0.5em 0;
          overflow: hidden;
        }

        .ProseMirror table td,
        .ProseMirror table th {
          border: 2px solid #d1d5db;
          padding: 0.5rem;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .ProseMirror table th {
          background-color: #f3f4f6;
          font-weight: bold;
          text-align: left;
        }

        .ProseMirror table .selectedCell {
          background-color: #e0f2fe;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
}
