import { ApplicationCommandOptionType, ChannelType, Colors } from "discord.js";
import { serverModel } from '../../databases/server-model.js';

export const data = {
  name: 'cron',
  description: 'Thiết lập cron.',
  options: [{
    name: 'schedule',
    description: 'Lịch trình cron',
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: [{
      name: 'add',
      description: 'Thêm lịch trình cron',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'name',
        description: 'Tên quản lý cron',
        type: ApplicationCommandOptionType.String,
        required: true
      }, {
        name: 'channel',
        description: 'Channel thông báo',
        type: ApplicationCommandOptionType.Channel,
        channelTypes: [ChannelType.GuildText],
        required: true
      }, {
        name: 'message',
        description: 'Tin nhắn',
        type: ApplicationCommandOptionType.String,
        maxLength: 4096,
        required: true
      }, {
        name: 'minutes',
        description: 'Phút',
        type: ApplicationCommandOptionType.Number,
        minValue: 1,
        maxValue: 60
      }, {
        name: 'hours',
        description: 'Giờ',
        type: ApplicationCommandOptionType.Number,
        minValue: 1,
        maxValue: 24
      }, {
        name: 'date',
        description: 'Thứ',
        type: ApplicationCommandOptionType.Number,
        minValue: 1,
        maxValue: 8
      }]
    }, {
      name: 'delete',
      description: 'Xoá lịch trình cron',
      type: ApplicationCommandOptionType.Subcommand,
      options: [{
        name: 'name',
        description: 'Tên lịch trình',
        type: ApplicationCommandOptionType.String,
        required: true
      }]
    }]
  }, {
    name: 'list',
    description: 'Danh sách cron',
    type: ApplicationCommandOptionType.SubcommandGroup
  }]
}

export async function execute(interaction) {
  await interaction.deferReply();
  let db = await serverModel.findOne({ guildId: interaction.guild.id });
  if (!db) db = await serverModel.create({ guildId: interaction.guild.id });
  switch (interaction.options.getSubcommandGroup()) {
    case 'schedule': {
      switch (interaction.options.getSubcommand()) {
        case 'add': schedule_add.bind(this)(interaction, db); break;
        case 'delete': schedule_delete.bind(this)(interaction, db); break;
      }
    }
      break;
  }
}

async function schedule_add(interaction, db) {
  let name = interaction.options.getString('name'),
    channelId = interaction.options.getChannel('channel').id,
    message = interaction.options.getString('message'),
    minutes = interaction.options.getNumber('minutes'),
    hours = interaction.options.getNumber('hours'),
    date = interaction.options.getNumber('date');
  let cron_list = db.cron;
  let cron_valid = cron_list.find(cron => cron.name == name);
  if (cron_valid) return interaction.followUp({
    embeds: [{
      description: '❌ Cron này đã tồn tại!',
      color: Colors.Purple
    }]
  });
  let obj = { name, channelId, message, minutes, hours, date };
  db.cron.push(obj);
  await db.save();
  this.cron.add(obj);
  interaction.followUp({
    embeds: [{
      description: '✅ Thêm lịch trình thành công!',
      color: Colors.Purple
    }]
  });
}

async function schedule_delete(interaction, db) {
  let name = interaction.options.get('name');
  let cron_list = db.cron;
  let cron_valid = cron_list.find(cron => cron.name == name);
  if (!cron_valid) return interaction.followUp({
    embeds: [{
      description: '❌ Cron không tồn tại!',
      color: Colors.Purple
    }]
  });
  db.cron = db.cron.filter(data => data.name !== name);
  this.cron.delete(name);
  await db.save();
  interaction.followUp({
    embeds: [{
      description: '✅ Xoá lịch trình thành công!',
      color: Colors.Purple
    }]
  });
}