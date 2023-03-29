export class Util {
    constructor() { };

    get_welcome_format(value, member) {
        value = replace(JSON.stringify(value));
        function replace(str) {
            return str
                .replace(/\{user_tag\}/g, member.user.tag)
                .replace(/\{user_id\}/g, member.user.id)
                .replace(/\{user_mention\}/g, member.user.toString());
        }
        return JSON.parse(value);
    }
}