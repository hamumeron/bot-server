import { Router } from "express";
import { prisma } from "../index";
import fetch from "node-fetch";

const router = Router();

router.post("/start", async (req, res) => {
  const { userId, botName, discordToken, botCode } = req.body;
  const serviceName = `bot-${userId}-${Date.now()}`;

  // Render API仮例（※APIキーは.envに）
  const response = await fetch("https://api.render.com/deploys", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RENDER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      serviceName,
      envVars: [
        { key: "DISCORD_TOKEN", value: discordToken },
        { key: "BOT_CODE", value: botCode }
      ],
      repo: "https://github.com/hamumeron/template-discord-bot",
      branch: "main"
    })
  });

  const data = await response.json();

  const bot = await prisma.bot.create({
    data: {
      name: botName,
      userId,
      serviceId: data.service.id,
      state: data.service.state
    }
  });

  res.json(bot);
});

router.post("/stop", async (req, res) => {
  const { botId } = req.body;
  const bot = await prisma.bot.findUnique({ where: { id: botId } });
  if (!bot) return res.status(404).send("not found");

  await fetch(`https://api.render.com/services/${bot.serviceId}/stop`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RENDER_API_KEY}` }
  });

  await prisma.bot.update({ where: { id: botId }, data: { state: "stopped" } });

  res.sendStatus(204);
});

router.get("/status/:botId", async (req, res) => {
  const bot = await prisma.bot.findUnique({ where: { id: +req.params.botId } });
  if (!bot) return res.status(404).send("not found");

  const svc = await fetch(`https://api.render.com/services/${bot.serviceId}`, {
    headers: { Authorization: `Bearer ${process.env.RENDER_API_KEY}` }
  }).then(r => r.json());

  res.json({ state: svc.state, url: svc.url });
});

export default router;
