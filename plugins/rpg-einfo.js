import { promises as fs } from 'fs';

function formatTime(ms) {
  if (ms <= 0 || isNaN(ms)) return 'Ahora';
  const totalSeconds = Math.ceil(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (days) parts.push(days + " día" + (days !== 1 ? "s" : ""));
  if (hours) parts.push(hours + " hora" + (hours !== 1 ? "s" : ""));
  if (minutes || hours || days) parts.push(minutes + " minuto" + (minutes !== 1 ? "s" : ""));
  parts.push(seconds + " segundo" + (seconds !== 1 ? "s" : ""));
  return parts.join(" ");
}

const verifi = async () => {
  try {
    const packageJson = await fs.readFile('./package.json', "utf-8");
    const data = JSON.parse(packageJson);
    return data.repository?.url === 'git+https://github.com/Aqua200/Ouka-MD.git';
  } catch {
    return false;
  }
};

let handler = async (m, { conn, command, usedPrefix }) => {
  if (!(await verifi())) {
    return conn.reply(
      m.chat,
      `❀ El comando *<${command}>* solo está disponible para Ouka-MD.\n> https://github.com/Aqua200/Ouka-MD`,
      m
    );
  }

  const chatData = global.db.data.chats[m.chat];
  if (!chatData.economy && m.isGroup) {
    return m.reply(
      `《✦》Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`
    );
  }

  const userData = global.db.data.users[m.sender];
  if (!userData) {
    return conn.reply(m.chat, "ꕥ No se encontraron datos de economía para este usuario.", m);
  }

  const now = Date.now();
  const lastActivities = {
    Work: userData.lastwork,
    Slut: userData.lastslut,
    Crime: userData.lastcrime,
    Steal: userData.lastrob,
    Daily: userData.lastDaily,
    Weekly: userData.lastweekly,
    Monthly: userData.lastmonthly,
    Cofre: userData.lastcofre,
    Adventure: userData.lastAdventure,
    Dungeon: userData.lastDungeon,
    Fish: userData.lastFish,
    Hunt: userData.lastHunt,
    Mine: userData.lastmine
  };

  const activityTimes = Object.entries(lastActivities).map(([key, value]) => {
    const remaining = typeof value === "number" ? value - now : 0;
    return `ⴵ ${key} » *${formatTime(remaining)}*`;
  });

  const totalCoins = ((userData.coin || 0) + (userData.bank || 0)).toLocaleString();

  const userName = await (async () => {
    if (userData.name) return userData.name;
    try {
      const name = await conn.getName(m.sender);
      return typeof name === "string" && name.trim() ? name : m.sender.split('@')[0];
    } catch {
      return m.sender.split('@')[0];
    }
  })();

  const message = `*❀ Usuario \`<${userName}>\`*\n\n${activityTimes.join("\n")}\n\n⛁ Coins totales » *¥${totalCoins} ${currency}*`;
  await m.reply(message.trim());
};

handler.help = ["einfo"];
handler.tags = ['economy'];
handler.command = ["economyinfo", "infoeconomy", "einfo"];
handler.group = true;

export default handler;
