import SlackConfig from './slackconfig';
import { WebClient, WebAPICallResult } from '@slack/web-api';
import { readFileSync } from 'fs';
import { basename } from 'path';

export default class SlackLib {
    protected static slackToken: string;

    private static async getSlackToken() {
        const slackconfig = await SlackConfig.create({ isGlobal: true });
        this.slackToken = slackconfig.get('slacktoken').toString();
    }

    public static async postMessage(message: string, slackchannel: string, icon_emoji?: string, slacktoken?: string, ): Promise<WebAPICallResult> {
        if (slacktoken) {
            this.slackToken = slacktoken
        } else {
            const slackconfig = await SlackConfig.create({ isGlobal: true });
            this.slackToken = slackconfig.get('slacktoken').toString();
        }
        const web = new WebClient(this.slackToken);
        const res = await web.auth.test();
        const userId: string = res.user_id + '';
        const resp = await web.chat.postMessage({  text: message, channel: slackchannel || userId, icon_emoji: icon_emoji || '' }); 
        return resp;
    }

    public static async channelList() {
        await this.getSlackToken();
        const web = new WebClient(this.slackToken);
        const resp:any = await web.channels.list({ exclude_members: true, exclude_archived: true })
        return resp.channels;
    }

    public static async uploadFile(filepath: string, channel: string, filename?: string, initialComment?: string, title?: string) {
        await this.getSlackToken();
        const web = new WebClient(this.slackToken);
        const actualfile = readFileSync(filepath);
        const resp:any = await web.files.upload({ channels: channel, file: actualfile, filename: filename || basename(filepath), title: title, initial_comment: initialComment });
        return resp;
    }
}