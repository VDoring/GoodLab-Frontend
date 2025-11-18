import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Document, DocumentPermission, DocumentPermissionLevel, TiptapContent } from '@/types';
import { roomMemberDB, teamMemberDB } from '@/lib/mock-db';
import { logger } from '@/lib/logger';

// Helper functions to access localStorage
const getDocumentsDB = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('goodlab_documents');
  return stored ? JSON.parse(stored) : [];
};

const saveDocumentsDB = (documents: Document[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('goodlab_documents', JSON.stringify(documents));
  }
};

const getPermissionsDB = (): DocumentPermission[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('goodlab_document_permissions');
  return stored ? JSON.parse(stored) : [];
};

const savePermissionsDB = (permissions: DocumentPermission[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('goodlab_document_permissions', JSON.stringify(permissions));
  }
};

interface DocumentState {
  currentDocument: Document | null;
  documents: Document[];
  isLoading: boolean;
  error: string | null;

  // 문서 목록 불러오기
  fetchDocuments: () => void;

  // 특정 문서 불러오기
  fetchDocument: (id: string) => Document | null;

  // 방의 문서 목록 가져오기
  getDocumentsByRoom: (roomId: string) => Document[];

  // 팀의 문서 목록 가져오기
  getDocumentsByTeam: (teamId: string) => Document[];

  // 사용자가 접근 가능한 문서 목록
  getUserDocuments: (userId: string, roomIds: string[], teamIds: string[]) => Document[];

  // 문서 생성
  createDocument: (data: {
    room_id: string;
    team_id?: string;
    title: string;
    content?: TiptapContent;
    created_by: string;
  }) => Document;

  // 문서 수정
  updateDocument: (id: string, data: Partial<Document>) => boolean;

  // 문서 삭제
  deleteDocument: (id: string) => boolean;

  // 현재 문서 설정
  setCurrentDocument: (document: Document | null) => void;

  // 문서 권한 확인
  checkPermission: (documentId: string, userId: string) => DocumentPermissionLevel | null;

  // 문서 권한 추가
  addPermission: (documentId: string, userId: string, permission: DocumentPermissionLevel) => void;

  // 문서 권한 수정
  updatePermission: (documentId: string, userId: string, permission: DocumentPermissionLevel) => void;

  // 문서 권한 제거
  removePermission: (documentId: string, userId: string) => void;

  // 문서의 권한 목록 가져오기
  getDocumentPermissions: (documentId: string) => DocumentPermission[];
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      currentDocument: null,
      documents: [],
      isLoading: false,
      error: null,

      fetchDocuments: () => {
        const documents = getDocumentsDB();
        set({ documents, isLoading: false });
      },

      fetchDocument: (id: string) => {
        const documents = getDocumentsDB();
        const document = documents.find(doc => doc.id === id);
        if (document) {
          set({ currentDocument: document });
          return document;
        }
        return null;
      },

      getDocumentsByRoom: (roomId: string) => {
        const documents = getDocumentsDB();
        return documents.filter(doc => doc.room_id === roomId);
      },

      getDocumentsByTeam: (teamId: string) => {
        const documents = getDocumentsDB();
        return documents.filter(doc => doc.team_id === teamId);
      },

      getUserDocuments: (userId: string, roomIds: string[], teamIds: string[]) => {
        const documents = getDocumentsDB();
        const permissions = getPermissionsDB();
        return documents.filter(doc => {
          // 사용자가 속한 방의 문서
          if (roomIds.includes(doc.room_id)) {
            // 팀이 없으면 (방 전체 문서) 접근 가능
            if (!doc.team_id) return true;
            // 팀 문서는 해당 팀에 속해야 함
            if (teamIds.includes(doc.team_id)) return true;
          }
          // 생성자는 항상 접근 가능
          if (doc.created_by === userId) return true;
          // 권한이 있으면 접근 가능
          const permission = permissions.find(
            p => p.document_id === doc.id && p.user_id === userId
          );
          if (permission) return true;
          return false;
        });
      },

      createDocument: (data) => {
        const documents = getDocumentsDB();
        const newDocument: Document = {
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          room_id: data.room_id,
          team_id: data.team_id,
          title: data.title,
          content: data.content || {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: []
              }
            ]
          },
          created_by: data.created_by,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_edited_by: data.created_by,
        };

        documents.push(newDocument);
        saveDocumentsDB(documents);
        set({ documents });
        return newDocument;
      },

      updateDocument: (id: string, data: Partial<Document>) => {
        try {
          const documents = getDocumentsDB();
          const index = documents.findIndex(doc => doc.id === id);
          if (index === -1) return false;

          documents[index] = {
            ...documents[index],
            ...data,
            updated_at: new Date().toISOString(),
          };

          saveDocumentsDB(documents);
          set({ documents });

          // 현재 문서 업데이트
          if (get().currentDocument?.id === id) {
            set({ currentDocument: documents[index] });
          }

          return true;
        } catch (error) {
          logger.error('Failed to update document', {
            documentId: id,
            error: error instanceof Error ? error.message : String(error)
          });
          // localStorage quota exceeded 에러 처리 - 에러를 throw하여 호출자가 처리하도록 함
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            const quotaError = new Error('저장 공간이 부족합니다. 이미지 크기를 줄이거나 일부 문서를 삭제해주세요.\n\n권장사항:\n1. 이미지를 압축하여 다시 업로드\n2. 불필요한 문서 삭제\n3. 이미지 URL 링크 사용');
            quotaError.name = 'QuotaExceededError';
            throw quotaError;
          }
          return false;
        }
      },

      deleteDocument: (id: string) => {
        const documents = getDocumentsDB();
        const permissions = getPermissionsDB();
        const index = documents.findIndex(doc => doc.id === id);
        if (index === -1) return false;

        documents.splice(index, 1);
        saveDocumentsDB(documents);
        set({ documents });

        // 현재 문서가 삭제된 경우
        if (get().currentDocument?.id === id) {
          set({ currentDocument: null });
        }

        // 관련 권한도 삭제
        const newPermissions = permissions.filter(p => p.document_id !== id);
        savePermissionsDB(newPermissions);

        return true;
      },

      setCurrentDocument: (document: Document | null) => {
        set({ currentDocument: document });
      },

      checkPermission: (documentId: string, userId: string) => {
        // 문서 찾기
        const documents = getDocumentsDB();
        const document = documents.find(doc => doc.id === documentId);
        if (!document) return null;

        // 생성자는 admin 권한
        if (document.created_by === userId) return 'admin';

        // 명시적 권한 DB 확인
        const permissions = getPermissionsDB();
        const permission = permissions.find(
          p => p.document_id === documentId && p.user_id === userId
        );
        if (permission) return permission.permission;

        // 방/팀 멤버십 확인
        // 방 멤버인지 확인
        const isRoomMember = roomMemberDB.getByRoomId(document.room_id).some(
          member => member.user_id === userId
        );
        if (!isRoomMember) return null; // 방 멤버가 아니면 접근 불가

        // 팀 문서인 경우
        if (document.team_id) {
          // 팀 멤버인지 확인
          const isTeamMember = teamMemberDB.getByTeamId(document.team_id).some(
            member => member.user_id === userId
          );
          // 팀 멤버면 write 권한, 아니면 접근 불가
          return isTeamMember ? 'write' : null;
        }

        // 방 문서 (team_id 없음)인 경우 - 방 멤버면 read 권한
        return 'read';
      },

      addPermission: (documentId: string, userId: string, permission: DocumentPermissionLevel) => {
        const permissions = getPermissionsDB();
        const newPermission: DocumentPermission = {
          id: `perm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          document_id: documentId,
          user_id: userId,
          permission,
        };

        permissions.push(newPermission);
        savePermissionsDB(permissions);
      },

      updatePermission: (documentId: string, userId: string, permission: DocumentPermissionLevel) => {
        const permissions = getPermissionsDB();
        const index = permissions.findIndex(
          p => p.document_id === documentId && p.user_id === userId
        );

        if (index !== -1) {
          permissions[index].permission = permission;
          savePermissionsDB(permissions);
        }
      },

      removePermission: (documentId: string, userId: string) => {
        const permissions = getPermissionsDB();
        const newPermissions = permissions.filter(
          p => !(p.document_id === documentId && p.user_id === userId)
        );
        savePermissionsDB(newPermissions);
      },

      getDocumentPermissions: (documentId: string) => {
        const permissions = getPermissionsDB();
        return permissions.filter(p => p.document_id === documentId);
      },
    }),
    {
      name: 'document-storage',
      partialize: (state) => ({
        currentDocument: state.currentDocument,
      }),
    }
  )
);
