import cron from 'node-cron';
import { serverModel } from "../databases/server-model.js"

export class Cron {
    constructor(main) {
        this.load();
        this.main = main;
        this.cron_list = [];
    };
    async load() {
        await new Promise((res, _) => setTimeout(res, 20 * 1000));
        let servers = await serverModel.find();
        servers.forEach(data => {
            data.cron.forEach(cron_data => {
                this.add(cron_data);
            });
        })
    }
    start(data) {
        let task = cron.schedule(`${data?.minutes - 1 || '*'} ${data?.hours - 1 || '*'} * * ${data?.date - 1 || '*'}`, () => {
            this.main.client.channels.cache.get(data.channelId)
                .send(data.message);
        }, { scheduled: true, timezone: 'Asia/Ho_Chi_Minh' });
        task.start();
        return task;
    }
    // Handle lại task cron
    add(data) {
        if (this.get(data.name)) throw new Error('NAME_USED');
        let task = this.start(data);
        task.name = data.name;
        this.cron_list.push(task);
    }
    delete(name) {
        let task = this.get(name);
        if (!task) throw new Error('TASK_NOT_FOUND');
        task.stop();
    }
    get(name) {
        return this.cron_list.find(task => task.name == name);
    }
}