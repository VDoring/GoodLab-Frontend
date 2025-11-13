"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { TiptapEditor } from '@/components/features';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore, useDocumentStore, useRoomStore, useTeamStore } from '@/store';
import { ArrowLeft, Save, Lock } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useAuth';
import type { TiptapContent } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function DocumentEditPage() {
  useRequireAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { fetchDocument, updateDocument, checkPermission, currentDocument } = useDocumentStore();
  const { fetchRoom } = useRoomStore();
  const { fetchTeam } = useTeamStore();

  const documentId = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState<TiptapContent | undefined>();
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [room, setRoom] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);

  // Load document
  useEffect(() => {
    if (documentId) {
      const doc = fetchDocument(documentId);
      if (doc) {
        setTitle(doc.title);
        setContent(doc.content);

        // Load room and team info
        const r = fetchRoom(doc.room_id);
        setRoom(r);
        if (doc.team_id) {
          const t = fetchTeam(doc.team_id);
          setTeam(t);
        }

        // Check permission
        if (user) {
          const permission = checkPermission(documentId, user.id);
          const editable = permission === 'write' || permission === 'admin';
          setIsEditable(editable);
        }
      } else {
        toast({
          title: '문서를 찾을 수 없습니다',
          description: '문서가 삭제되었거나 접근 권한이 없습니다.',
          variant: 'destructive',
        });
        router.push('/documents');
      }
    }
  }, [documentId, user, fetchDocument, fetchRoom, fetchTeam, checkPermission, toast, router]);

  // Handle content change
  const handleContentChange = useCallback((newContent: TiptapContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!currentDocument || !user) return;

    setIsSaving(true);

    try {
      const success = updateDocument(currentDocument.id, {
        title,
        content: content!,
        last_edited_by: user.id,
      });

      if (success) {
        setHasUnsavedChanges(false);
        toast({
          title: '저장되었습니다',
          description: '문서가 성공적으로 저장되었습니다.',
        });
      } else {
        toast({
          title: '저장 실패',
          description: '문서 저장에 실패했습니다.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '오류',
        description: '문서 저장 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [currentDocument, user, title, content, updateDocument, toast]);

  // Auto-save (debounced)
  useEffect(() => {
    if (!hasUnsavedChanges || !isEditable) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [content, title, hasUnsavedChanges, isEditable, handleSave]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (!currentDocument) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">문서를 불러오는 중...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push('/documents')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              문서 목록
            </Button>

            <div className="flex items-center gap-2">
              {!isEditable && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4" />
                  읽기 전용
                </div>
              )}

              {isEditable && (
                <>
                  {hasUnsavedChanges && (
                    <span className="text-sm text-gray-600">저장되지 않은 변경사항이 있습니다</span>
                  )}
                  <Button onClick={handleSave} disabled={isSaving || !hasUnsavedChanges}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? '저장 중...' : '저장'}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{room?.title}</span>
            {team && (
              <>
                <span>/</span>
                <span>{team.name}</span>
              </>
            )}
          </div>

          {/* Title */}
          {isEditable ? (
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="text-3xl font-bold border-none focus-visible:ring-0 px-0"
              placeholder="문서 제목"
            />
          ) : (
            <h1 className="text-3xl font-bold">{title}</h1>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>생성: {new Date(currentDocument.created_at).toLocaleString('ko-KR')}</span>
            <span>•</span>
            <span>수정: {new Date(currentDocument.updated_at).toLocaleString('ko-KR')}</span>
            {currentDocument.last_edited_by && (
              <>
                <span>•</span>
                <span>최종 편집자: {currentDocument.last_edited_by}</span>
              </>
            )}
          </div>
        </div>

        {/* Editor */}
        <TiptapEditor
          content={content}
          onChange={handleContentChange}
          editable={isEditable}
          placeholder={isEditable ? '내용을 입력하세요...' : '내용이 없습니다'}
        />

        {/* Footer */}
        {isEditable && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <p>자동 저장이 활성화되어 있습니다 (2초 간격)</p>
            {hasUnsavedChanges && <p className="text-orange-600">변경사항 저장 중...</p>}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
