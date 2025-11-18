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
import { DocumentMention } from './extensions/document-mention';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Upload,
  Link as LinkIcon,
  FileText,
} from 'lucide-react';
import type { TiptapContent, Document } from '@/types';
import { useEffect, useState, useRef } from 'react';
import { useDocumentStore, useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import imageCompression from 'browser-image-compression';

interface TiptapEditorProps {
  content?: TiptapContent;
  onChange?: (content: TiptapContent) => void;
  editable?: boolean;
  placeholder?: string;
  currentDocumentId?: string;
  roomId?: string;
  teamId?: string;
}

export function TiptapEditor({
  content,
  onChange,
  editable = true,
  placeholder = '내용을 입력하세요...',
  currentDocumentId,
  roomId,
  teamId,
}: TiptapEditorProps) {
  const router = useRouter();
  const { documents, fetchDocuments, checkPermission } = useDocumentStore();
  const user = useAuthStore((state) => state.user);
  const { toast } = useToast();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('upload');
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [documentSearchQuery, setDocumentSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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
        inline: false,
        allowBase64: true,
      }),
      DocumentMention.configure({
        HTMLAttributes: {
          class: 'document-mention',
        },
        renderLabel({ node }) {
          return `📄 ${node.attrs.label}`;
        },
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

  const processImageFile = async (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "파일 형식 오류",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "파일 크기 초과",
        description: "이미지 크기는 10MB 이하여야 합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Compress image if it's larger than 500KB
      let processedFile = file;
      if (file.size > 500 * 1024) {
        toast({
          title: "이미지 압축 중",
          description: "이미지를 압축하고 있습니다...",
        });

        const options = {
          maxSizeMB: 0.5, // Max file size: 500KB
          maxWidthOrHeight: 1920, // Max dimension
          useWebWorker: true,
          fileType: file.type,
        };

        processedFile = await imageCompression(file, options);

        toast({
          title: "압축 완료",
          description: `이미지가 ${(file.size / 1024 / 1024).toFixed(2)}MB에서 ${(processedFile.size / 1024 / 1024).toFixed(2)}MB로 압축되었습니다.`,
        });
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (editor) {
          editor.chain().focus().setImage({ src: base64 }).run();
          setImageDialogOpen(false);
          setImageUrl('');
        }
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error('Image compression error:', error);
      toast({
        title: "압축 실패",
        description: "이미지 압축 중 오류가 발생했습니다. 원본 이미지를 사용합니다.",
        variant: "destructive",
      });

      // Fallback to original file
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (editor) {
          editor.chain().focus().setImage({ src: base64 }).run();
          setImageDialogOpen(false);
          setImageUrl('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editable) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      return; // No image files, ignore
    }

    // Process the first image file
    processImageFile(imageFiles[0]);
  };

  const handleImageUrlInsert = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "입력 오류",
        description: "이미지 URL을 입력하세요.",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      toast({
        title: "URL 형식 오류",
        description: "올바른 URL을 입력하세요.",
        variant: "destructive",
      });
      return;
    }

    if (editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageDialogOpen(false);
      setImageUrl('');
    }
  };

  const handleDocumentInsert = (document: Document) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'documentMention',
          attrs: {
            id: document.id,
            label: document.title,
          },
        })
        .run();
      setDocumentDialogOpen(false);
      setDocumentSearchQuery('');
    }
  };

  // Filter documents for selection (exclude current document)
  const availableDocuments = documents.filter((doc) => {
    if (currentDocumentId && doc.id === currentDocumentId) return false;
    if (documentSearchQuery) {
      return doc.title.toLowerCase().includes(documentSearchQuery.toLowerCase());
    }
    return true;
  });

  // Add click handler for document mentions
  useEffect(() => {
    if (!editor || !user) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mentionElement = target.closest('[data-document-mention]');

      if (mentionElement) {
        const docId = mentionElement.getAttribute('data-id');
        if (docId) {
          // Verify document exists before navigation
          const documentExists = documents.some(doc => doc.id === docId);
          if (!documentExists) {
            toast({
              title: "문서를 찾을 수 없음",
              description: "해당 문서가 존재하지 않습니다.",
              variant: "destructive",
            });
            return;
          }

          // Check permission before navigation
          const permission = checkPermission(docId, user.id);
          if (!permission) {
            toast({
              title: "접근 권한 없음",
              description: "이 문서에 접근할 권한이 없습니다.",
              variant: "destructive",
            });
            return;
          }

          // Navigate to document
          router.push(`/documents/${docId}`);
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleClick);

    return () => {
      editorElement.removeEventListener('click', handleClick);
    };
  }, [editor, router, documents, user, checkPermission, toast]);

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update editor editable state when prop changes
  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  if (!editor) {
    return null;
  }

  return (
    <>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setImageDialogOpen(true)}
            type="button"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDocumentDialogOpen(true)}
            type="button"
            title="문서 링크 삽입"
          >
            <FileText className="w-4 h-4" />
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

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative"
      >
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none"
        />
      </div>

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
          display: block;
        }

        .document-mention {
          background-color: #dbeafe;
          border: 1px solid #3b82f6;
          border-radius: 0.25rem;
          padding: 0.125rem 0.375rem;
          color: #1e40af;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .document-mention:hover {
          background-color: #bfdbfe;
          border-color: #2563eb;
          color: #1e3a8a;
        }

        .document-mention-node {
          user-select: all;
        }
      `}</style>
      </div>

      {/* Image Insert Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>이미지 삽입</DialogTitle>
            <DialogDescription>
              파일을 업로드하거나 이미지 URL을 입력하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tab Selection */}
            <div className="flex gap-2 border-b">
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  imageMode === 'upload'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setImageMode('upload')}
                type="button"
              >
                <Upload className="w-4 h-4 inline-block mr-1" />
                파일 업로드
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  imageMode === 'url'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setImageMode('url')}
                type="button"
              >
                <LinkIcon className="w-4 h-4 inline-block mr-1" />
                URL 입력
              </button>
            </div>

            {/* Upload Mode */}
            {imageMode === 'upload' && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block"
                  >
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">
                      클릭하여 이미지를 선택하세요
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (최대 10MB)
                    </p>
                  </label>
                </div>
              </div>
            )}

            {/* URL Mode */}
            {imageMode === 'url' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="image-url">이미지 URL</Label>
                  <Input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleImageUrlInsert();
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setImageDialogOpen(false);
                setImageUrl('');
              }}
            >
              취소
            </Button>
            {imageMode === 'url' && (
              <Button
                type="button"
                onClick={handleImageUrlInsert}
              >
                삽입
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Link Insert Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>문서 링크 삽입</DialogTitle>
            <DialogDescription>
              연결할 문서를 선택하세요. 클릭하면 해당 문서로 이동합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Input */}
            <div>
              <Input
                type="text"
                placeholder="문서 검색..."
                value={documentSearchQuery}
                onChange={(e) => setDocumentSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Document List */}
            <ScrollArea className="h-[300px] border rounded-md">
              {availableDocuments.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {documentSearchQuery
                    ? '검색 결과가 없습니다.'
                    : '연결할 수 있는 문서가 없습니다.'}
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {availableDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleDocumentInsert(doc)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-start gap-3 border border-transparent hover:border-gray-200"
                      type="button"
                    >
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {doc.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {doc.team_id ? '팀 문서' : '방 문서'} •{' '}
                          {new Date(doc.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDocumentDialogOpen(false);
                setDocumentSearchQuery('');
              }}
            >
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
