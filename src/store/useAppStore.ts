"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  Child,
  Medicine,
  Dose,
  Rewards,
  Pet,
  PetType,
  AgeGroup,
} from "@/types";
import { childRepository } from "@/data/repositories/childRepository";
import { medicineRepository } from "@/data/repositories/medicineRepository";
import { doseRepository } from "@/data/repositories/doseRepository";
import { rewardsRepository } from "@/data/repositories/rewardsRepository";
import { petRepository } from "@/data/repositories/petRepository";
import { doseService } from "@/domain/dose/doseService";
import { rewardService } from "@/domain/rewards/rewardService";
import { streakService } from "@/domain/streak/streakService";
import { petService, FeedResult } from "@/domain/pet/petService";
import type { AppUser } from "@/lib/auth";

interface AppState {
  // Data
  children: Child[];
  medicines: Medicine[];
  doses: Dose[];
  activeChildId: string | null;
  activePetSlot: number;
  user: AppUser | null;

  // Actions: Auth
  setUser: (user: AppUser | null) => void;
  resetStore: () => void;

  // Actions: Children
  loadData: () => void;
  addChild: (name: string, ageGroup: AgeGroup, avatar: string) => Child;
  deleteChild: (id: string) => void;
  setActiveChild: (id: string | null) => void;

  // Actions: Medicines
  addMedicine: (
    childId: string,
    name: string,
    dosage: string,
    scheduleTimes: string[]
  ) => Medicine;
  updateMedicine: (medicine: Medicine) => void;
  deleteMedicine: (id: string) => void;

  // Actions: Doses
  generateTodayDoses: () => void;
  completeDose: (doseId: string) => { stars: number; dose: Dose } | null;
  skipDose: (doseId: string) => void;
  getTodayDoses: (childId: string) => Dose[];

  // Actions: Rewards
  getRewards: (childId: string) => Rewards;
  getStreak: (childId: string) => { current: number; best: number };

  // Actions: Pet (multi-pet with slots)
  getPet: (childId: string, slotIndex?: number) => Pet | null;
  getPets: (childId: string) => Pet[];
  createPet: (childId: string, slotIndex: number, name: string, unlockedPets: PetType[]) => Pet;
  feedPet: (childId: string, slotIndex?: number) => FeedResult | null;
  playWithPet: (childId: string, slotIndex?: number) => Pet | null;
  setActivePetSlot: (slot: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  children: [],
  medicines: [],
  doses: [],
  activeChildId: null,
  activePetSlot: 0,
  user: null,

  setUser: (user) => {
    set({ user });
  },

  resetStore: () => {
    set({
      children: [],
      medicines: [],
      doses: [],
      activeChildId: null,
      activePetSlot: 0,
      user: null,
    });
  },

  loadData: () => {
    const children = childRepository.getAll();
    const medicines = medicineRepository.getAll();
    const doses = doseRepository.getAll();
    set({ children, medicines, doses });

    // Auto-set active child if only one exists
    if (children.length === 1 && !get().activeChildId) {
      set({ activeChildId: children[0].id });
    }
  },

  addChild: (name, ageGroup, avatar) => {
    const child: Child = {
      id: uuidv4(),
      name,
      ageGroup,
      avatar,
      createdAt: new Date().toISOString(),
    };
    childRepository.save(child);
    set((s) => ({ children: [...s.children, child] }));
    return child;
  },

  deleteChild: (id) => {
    childRepository.delete(id);
    medicineRepository.deleteByChildId(id);
    doseRepository.deleteByChildId(id);
    rewardsRepository.deleteByChildId(id);
    petRepository.deleteByChildId(id);
    set((s) => ({
      children: s.children.filter((c) => c.id !== id),
      medicines: s.medicines.filter((m) => m.childId !== id),
      doses: s.doses.filter((d) => d.childId !== id),
      activeChildId: s.activeChildId === id ? null : s.activeChildId,
    }));
  },

  setActiveChild: (id) => {
    set({ activeChildId: id });
  },

  addMedicine: (childId, name, dosage, scheduleTimes) => {
    const medicine: Medicine = {
      id: uuidv4(),
      childId,
      name,
      dosage,
      scheduleTimes,
      active: true,
      createdAt: new Date().toISOString(),
    };
    medicineRepository.save(medicine);
    set((s) => ({ medicines: [...s.medicines, medicine] }));
    return medicine;
  },

  updateMedicine: (medicine) => {
    medicineRepository.save(medicine);
    set((s) => ({
      medicines: s.medicines.map((m) =>
        m.id === medicine.id ? medicine : m
      ),
    }));
  },

  deleteMedicine: (id) => {
    medicineRepository.delete(id);
    doseRepository.deleteByMedicineId(id);
    set((s) => ({
      medicines: s.medicines.filter((m) => m.id !== id),
      doses: s.doses.filter((d) => d.medicineId !== id),
    }));
  },

  generateTodayDoses: () => {
    const medicines = medicineRepository.getAll();
    doseService.generateTodayDoses(medicines);
    const doses = doseRepository.getAll();
    set({ doses });
  },

  completeDose: (doseId) => {
    const dose = doseService.completeDose(doseId);
    if (!dose) return null;

    const stars = rewardService.grantDoseReward(dose.childId, dose);
    streakService.updateStreak(dose.childId);

    // Check if all today's doses are complete for daily bonus
    const progress = doseService.getTodayProgress(dose.childId);
    if (progress.pending === 0 && progress.total > 0 && progress.skipped === 0) {
      rewardService.grantDailyBonus(dose.childId);
    }

    set({ doses: doseRepository.getAll() });
    return { stars, dose };
  },

  skipDose: (doseId) => {
    doseService.skipDose(doseId);
    set({ doses: doseRepository.getAll() });
  },

  getTodayDoses: (childId) => {
    return doseRepository.getTodayByChildId(childId);
  },

  getRewards: (childId) => {
    return rewardService.getRewards(childId);
  },

  getStreak: (childId) => {
    return streakService.getStreak(childId);
  },

  // ── Pet actions (multi-slot) ──

  getPet: (childId, slotIndex) => {
    const slot = slotIndex ?? get().activePetSlot;
    return petService.getPet(childId, slot);
  },

  getPets: (childId) => {
    return petService.getPets(childId);
  },

  createPet: (childId, slotIndex, name, unlockedPets) => {
    return petService.createPet(childId, slotIndex, name, unlockedPets);
  },

  feedPet: (childId, slotIndex) => {
    const slot = slotIndex ?? get().activePetSlot;
    const result = petService.feedPet(childId, slot);
    if (result) {
      rewardService.spendStars(childId, petService.getFeedCost());
    }
    return result;
  },

  playWithPet: (childId, slotIndex) => {
    const slot = slotIndex ?? get().activePetSlot;
    return petService.playWithPet(childId, slot);
  },

  setActivePetSlot: (slot) => {
    set({ activePetSlot: slot });
  },
}));
