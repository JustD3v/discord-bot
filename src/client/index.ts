import {Client, Collection} from 'discord.js'
import {connect} from 'mongoose'
import path from 'path'
import {readdirSync} from "fs";
import {Command, Event} from '../interfaces'

require('dotenv').config()

class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public aliases: Collection<string, Command> = new Collection();

    public async init() {
        const TOKEN = process.env.TOKEN
        await this.login(TOKEN.toString());

        await this.guilds.client.user.setActivity("LIVE CODING", {
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        });

        connect(process.env.MONGOURI, {
            useUnifiedTopology: true,
            useFindAndModify: true,
            useNewUrlParser: true
        }).then(() => {
            console.log('Successfully connected to MongoDB')
        }).catch(reason => console.log('MongoDB connection failed:', reason))


        // Commands
        const commandPath = path.join(__dirname, '..', "Commands");
        readdirSync(commandPath).forEach((dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith(".ts"));

            for (const file of commands) {
                const {command} = require(`${commandPath}/${dir}/${file}`);
                console.log('Command found:', command)
                this.commands.set(command.name, command);

                if (command?.aliases)
                    if (command.aliases.length > 0) {
                        command.aliases.forEach((alias) => {
                            this.aliases.set(alias, command);
                        })
                    }
            }
        })

        // Events
        const eventPath = path.join(__dirname, '..', "Events");
        for (const file of readdirSync(eventPath)) {
            const {event} = await import(`${eventPath}/${file}`);
            console.log('Event found:', event);
            this.events.set(event.name, event);
            this.on(event.name, event.run.bind(null, this));
        }
    }

}

export default ExtendedClient;
