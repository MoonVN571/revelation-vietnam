import { readdirSync } from "fs";

export class CommandHandler {
    constructor(params) {
        readdirSync('./src/commands').forEach(dir => {
            readdirSync('./src/commands/' + dir).filter(f => f.endsWith('.js')).forEach(async cmd => {
                let { data, execute } = await import(`../commands/${dir}/${cmd}`);
                if (!data || typeof execute !== 'function') return;

                params.commands.set(data.name, { data, execute });
            });
        });
    }
}

export class Cooldown {
    constructor(_userId, _timing, _cmd) {
        this.timing = Date.now() + _timing;
        this.userId = _userId;
        this.cmd = _cmd || ''; // '' for global
        setTimeout(this.clear, _timing);
    }

    clear() {
        this.timing = null;
    }

    time() {
        let time = this.timing - Date.now();
        if (time > 0)
            return time;
    }
}