/**
 * Seeds Postgres with the maison's catalog, promos and default settings.
 *
 *   export DATABASE_URL="postgres://user:pass@host:5432/aurion"
 *   npx tsx server/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { BRANDS_SEED, CATEGORIES_SEED, PRODUCTS_SEED, PROMOS_SEED } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const b of BRANDS_SEED) {
    await prisma.brand.upsert({ where: { slug: b.slug }, create: b, update: b });
  }
  for (const c of CATEGORIES_SEED) {
    await prisma.category.upsert({ where: { name: c.name }, create: c, update: c });
  }
  for (const p of PRODUCTS_SEED) {
    const brand = await prisma.brand.findUnique({ where: { slug: p.brandSlug } });
    const category = await prisma.category.findUnique({ where: { name: p.categoryName } });
    if (!brand || !category) continue;
    const { brandSlug, categoryName, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: rest.slug },
      create: { ...rest, brandId: brand.id, categoryId: category.id },
      update: { ...rest, brandId: brand.id, categoryId: category.id },
    });
  }
  for (const promo of PROMOS_SEED) {
    await prisma.promo.upsert({ where: { code: promo.code }, create: promo, update: promo });
  }
  console.log(`Seeded: ${BRANDS_SEED.length} brands, ${CATEGORIES_SEED.length} categories, ${PRODUCTS_SEED.length} products, ${PROMOS_SEED.length} promos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
