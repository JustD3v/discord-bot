import { Command, Event } from '../interfaces'
import { Message } from 'discord.js'

export const event: Event = {
  name: 'message',
  run: (client, message: Message) => {
    const PREFIX = process.env.PREFIX
    if (
      message.author.bot ||
      !message.guild ||
      !message.content.startsWith(PREFIX.toString())
    )
      return

    const args = message.content
      .slice(PREFIX.toString().length)
      .trim()
      .split(/ +/g)

    const cmd = args.shift().toLowerCase()
    if (!cmd) return
    const command = client.commands.get(cmd) || client.aliases.get(cmd)
    if (command) (command as Command).run(client, message, args)
  },
}
