import { create } from 'zustand';
import type { Announcement } from '@/types';
import { logger } from '@/lib/logger';

interface AnnouncementStore {
  announcements: Announcement[];
  currentAnnouncement: Announcement | null;

  // Fetchers
  fetchAnnouncements: () => void;
  fetchAnnouncement: (id: string) => Announcement | null;

  // Selectors (no state updates)
  getAnnouncementsByTeam: (teamId: string) => Announcement[];

  // Mutations
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => Announcement | null;
  updateAnnouncement: (id: string, updates: Partial<Omit<Announcement, 'id' | 'created_at'>>) => boolean;
  deleteAnnouncement: (id: string) => boolean;
  togglePin: (id: string) => boolean;

  // Utils
  setCurrentAnnouncement: (announcement: Announcement | null) => void;
}

export const useAnnouncementStore = create<AnnouncementStore>((set, get) => ({
  announcements: [],
  currentAnnouncement: null,

  fetchAnnouncements: () => {
    try {
      const stored = localStorage.getItem('goodlab_announcements');
      const announcements = stored ? JSON.parse(stored) : [];
      set({ announcements });
    } catch (error) {
      logger.error('Failed to load announcements', {
        error: error instanceof Error ? error.message : String(error)
      });
      // Clear corrupted data and reset to empty array
      localStorage.removeItem('goodlab_announcements');
      set({ announcements: [] });
    }
  },

  getAnnouncementsByTeam: (teamId: string) => {
    const { announcements } = get();
    return announcements
      .filter((a) => a.team_id === teamId)
      .sort((a, b) => {
        // 고정된 공지사항이 먼저, 그 다음 최신순
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  },

  fetchAnnouncement: (id: string) => {
    const { announcements } = get();
    const announcement = announcements.find((a) => a.id === id) || null;
    if (announcement) {
      set({ currentAnnouncement: announcement });
    }
    return announcement;
  },

  createAnnouncement: (announcementData) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { announcements } = get();
    const updatedAnnouncements = [...announcements, newAnnouncement];

    localStorage.setItem('goodlab_announcements', JSON.stringify(updatedAnnouncements));
    set({ announcements: updatedAnnouncements });

    return newAnnouncement;
  },

  updateAnnouncement: (id, updates) => {
    const { announcements } = get();
    const index = announcements.findIndex((a) => a.id === id);

    if (index === -1) return false;

    const updatedAnnouncement = {
      ...announcements[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const updatedAnnouncements = [...announcements];
    updatedAnnouncements[index] = updatedAnnouncement;

    localStorage.setItem('goodlab_announcements', JSON.stringify(updatedAnnouncements));
    set({ announcements: updatedAnnouncements });

    if (get().currentAnnouncement?.id === id) {
      set({ currentAnnouncement: updatedAnnouncement });
    }

    return true;
  },

  deleteAnnouncement: (id) => {
    const { announcements } = get();
    const updatedAnnouncements = announcements.filter((a) => a.id !== id);

    localStorage.setItem('goodlab_announcements', JSON.stringify(updatedAnnouncements));
    set({ announcements: updatedAnnouncements });

    if (get().currentAnnouncement?.id === id) {
      set({ currentAnnouncement: null });
    }

    return true;
  },

  togglePin: (id) => {
    const { announcements } = get();
    const announcement = announcements.find((a) => a.id === id);

    if (!announcement) return false;

    return get().updateAnnouncement(id, { pinned: !announcement.pinned });
  },

  setCurrentAnnouncement: (announcement) => {
    set({ currentAnnouncement: announcement });
  },
}));
