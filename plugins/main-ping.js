import speed from 'performance-now'
import os from 'os'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  let sentMsg = await conn.reply(m.chat, '❀ Calculando ping...', m)
  let latency = speed() - timestamp

  const cpus = os.cpus()
  const cpu = cpus[0].model
  const cpuSpeed = cpus[0].speed > 0 ? cpus[0].speed : 'Desconocido'

  const totalMem = os.totalmem() / (1024 ** 3)
  const freeMem = os.freemem() / (1024 ** 3)
  const usedMem = totalMem - freeMem

  function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${h} horas, ${m} minutos, ${s} segundos`
  }

  const uptime = formatUptime(os.uptime())

  let result = `
*» Velocidad* : ${latency.toFixed(0)} *_ms_*
*» Procesador* : ${cpu}
*» CPU* : ${cpuSpeed} MHz
*» RAM* : ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB
*» Tiempo activo* : ${uptime}
  `

  conn.sendMessage(m.chat, { text: result, edit: sentMsg.key }, { quoted: m })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']

export default handler
