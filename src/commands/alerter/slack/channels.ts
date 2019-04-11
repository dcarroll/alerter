import { SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import SlackLib from '../../../lib/slacklib';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('alerter', 'channels');

export default class SendAlert extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx alerter:slack:channels

Name     ID         Purpose
───────  ─────────  ────────────────────────────────────────────────────
general  C0SA487L4  This channel is for team-wide communication and a...
random   C0SA487PE  A place for non-work-related flimflam, faffing, h...
  `
  ];

  public static args = [];

  protected static flagsConfig = {
    
  };

  protected async listChannels(): Promise<any> {
    const channels = await SlackLib.channelList();
    this.ux.log('');
    this.ux.table(channels, { columns: [ 
      { key: 'name', label: 'Name' },
      { key: 'id', label: 'ID'}, 
      { key: 'purpose.value', label: 'Purpose'}]});
    return channels;
  }

  public async run(): Promise<AnyJson> {
    const resp = await this.listChannels();
    return resp;
  }
}
