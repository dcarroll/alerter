import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { IncomingWebhook, IncomingWebhookResult } from '@slack/webhook';
import SlackConfig from '../../../lib/slackconfig';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('alerter', 'slackconfig');

export default class Configure extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx alerter:slack:config --hookurl https://hooks.slack.com/services/TXXXXXXXX/BXXXXXXXX/XXXXX
  Message successfully sent, configuration confirmed 
  `
  ];

  public static args = [];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    hookurl: flags.string({char: 'u', required: true, description: messages.getMessage('hookurlFlagDescription')})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  protected results;

  public async run(): Promise<AnyJson> {

    const webhook = new IncomingWebhook(this.flags.hookurl,
      {
        icon_emoji: ':thumbsup:'
      }
    );

    return await webhook.send({ text: 'Your slack alerter is working!', icon_emoji: ':thumbsup:'}).then(async (value: IncomingWebhookResult) => {
      this.results = value.text;
      const slackconfig = await SlackConfig.create({ isGlobal: true });
      slackconfig.set('hookurl', this.flags.hookurl);
      slackconfig.write();
      return this.results;
    }).catch((reason) => {
      const e = new SfdxError(reason.message, 'slack-ish error', ['Check your webhook url.']);
      this.results = e;
      throw e;
    });

  }
}
