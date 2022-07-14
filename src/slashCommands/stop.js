const { SlashCommandBuilder } = require('@discordjs/builders');
const player = require('../player/player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('elimina a playlist'),

    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id)

        if (!queue || !queue.playing) return interaction.reply({ content: 'Nada tocando no momento', ephemeral: true })
        queue.destroy()

        try {
            await interaction.reply({ content: 'Playlist destruída' })
        } catch (err) {
            await interaction.reply({ content: 'Playlist destruída', ephemeral: true })
        }
    }
}