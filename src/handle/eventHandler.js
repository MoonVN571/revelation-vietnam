import { readdirSync } from "fs";

export class EventHandler {
    constructor(params) {
        readdirSync('./src/events/Bot').forEach(async event => {
            let { execute } = await import(`../../src/events/Bot/${event}`);
            if (typeof execute !== 'function') return;
            let eventName = event.split('.')[0];
            params.client.on(eventName, (...p) => execute.bind(params)(...p));
        });
    }
}