import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

export async function execute() {
    this.logger.start('Bot started!');
    let cmd = this.commands.map(c => {
        if (this.dev) {
            c.data.defaultMemberPermissions = ['Administrator'];
        }
        return c.data
    }).filter(c => !c.disabled);
    this.client.application.commands.set(cmd);

    await mongoose.connect(process.env.MONGO_STRING).then(() => {
        this.logger.start('Connected to MongoDB!');
    });
}