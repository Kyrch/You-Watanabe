const { SlashCommandBuilder } = require('@discordjs/builders');
const player = require('../player/player');
const configPlayer = require('../player/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('altera o volume')
        .addIntegerOption(option => option
            .setName('volume')
            .setDescription('defina um volume')
            .setRequired(true)),

    async execute(interaction) {

        const vol = parseInt(interaction.options.getInteger('volume'))
        const queue = player.getQueue(interaction.guild.id)

        if (!queue || !queue.playing) return interaction.reply({ content: 'Nada tocando no momento', ephemeral: true })

        if (interaction.member.id != configPlayer.developer.id) {
            if (vol < 0 || vol > configPlayer.maxVol) return interaction.reply({ content: 'Insira um valor entre 0 e 200', ephemeral: true })
        }

        queue.setVolume(vol)

        try {
            await interaction.reply({ content: `Volume alterado para ${vol}` })
        } catch (err) {
            await interaction.reply({ content: `Volume alterado para ${vol}`, ephemeral: true })
        }
    }
}