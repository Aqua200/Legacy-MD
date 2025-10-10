import { promises as fs } from 'fs';

async function loadCharacters() {
  const data = await fs.readFile("./lib/characters.json", "utf-8");
  return JSON.parse(data);
}

function flattenCharacters(characters) {
  return Object.values(characters).flatMap(c => Array.isArray(c.characters) ? c.characters : []);
}

const verifi = async () => {
  try {
    const pkgData = await fs.readFile("./package.json", "utf-8");
    const pkg = JSON.parse(pkgData);
    return pkg.repository?.url === "git+https://github.com/The-King-Destroy/YukiBot-MD.git";
  } catch {
    return false;
  }
};

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!(await verifi())) {
    return conn.reply(
      m.chat,
      `❀ El comando *<${command}>* solo está disponible para Yuki Suou.\n> https://github.com/The-King-Destroy/YukiBot-MD`,
      m
    );
  }

  if (!global.db.data.chats?.[m.chat]?.gacha && m.isGroup) {
    return m.reply(
      `ꕥ Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}gacha on*`
    );
  }

  if (!global.db.data.characters) global.db.data.characters = {};

  try {
    const characters = await loadCharacters();
    const flatChars = flattenCharacters(characters);

    const charValues = flatChars.map(c => {
      const dbChar = global.db.data.characters[c.id] || {};
      const value = typeof dbChar.value === "number" ? dbChar.value : Number(c.value || 0);
      return { name: c.name, value };
    });

    const page = parseInt(args[0]) || 1;
    const totalPages = Math.ceil(charValues.length / 10);
    if (page < 1 || page > totalPages) return m.reply(`ꕥ Página no válida. Hay un total de *${totalPages}* páginas.`);

    const topChars = charValues.sort((a, b) => b.value - a.value).slice((page - 1) * 10, page * 10);

    let text = "❀ *Personajes con más valor:*\n\n";
    topChars.forEach((c, i) => {
      text += `✰ ${(page - 1) * 10 + i + 1} » *${c.name}*\n`;
      text += `   → Valor: *${c.value.toLocaleString()}*\n`;
    });
    text += `\n⌦ Página *${page}* de *${totalPages}*`;

    await conn.reply(m.chat, text.trim(), m);
  } catch (err) {
    await conn.reply(
      m.chat,
      `⚠︎ Se ha producido un problema.\n> Usa ${usedPrefix}report para informarlo.\n\n${err.message}`,
      m
    );
  }
};

handler.help = ["topwaifus"];
handler.tags = ["gacha"];
handler.command = ["waifusboard", "waifustop", "topwaifus", "wtop"];
handler.group = true;

export default handler;
