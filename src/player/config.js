configs = {
    voiceConfig: {
        leaveOnEnd: true,
        autoSelfDeaf: false,
        leaveOnTimer: {
            status: true,
            time: 10000
        }
    },
    maxVol: 200,
    loopMessage: false,
    developer: {
        id: '435919278164803586'
    },

    discordPlayer: {
        ytdlOptions: {
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }
    }
}

module.exports = configs