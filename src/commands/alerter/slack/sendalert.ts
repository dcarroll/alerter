import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import SlackConfig from '../../../lib/slackconfig';
import { IncomingWebhook, IncomingWebhookResult } from '@slack/webhook';

// https://hooks.slack.com/services/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
// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('alerter', 'slacksendalert');

export default class SendAlert extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx alerter:slack:sendalert --message 'Hey, you package is created'
  Ok, message sent.
  `
  ];

  public static args = [];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    message: flags.string({char: 'm', required: true, description: messages.getMessage('messageFlagDescription')}),
    emoji: flags.string({ char: 'e', required: false, description: messages.getMessage('emojiFlagDescription')})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;
  protected results;

  public async run(): Promise<AnyJson> {

    let slackConfig = await SlackConfig.create({ isGlobal: true});
    slackConfig.read();
    const hookurl = slackConfig.get('hookurl').toString();

    const webhook = new IncomingWebhook(hookurl,
      {
        icon_emoji: ':thumbsup:'
      }
    );

    const hookcontent = { text: this.flags.message };
    if (this.flags.emoji) {
      hookcontent['icon_emoji'] = this.flags.emoji;
    }
    return await webhook.send(hookcontent).then(async (value: IncomingWebhookResult) => {
      this.results = value.text;
      this.ux.log('Successfully posted  update to slack')
      return this.results;
    }).catch((reason) => {
      const e = new SfdxError(reason.message, 'slack-ish error', ['Check your webhook url.']);
      this.results = e;
      throw e;
    });
  }
}
