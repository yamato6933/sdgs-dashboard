import { create } from 'zustand';

interface StateStore {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useStateStore = create<StateStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (isOpen: boolean) => set({ sidebarOpen: isOpen }),
}));