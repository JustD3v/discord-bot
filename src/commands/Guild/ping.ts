import { Command } from '../../interfaces'
import { Client } from 'discord.js'

export const command: Command = {
  name: 'ping',
  run: async (client: Client, message, args) => {
    await message.reply(`${client.ws.ping} ping!`)
  },
}
