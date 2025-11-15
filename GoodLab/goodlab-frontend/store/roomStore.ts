import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Room } from '@/types';
import { roomDB, roomMemberDB, initializeMockDB } from '@/lib/mock-db';

interface RoomState {
  currentRoom: Room | null;
  rooms: Room[];
  isLoading: boolean;
  error: string | null;

  // 방 목록 불러오기
  fetchRooms: () => void;

  // 특정 방 불러오기
  fetchRoom: (id: string) => Room | null;

  // 방 생성
  createRoom: (data: {
    title: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    created_by: string;
  }) => Room;

  // 방 수정
  updateRoom: (id: string, data: Partial<Room>) => boolean;

  // 방 삭제
  deleteRoom: (id: string) => boolean;

  // 현재 방 설정
  setCurrentRoom: (room: Room | null) => void;

  // 사용자의 방 목록 가져오기
  getUserRooms: (userId: string) => Room[];

  // 방에 멤버 추가
  addMemberToRoom: (roomId: string, userId: string) => void;

  // 방에서 멤버 제거
  removeMemberFromRoom: (roomId: string, userId: string) => void;
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      currentRoom: null,
      rooms: [],
      isLoading: false,
      error: null,

      fetchRooms: () => {
        initializeMockDB();
        const rooms = roomDB.getAll();
        set({ rooms, error: null });
      },

      fetchRoom: (id: string) => {
        initializeMockDB();
        const room = roomDB.getById(id);
        if (room) {
          set({ currentRoom: room });
        }
        return room;
      },

      createRoom: (data) => {
        initializeMockDB();
        const newRoom = roomDB.create(data);

        // 생성자를 방 멤버로 추가
        roomMemberDB.add(newRoom.id, data.created_by);

        set((state) => ({
          rooms: [...state.rooms, newRoom],
          error: null,
        }));

        return newRoom;
      },

      updateRoom: (id, data) => {
        initializeMockDB();
        const updated = roomDB.update(id, data);
        if (!updated) {
          set({ error: '방을 찾을 수 없습니다.' });
          return false;
        }

        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === id ? updated : room
          ),
          currentRoom: state.currentRoom?.id === id ? updated : state.currentRoom,
          error: null,
        }));

        return true;
      },

      deleteRoom: (id) => {
        initializeMockDB();
        const success = roomDB.delete(id);
        if (!success) {
          set({ error: '방을 찾을 수 없습니다.' });
          return false;
        }

        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== id),
          currentRoom: state.currentRoom?.id === id ? null : state.currentRoom,
          error: null,
        }));

        return true;
      },

      setCurrentRoom: (room) => set({ currentRoom: room }),

      getUserRooms: (userId: string) => {
        initializeMockDB();
        const roomMembers = roomMemberDB.getByUserId(userId);
        const userRooms = roomMembers
          .map((rm) => roomDB.getById(rm.room_id))
          .filter((room): room is Room => room !== null);

        // State를 덮어쓰지 않고 단순히 필터링된 결과만 반환
        return userRooms;
      },

      addMemberToRoom: (roomId: string, userId: string) => {
        initializeMockDB();
        roomMemberDB.add(roomId, userId);
      },

      removeMemberFromRoom: (roomId: string, userId: string) => {
        initializeMockDB();
        roomMemberDB.remove(roomId, userId);
      },
    }),
    {
      name: 'room-storage',
      partialize: (state) => ({
        currentRoom: state.currentRoom,
      }),
    }
  )
);
