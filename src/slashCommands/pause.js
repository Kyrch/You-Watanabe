const { SlashCommandBuilder } = require('@discordjs/builders');
const player = require('../player/player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('pausa a música atual'),

    async execute(interaction) {
        const queue = player.getQueue(interaction.guild.id)

        if (!queue || !queue.playing) return interaction.reply({ content: 'Nada tocando no momento', ephemeral: true })
        queue.setPaused(true)

        try {
            await interaction.reply({ content: '⏸ Pause' })
        } catch (err) {
            await interaction.reply({ content: '⏸ Pause', ephemeral: true })
        }
    }
}