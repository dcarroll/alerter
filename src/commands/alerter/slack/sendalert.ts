import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import SlackLib from '../../../lib/slacklib';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('alerter', 'slacksendalert');

export default class SendAlert extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx alerter:slack:sendalert --message 'Hey, you package is created'
  Ok, message posted.
  `
  ];

  public static args = [];

  protected static flagsConfig = {
    message: flags.string({char: 'm', required: true, description: messages.getMessage('messageFlagDescription')}),
    channel: flags.string({ char: 'c', required: false, description: messages.getMessage('channelFlagDescription')}),
    emoji: flags.string({ char: 'e', required: false, description: messages.getMessage('emojiFlagDescription')})
  };

  protected async postMessage(): Promise<any> {
    const resp = await SlackLib.postMessage(this.flags.message, this.flags.channel, this.flags.emoji); 
    if (resp.ok === true) {
      this.ux.log('Ok, message posted.');
    } else {
      throw new SfdxError(resp.error);
    }
    return resp;
  }

  public async run(): Promise<AnyJson> {
    const resp = await this.postMessage();
    return resp;
  }
}
