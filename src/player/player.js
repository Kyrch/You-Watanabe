const { Player } = require('discord-player');
const client = require('../../index')
const config = require('./config')

client.player = new Player(client, config.discordPlayer)
const player = client.player

module.exports = player