import dotenv from 'dotenv';
dotenv.config();

import { Client, Collection, GatewayIntentBits, Partials, Events, ActivityType } from 'discord.js';

import Logger from './handle/logger.js';
import { Util } from './utils/index.js';
import config from '../config.json' assert { type: 'json' };

import { CommandHandler } from './handle/commandHandler.js';
import { EventHandler } from './handle/eventHandler.js';
import { Cron } from './handle/cronHandler.js';

export class Bot {
  constructor() {
    this.commands = new Collection();
    this.cooldown = [];
    this.dev = process.env.NODE_ENV == 'development';
    this.logger = new Logger();
    this.config = config;
    this.utils = new Util();
    this.cron = new Cron(this);

    this.client = new Client({
      intents: Object.keys(GatewayIntentBits),
      partials: Object.keys(Partials),
      presence: {
        status: 'idle',
        activities: [{ type: ActivityType.Watching, name: 'REVELATION' }]
      }
    });
  }

  start() {
    this.client.login(process.env.BOT_TOKEN).catch(err => {
      throw new Error('Có vẻ như bạn chưa cung cấp "BOT_TOKEN" (token của bot) ở file .env hoặc token sai!');
    });
    this.eventHandler = new EventHandler(this);
    this.commandHandler = new CommandHandler(this);
    this.client.on(Events.Error, console.error);
    this.client.on(Events.Warn, console.log);
    process.on('uncaughtException', (error) => {
      this.logger.error(error);
    });
  }
}
