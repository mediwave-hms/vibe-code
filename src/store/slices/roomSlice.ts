import { StateCreator } from 'zustand';
import { Room, Bed } from '../../types/models';
import { RoomType, RoomStatus, BedStatus } from '../../types/enums';

export type RoomSlice = {
  rooms: Room[];
  beds: Bed[];
  selectedRoomId: string | null;
  selectedBedId: string | null;
  addRoom: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'currentOccupancy'> & { currentOccupancy?: number }) => Room;
  updateRoom: (id: string, patch: Partial<Room>) => Room | null;
  deleteRoom: (id: string) => boolean;
  getRoomById: (id: string) => Room | undefined;
  getAvailableRooms: (type?: RoomType) => Room[];
  getRoomsByType: (type: RoomType) => Room[];
  getRoomsByStatus: (status: RoomStatus) => Room[];
  getRoomsByFloor: (floor: string) => Room[];
  searchRooms: (query: string) => Room[];
  addBed: (bed: Omit<Bed, 'id' | 'createdAt' | 'updatedAt'>) => Bed;
  updateBed: (id: string, patch: Partial<Bed>) => Bed | null;
  deleteBed: (id: string) => boolean;
  getBedById: (id: string) => Bed | undefined;
  getRoomBeds: (roomId: string) => Bed[];
  getAvailableBeds: (roomId?: string) => Bed[];
  getAvailableBedsByType: (type: RoomType) => Bed[];
  updateBedStatus: (id: string, status: BedStatus) => Bed | null;
  updateRoomStatus: (id: string, status: RoomStatus) => Room | null;
  updateRoomOccupancy: (id: string) => void;
  setSelectedRoomId: (id: string | null) => void;
  setSelectedBedId: (id: string | null) => void;
};

export const createRoomSlice: StateCreator<RoomSlice> = (set, get) => ({
  rooms: [],
  beds: [],
  selectedRoomId: null,
  selectedBedId: null,

  addRoom: (room) => {
    const now = new Date();
    const newRoom: Room = {
      ...room,
      id: `rm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      currentOccupancy: room.currentOccupancy ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ rooms: [...state.rooms, newRoom] }));
    return newRoom;
  },

  updateRoom: (id, patch) => {
    const state = get();
    const room = state.rooms.find((r: Room) => r.id === id);
    if (!room) return null;
    const updated: Room = { ...room, ...patch, updatedAt: new Date() };
    set((s) => ({
      rooms: s.rooms.map((r: Room) => (r.id === id ? updated : r)),
    }));
    return updated;
  },

  deleteRoom: (id) => {
    const state = get();
    const exists = state.rooms.some((r: Room) => r.id === id);
    if (!exists) return false;
    set((s) => ({
      rooms: s.rooms.filter((r: Room) => r.id !== id),
      beds: s.beds.filter((b: Bed) => b.roomId !== id),
      selectedRoomId: s.selectedRoomId === id ? null : s.selectedRoomId,
    }));
    return true;
  },

  getRoomById: (id) => {
    return get().rooms.find((r: Room) => r.id === id);
  },

  getAvailableRooms: (type) => {
    return get()
      .rooms.filter((r: Room) => {
        if (r.status !== RoomStatus.AVAILABLE) return false;
        if (r.currentOccupancy >= r.capacity) return false;
        if (type && r.type !== type) return false;
        return true;
      })
      .sort((a: Room, b: Room) => a.roomNumber.localeCompare(b.roomNumber));
  },

  getRoomsByType: (type) => {
    return get()
      .rooms.filter((r: Room) => r.type === type)
      .sort((a: Room, b: Room) => a.roomNumber.localeCompare(b.roomNumber));
  },

  getRoomsByStatus: (status) => {
    return get()
      .rooms.filter((r: Room) => r.status === status)
      .sort((a: Room, b: Room) => a.roomNumber.localeCompare(b.roomNumber));
  },

  getRoomsByFloor: (floor) => {
    return get()
      .rooms.filter((r: Room) => r.floor === floor)
      .sort((a: Room, b: Room) => a.roomNumber.localeCompare(b.roomNumber));
  },

  searchRooms: (query) => {
    const q = query.toLowerCase();
    return get().rooms.filter((r: Room) => {
      return (
        r.roomNumber.toLowerCase().includes(q) ||
        r.floor.toLowerCase().includes(q) ||
        (r.wing && r.wing.toLowerCase().includes(q)) ||
        r.type.toLowerCase().includes(q)
      );
    });
  },

  addBed: (bed) => {
    const now = new Date();
    const newBed: Bed = {
      ...bed,
      id: `bd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ beds: [...state.beds, newBed] }));
    get().updateRoomOccupancy(bed.roomId);
    return newBed;
  },

  updateBed: (id, patch) => {
    const state = get();
    const bed = state.beds.find((b: Bed) => b.id === id);
    if (!bed) return null;
    const updated: Bed = { ...bed, ...patch, updatedAt: new Date() };
    set((s) => ({
      beds: s.beds.map((b: Bed) => (b.id === id ? updated : b)),
    }));
    if (updated.roomId) get().updateRoomOccupancy(updated.roomId);
    if (bed.roomId && bed.roomId !== updated.roomId) get().updateRoomOccupancy(bed.roomId);
    return updated;
  },

  deleteBed: (id) => {
    const state = get();
    const bed = state.beds.find((b: Bed) => b.id === id);
    if (!bed) return false;
    set((s) => ({
      beds: s.beds.filter((b: Bed) => b.id !== id),
      selectedBedId: s.selectedBedId === id ? null : s.selectedBedId,
    }));
    get().updateRoomOccupancy(bed.roomId);
    return true;
  },

  getBedById: (id) => {
    return get().beds.find((b: Bed) => b.id === id);
  },

  getRoomBeds: (roomId) => {
    return get()
      .beds.filter((b: Bed) => b.roomId === roomId)
      .sort((a: Bed, b: Bed) => a.bedNumber.localeCompare(b.bedNumber));
  },

  getAvailableBeds: (roomId) => {
    return get()
      .beds.filter((b: Bed) => {
        if (b.status !== BedStatus.AVAILABLE) return false;
        if (roomId && b.roomId !== roomId) return false;
        return true;
      })
      .sort((a: Bed, b: Bed) => a.bedNumber.localeCompare(b.bedNumber));
  },

  getAvailableBedsByType: (type) => {
    const state = get();
    const roomsOfType = state.rooms
      .filter((r: Room) => r.type === type)
      .map((r: Room) => r.id);
    return state
      .beds.filter((b: Bed) => b.status === BedStatus.AVAILABLE && roomsOfType.includes(b.roomId))
      .sort((a: Bed, b: Bed) => a.bedNumber.localeCompare(b.bedNumber));
  },

  updateBedStatus: (id, status) => {
    const bed = get().updateBed(id, { status, updatedAt: new Date() });
    if (bed) get().updateRoomOccupancy(bed.roomId);
    return bed;
  },

  updateRoomStatus: (id, status) => {
    return get().updateRoom(id, { status, lastCleanedAt: status === RoomStatus.AVAILABLE ? new Date() : undefined, updatedAt: new Date() });
  },

  updateRoomOccupancy: (roomId) => {
    const state = get();
    const roomBeds = state.beds.filter((b: Bed) => b.roomId === roomId);
    const occupied = roomBeds.filter((b: Bed) => b.status === BedStatus.OCCUPIED).length;
    set((s) => ({
      rooms: s.rooms.map((r: Room) =>
        r.id === roomId ? { ...r, currentOccupancy: occupied, updatedAt: new Date() } : r
      ),
    }));
  },

  setSelectedRoomId: (id) => set({ selectedRoomId: id }),
  setSelectedBedId: (id) => set({ selectedBedId: id }),
});
