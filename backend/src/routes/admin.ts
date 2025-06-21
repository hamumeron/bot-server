import { Router } from "express";
import { prisma } from "../index";

const router = Router();

router.get("/summary", async (_req, res) => {
  const bots = await prisma.bot.findMany();
  const liveCount = bots.filter(b => b.state === "live").length;
  res.json({ total: bots.length, live: liveCount });
});

router.get("/all", async (_req, res) => {
  const bots = await prisma.bot.findMany({ include: { user: true } });
  res.json(bots);
});

export default router;
