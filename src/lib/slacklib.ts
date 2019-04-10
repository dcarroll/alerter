import SlackConfig from './slackconfig';
import { WebClient, WebAPICallResult } from '@slack/web-api';

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

    public static async refreshChannelList() {
        await this.getSlackToken();
        const web = new WebClient(this.slackToken);
        const resp:any = await web.channels.list({ exclude_members: true, exclude_archived: true })
        const slackconfig = await SlackConfig.create({ isGlobal: true });
        slackconfig.set('channels', resp.channels);
        slackconfig.write();
        return resp.channels;
    }
}