/**
 * AURION back-of-house API — Express + Prisma + Postgres.
 *
 *   export DATABASE_URL="postgres://user:pass@host:5432/aurion"
 *   npx prisma migrate deploy
 *   npx tsx server/seed.ts
 *   npx tsx server/index.ts          # listens on :4000
 *
 * The storefront reads VITE_API_URL at build time, or a runtime URL
 * pasted under Dashboard → Settings → "Database connection".
 */
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `item-${Date.now().toString(36)}`;

const hash = (pass: string) => crypto.createHash("sha256").update(pass).digest("hex");

/* ---------------- health ---------------- */

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: "connected", at: new Date().toISOString() });
  } catch {
    res.status(500).json({ ok: false, db: "unreachable" });
  }
});

/* ---------------- catalog ---------------- */

app.get("/api/products", async (_req, res) => {
  const rows = await prisma.product.findMany({
    where: { active: true },
    include: { brand: { select: { name: true } }, category: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });
  res.json(
    rows.map((p) => ({
      id: p.slug,
      name: p.name,
      brand: p.brand.name,
      category: p.category.name,
      price: p.price,
      was: p.was ?? undefined,
      tag: p.tag ?? undefined,
      blurb: p.blurb,
      specs: p.specs,
      img: p.img,
    }))
  );
});

app.post("/api/products", async (req, res) => {
  const b = req.body ?? {};
  const brand = await prisma.brand.findUnique({ where: { name: b.brand } });
  const category = await prisma.category.findUnique({ where: { name: b.category } });
  if (!brand || !category) return res.status(400).json({ error: "Unknown brand or category" });
  const row = await prisma.product.create({
    data: {
      slug: b.id || slugify(b.name ?? "objet"),
      name: b.name ?? "Untitled",
      brandId: brand.id,
      categoryId: category.id,
      price: Number(b.price) || 0,
      was: b.was ? Number(b.was) : null,
      tag: b.tag || null,
      blurb: b.blurb ?? "",
      specs: Array.isArray(b.specs) ? b.specs : [],
      img: b.img ?? "",
    },
  });
  res.status(201).json({ id: row.slug });
});

app.put("/api/products/:id", async (req, res) => {
  const b = req.body ?? {};
  const data: Record<string, unknown> = {
    name: b.name,
    price: Number(b.price) || 0,
    was: b.was ? Number(b.was) : null,
    tag: b.tag || null,
    blurb: b.blurb ?? "",
    specs: Array.isArray(b.specs) ? b.specs : [],
    img: b.img ?? "",
  };
  if (b.brand) {
    const brand = await prisma.brand.findUnique({ where: { name: b.brand } });
    if (brand) data.brandId = brand.id;
  }
  if (b.category) {
    const category = await prisma.category.findUnique({ where: { name: b.category } });
    if (category) data.categoryId = category.id;
  }
  const row = await prisma.product.update({ where: { slug: req.params.id }, data });
  res.json({ id: row.slug });
});

app.delete("/api/products/:id", async (req, res) => {
  await prisma.product.delete({ where: { slug: req.params.id } });
  res.json({ ok: true });
});

/* ---------------- brands ---------------- */

app.get("/api/brands", async (_req, res) => {
  const rows = await prisma.brand.findMany({ orderBy: { createdAt: "asc" } });
  res.json(rows.map((b) => ({ id: b.slug, name: b.name, tagline: b.tagline, est: b.est, story: b.story, image: b.image })));
});

app.post("/api/brands", async (req, res) => {
  const b = req.body ?? {};
  const row = await prisma.brand.create({
    data: {
      slug: b.id || slugify(b.name ?? "label"),
      name: b.name ?? "Untitled",
      tagline: b.tagline ?? "",
      est: b.est ?? "MMXXIV",
      story: b.story ?? "",
      image: b.image ?? "",
    },
  });
  res.status(201).json({ id: row.slug });
});

app.put("/api/brands/:id", async (req, res) => {
  const b = req.body ?? {};
  await prisma.brand.update({
    where: { slug: req.params.id },
    data: { name: b.name, tagline: b.tagline, est: b.est, story: b.story, image: b.image },
  });
  res.json({ ok: true });
});

app.delete("/api/brands/:id", async (req, res) => {
  const count = await prisma.product.count({ where: { brand: { slug: req.params.id } } });
  if (count > 0) return res.status(409).json({ error: "Label still carries objets — reassign them first." });
  await prisma.brand.delete({ where: { slug: req.params.id } });
  res.json({ ok: true });
});

/* ---------------- categories ---------------- */

app.get("/api/categories", async (_req, res) => {
  const rows = await prisma.category.findMany({ orderBy: { createdAt: "asc" } });
  res.json(rows.map((c) => ({ name: c.name, description: c.description, image: c.image })));
});

app.post("/api/categories", async (req, res) => {
  const c = req.body ?? {};
  await prisma.category.create({ data: { name: c.name ?? "Untitled", description: c.description ?? "", image: c.image ?? "" } });
  res.status(201).json({ ok: true });
});

app.put("/api/categories/:name", async (req, res) => {
  const c = req.body ?? {};
  const old = decodeURIComponent(req.params.name);
  await prisma.$transaction([
    prisma.category.update({ where: { name: old }, data: { name: c.name, description: c.description, image: c.image } }),
    prisma.product.updateMany({ where: { category: { name: old } }, data: { categoryId: (await prisma.category.findUnique({ where: { name: c.name } }))?.id ?? "" } }),
  ]);
  res.json({ ok: true });
});

app.delete("/api/categories/:name", async (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const count = await prisma.product.count({ where: { category: { name } } });
  if (count > 0) return res.status(409).json({ error: "Discipline still has objets — move them first." });
  await prisma.category.delete({ where: { name } });
  res.json({ ok: true });
});

/* ---------------- orders ---------------- */

app.get("/api/orders", async (req, res) => {
  const email = req.query.email as string | undefined;
  const rows = await prisma.order.findMany({
    where: email ? { userEmail: email } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(
    rows.map((o) => ({
      id: o.ref,
      email: o.userEmail,
      name: o.userName,
      date: o.createdAt.toISOString(),
      items: o.items.map((i) => ({ id: i.productId ?? i.name, name: i.name, category: "", price: i.price, qty: i.qty, img: i.img })),
      subtotal: o.subtotal,
      discount: o.discount,
      promoCode: o.promoCode,
      shippingMethod: o.shippingMethod,
      shippingCost: o.shippingCost,
      total: o.total,
      address: o.address,
      status: o.status,
    }))
  );
});

app.post("/api/orders", async (req, res) => {
  const o = req.body ?? {};
  const row = await prisma.order.create({
    data: {
      ref: o.id,
      userEmail: o.email,
      userName: o.name,
      address: o.address ?? "",
      status: o.status ?? "sealed",
      subtotal: o.subtotal,
      discount: o.discount ?? 0,
      promoCode: o.promoCode ?? null,
      shippingMethod: o.shippingMethod ?? "Courier Standard",
      shippingCost: o.shippingCost ?? 0,
      total: o.total,
      items: {
        create: (o.items ?? []).map((i: { id?: string; name: string; price: number; qty: number; img?: string }) => ({
          productId: i.id ?? null,
          name: i.name,
          price: i.price,
          qty: i.qty,
          img: i.img ?? "",
        })),
      },
    },
  });
  res.status(201).json({ id: row.ref });
});

app.patch("/api/orders/:ref/status", async (req, res) => {
  await prisma.order.update({ where: { ref: req.params.ref }, data: { status: req.body?.status ?? "sealed" } });
  res.json({ ok: true });
});

/* ---------------- promos & settings ---------------- */

app.get("/api/promos", async (_req, res) => {
  const rows = await prisma.promo.findMany({ where: { active: true } });
  res.json(rows.map((p) => ({ code: p.code, label: p.label, type: p.type, value: p.value, min: p.min ?? undefined, custom: p.custom })));
});

app.put("/api/promos/:code", async (req, res) => {
  const p = req.body ?? {};
  await prisma.promo.upsert({
    where: { code: req.params.code },
    create: { code: req.params.code, label: p.label ?? "", type: p.type ?? "pct", value: Number(p.value) || 0, min: p.min ?? null, active: true, custom: Boolean(p.custom) },
    update: { label: p.label, type: p.type, value: Number(p.value) || 0, min: p.min ?? null, active: p.active ?? true },
  });
  res.json({ ok: true });
});

app.get("/api/settings", async (_req, res) => {
  const rows = await prisma.siteSetting.findMany();
  const out: Record<string, unknown> = {};
  rows.forEach((r) => (out[r.key] = r.value));
  res.json(out);
});

app.put("/api/settings", async (req, res) => {
  const entries = Object.entries(req.body ?? {});
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({ where: { key }, create: { key, value: value as object }, update: { value: value as object } })
    )
  );
  res.json({ ok: true });
});

/* ---------------- auth (demo-grade) ---------------- */

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "That address is already on the register." });
  const user = await prisma.user.create({ data: { email, name: name ?? email, passHash: hash(password) } });
  res.status(201).json({ token: `${user.id}:${Date.now()}`, email: user.email, name: user.name });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.passHash !== hash(password ?? "")) return res.status(401).json({ error: "The key does not fit." });
  res.json({ token: `${user.id}:${Date.now()}`, email: user.email, name: user.name });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`AURION API listening on :${port}`);
});
