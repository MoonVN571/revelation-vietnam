import { ApplicationCommandOptionType, Colors } from 'discord.js';

export const data = {
    name: 'embed',
    description: 'Tạo custom embed',
    options: [{
        name: 'channel',
        description: 'Channnel gửi embed',
        type: ApplicationCommandOptionType.Channel,
        required: true,
    }, {
        name: 'content',
        type: ApplicationCommandOptionType.String,
        description: 'Content embed',
        maxLength: 4096
    }, {
        name: 'color',
        type: ApplicationCommandOptionType.String,
        description: 'Color embed',
        maxLength: 10
    }, {
        name: 'title',
        type: ApplicationCommandOptionType.String,
        description: 'Tiêu đề embed',
        maxLength: 256
    }, {
        name: 'author_name',
        type: ApplicationCommandOptionType.String,
        description: 'Tiêu đề author embed',
        maxLength: 256
    }, {
        name: 'description',
        type: ApplicationCommandOptionType.String,
        description: 'Mô tả embed',
        maxLength: 4096
    }],
    defaultMemberPermissions: ['ManageGuild']
}

export function execute(interaction) {
    const content = interaction.options.getString('content');
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const author_name = interaction.options.getString('author_name');
    const color = interaction.options.getString('color');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    if (!channel.isTextBased() || !interaction.guild.members.me.permissionsIn(channel).has('ViewChannel'))
        return interaction.reply({
            embeds: [{
                description: '❌ Bạn không thể sử dụng kênh nay để gửi embed!',
                color: Colors.Red
            }]
        });
    if (isNaN(color))
        return interaction.reply({
            embeds: [{
                description: '❌ Color không hợp lệ!',
                color: Colors.Red
            }]
        });
    let invalid_embed = !title && !description && !author_name && !color;
    if (!content && invalid_embed)
        return interaction.reply({
            embeds: [{
                description: '❌ Hãy nhập ít nhất 1 nội dung embed!',
                color: Colors.Red
            }]
        });
    channel.send({
        content: content,
        embeds: invalid_embed ? [] : [{
            title: title,
            author: { name: author_name },
            description: description,
            color: +color,
            timestamp: new Date().toISOString()
        }]
    });
    interaction.reply({
        embeds: [{
            description: '✅ Embed được gửi thành công!',
            color: Colors.Purple
        }]
    });
}