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
import { petService } from "@/domain/pet/petService";

interface AppState {
  // Data
  children: Child[];
  medicines: Medicine[];
  doses: Dose[];
  activeChildId: string | null;

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

  // Actions: Pet
  getPet: (childId: string) => Pet | null;
  createPet: (childId: string, petType: PetType, name: string) => Pet;
  feedPet: (childId: string) => Pet | null;
  playWithPet: (childId: string) => Pet | null;
}

export const useAppStore = create<AppState>((set, get) => ({
  children: [],
  medicines: [],
  doses: [],
  activeChildId: null,

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

  getPet: (childId) => {
    return petService.getPet(childId);
  },

  createPet: (childId, petType, name) => {
    return petService.createPet(childId, petType, name);
  },

  feedPet: (childId) => {
    const pet = petService.feedPet(childId);
    if (pet) {
      rewardService.spendStars(childId, petService.getFeedCost());
    }
    return pet;
  },

  playWithPet: (childId) => {
    return petService.playWithPet(childId);
  },
}));
