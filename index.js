require('dotenv').config();
const {
    Client,
    Intents,
    Collection,
} = require('discord.js');
const fs = require('fs');
const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS]
});

const Discord = require('discord.js');
module.exports = client

client.commandsSlash = new Collection();
client.events = new Collection();

['event_handler'].forEach(handler => require(`./src/handlers/${handler}`)(client, Discord))

const {
    botId
} = require('./json/config.json');

// Slash Commands setName
const comma = []
const commandFiles = fs.readdirSync('./src/slashCommands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./src/slashCommands/${file}`);
    client.commandsSlash.set(command.data.name, command);
    comma.push(command.data.toJSON());
}

// Server Defined
const rest = new REST({
    version: '9'
}).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(botId), {
            body: comma
        },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();


// Interaction Create from Slash and Context Menu
client.on('interactionCreate', async (interaction) => {

    if (interaction.member == null) return console.log('comando dm');

    if (interaction.isCommand()) {
        var command = client.commandsSlash.get(interaction.commandName);
    }

    if (interaction.isContextMenu()) {
        var command = client.commandsMenu.get(interaction.commandName);
    }

    if (!command) return

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        return interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});

client.login(process.env.DISCORD_TOKEN)