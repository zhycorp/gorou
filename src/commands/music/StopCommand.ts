import { CommandInteraction, Message } from "discord.js";
import { BaseCommand } from "../../structures/BaseCommand";
import { createEmbed } from "../../utils/createEmbed";
import { DefineCommand } from "../../utils/decorators/DefineCommand";
import { isMemberInVoiceChannel, isMemberVoiceChannelJoinable, isMusicPlaying, isSameVoiceChannel } from "../../utils/decorators/MusicHelpers";

@DefineCommand({
    aliases: ["dc", "disconnect"],
    cooldown: 3,
    description: "Stop current queue",
    name: "stop",
    slash: {
        options: []
    },
    usage: "{prefix}stop"
})
export class StopCommand extends BaseCommand {
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isMemberVoiceChannelJoinable()
    @isSameVoiceChannel()
    public async execute(message: Message): Promise<any> {
        await message.guild!.music.player!.destroy();
        return message.channel.send({
            embeds: [
                createEmbed("info", "Stopped current queue", true)
            ]
        });
    }

    @isMusicPlaying(true)
    @isMemberInVoiceChannel(true)
    @isMemberVoiceChannelJoinable(true, true)
    @isSameVoiceChannel(true)
    public async executeInteraction(interaction: CommandInteraction): Promise<any> {
        await interaction.deferReply();
        await interaction.guild!.music.player!.destroy();
        return interaction.editReply({
            embeds: [
                createEmbed("info", "Stopped current queue", true)
            ]
        });
    }
}
