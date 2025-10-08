import speed from 'performance-now'
import { exec } from 'child_process'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  let sentMsg = await conn.reply(m.chat, '❀ Calculando ping...', m)
  let latency = speed() - timestamp

  exec(`neofetch --stdout`, (error, stdout, stderr) => {
    if (error) {
      conn.sendMessage(m.chat, { text: `Error al obtener información del sistema: ${error.message}` }, { quoted: m })
      return
    }

    const info = stdout.toString("utf-8")

    // Extraer valores importantes usando regex
    const cpuMatch = info.match(/CPU:\s*(.+)/)
    const cpuSpeedMatch = info.match(/CPU MHz:\s*([\d.]+)/) || info.match(/CPU:\s*.+@ (\d+\.\d+)GHz/)
    const ramMatch = info.match(/Memory:\s*(.+)/)
    const uptimeMatch = info.match(/Uptime:\s*(.+)/)

    const cpu = cpuMatch ? cpuMatch[1].trim() : 'Desconocido'
    const cpuSpeed = cpuSpeedMatch ? cpuSpeedMatch[1].trim() : 'Desconocido'
    const ram = ramMatch ? ramMatch[1].trim().replace("MiB", "GB") : 'Desconocido'
    const uptime = uptimeMatch ? uptimeMatch[1].trim() : 'Desconocido'

    // Crear mensaje en el formato que quieres
    let result = `
*» Velocidad* : ${latency.toFixed(0)} *_ms_*
*» Procesador* : ${cpu}
*» CPU* : ${cpuSpeed} MHz
*» RAM* : ${ram}
*» Tiempo activo* : ${uptime}
    `

    conn.sendMessage(m.chat, { text: result, edit: sentMsg.key }, { quoted: m })
  })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']

export default handler
