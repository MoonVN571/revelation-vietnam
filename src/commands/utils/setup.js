import { Colors } from 'discord.js';
import { serverModel } from '../../databases/server-model.js';

export const data = {
    name: 'setup',
    description: 'Thiết lập server',
    options: [{
        name: 'welcome',
        description: 'Tạo welcome embed.',
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: 'channel',
            description: 'Channnel gửi thông báo welcome.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }, {
            name: 'content',
            type: ApplicationCommandOptionType.String,
            description: 'Content embed.',
            maxLength: 4096
        }, {
            name: 'color',
            type: ApplicationCommandOptionType.String,
            description: 'Color embed. (0xFFFFFF)',
            maxLength: 10
        }, {
            name: 'title',
            type: ApplicationCommandOptionType.String,
            description: 'Tiêu đề embed.',
            maxLength: 256
        }, {
            name: 'author_name',
            type: ApplicationCommandOptionType.String,
            description: 'Tiêu đề author embed (tiêu đề phụ).',
            maxLength: 256
        }, {
            name: 'description',
            type: ApplicationCommandOptionType.String,
            description: 'Mô tả embed.',
            maxLength: 4096
        }]
    }],
    defaultMemberPermissions: ['Administrator']
}

export async function execute(interaction) {
    await interaction.deferReply();
    const db = await serverModel.findOne({ guildId: interaction.guildId });
    if (!db) db = await serverModel.create({ guildId: interaction.guildId });
    // check channel
    switch (interaction.options.getSubcommand()) {
        case 'welcome': welcome(interaction, db)
            break;
    }
}
async function welcome(interaction, db) {
    const content = interaction.options.getString('content');
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const author_name = interaction.options.getString('author_name');
    const color = interaction.options.getString('color');
    const channel = interaction.options.getChannel('channel');
    if (!channel.isTextBased() || !interaction.guild.members.me.permissionsIn(channel).has('ViewChannel'))
        return interaction.followUp({
            embeds: [{
                description: '❌ Bạn không thể sử dụng kênh nay để gửi embed!',
                color: Colors.Red
            }]
        });
    if (isNaN(color))
        return interaction.followUp({
            embeds: [{
                description: '❌ Color không hợp lệ!',
                color: Colors.Red
            }]
        });
    let invalid_embed = !title && !description && !author_name && !color;
    if (!content && invalid_embed)
        return interaction.followUp({
            embeds: [{
                description: '❌ Hãy nhập ít nhất 1 nội dung embed!',
                color: Colors.Red
            }]
        });
    db['welcome'] = {
        channelId: channel.id,
        content: content,
        embeds: [{
            title: title,
            author: { name: author_name },
            description: description,
            color: +color,
            timestamp: new Date().toISOString()
        }]
    };
    await db.save();
    interaction.channel.send(this.utils.get_welcome_format(db.welcome, interaction.member));
    interaction.followUp({
        embeds: [{
            description: '✅ Thiết lập welcome thành công!',
            color: Colors.Purple
        }]
    });
}