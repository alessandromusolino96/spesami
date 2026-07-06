import { db } from "./database";
import type { Category } from "../types";

export const SPORT_CATEGORY: Category = {
  id: "cat-sport",
  name: "Sport",
  icon: "🎾",
  color: "#F97316",
  type: "expense",
  sortOrder: 4,
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-casa", name: "Casa", icon: "🏠", color: "#6366F1", type: "expense", sortOrder: 1 },
  { id: "cat-alimentari", name: "Alimentari", icon: "🛒", color: "#F59E0B", type: "expense", sortOrder: 2 },
  { id: "cat-trasporti", name: "Trasporti", icon: "🚗", color: "#3B82F6", type: "expense", sortOrder: 3 },
  SPORT_CATEGORY,
  { id: "cat-salute", name: "Salute", icon: "💊", color: "#EC4899", type: "expense", sortOrder: 5 },
  { id: "cat-abbonamenti", name: "Abbonamenti", icon: "📱", color: "#8B5CF6", type: "expense", sortOrder: 6 },
  { id: "cat-svago", name: "Svago", icon: "🍽️", color: "#EF4444", type: "expense", sortOrder: 7 },
  { id: "cat-shopping", name: "Shopping", icon: "👕", color: "#14B8A6", type: "expense", sortOrder: 8 },
  { id: "cat-viaggi", name: "Viaggi", icon: "✈️", color: "#0EA5E9", type: "expense", sortOrder: 9 },
  { id: "cat-istruzione", name: "Istruzione", icon: "📚", color: "#A855F7", type: "expense", sortOrder: 10 },
  { id: "cat-altro-spesa", name: "Altro", icon: "📦", color: "#78716C", type: "expense", sortOrder: 11 },
  { id: "cat-stipendio", name: "Stipendio", icon: "💼", color: "#059669", type: "income", sortOrder: 12 },
  { id: "cat-extra", name: "Extra", icon: "✨", color: "#10B981", type: "income", sortOrder: 13 },
  { id: "cat-rimborsi", name: "Rimborsi", icon: "↩️", color: "#22C55E", type: "income", sortOrder: 14 },
  { id: "cat-altro-entrata", name: "Altro", icon: "💰", color: "#64748B", type: "income", sortOrder: 15 },
];

export async function seedCategoriesIfEmpty(): Promise<void> {
  const count = await db.categories.count();
  if (count === 0) {
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
    return;
  }

  const sportExists = await db.categories.get(SPORT_CATEGORY.id);
  if (sportExists) {
    if (sportExists.icon !== SPORT_CATEGORY.icon) {
      await db.categories.update(SPORT_CATEGORY.id, { icon: SPORT_CATEGORY.icon });
    }
    return;
  }

  await db.transaction("rw", db.categories, async () => {
    const toShift = await db.categories.filter((c) => c.sortOrder >= SPORT_CATEGORY.sortOrder).toArray();
    for (const category of toShift) {
      await db.categories.update(category.id, { sortOrder: category.sortOrder + 1 });
    }
    await db.categories.add(SPORT_CATEGORY);
  });
}
