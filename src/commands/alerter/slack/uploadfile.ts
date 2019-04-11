import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import SlackLib from '../../../lib/slacklib';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('alerter', 'uploadfile');

export default class SendAlert extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx alerter:slack:fileupload --filepath /tmp/filetoload.json --initialcomment 'Check out this file' --title 'Error Text' --channel '#general'
  Ok, file posted.
  `
  ];

  public static args = [];

  protected static flagsConfig = {
    filepath: flags.string({char: 'f', required: true, description: messages.getMessage('filepathFlagDescription')}),
    channel: flags.string({ char: 'c', required: true, description: messages.getMessage('channelFlagDescription')}),
    filename: flags.string({ char: 'n', required: false, description: messages.getMessage('filenameFlagDescription')}),
    initialcomment: flags.string({ char: 'i', required: false, description: messages.getMessage('initialcommentFlagDescription')}),
    title: flags.string({ char: 't', required: false, description: messages.getMessage('titleFlagDescription')})
  };

  protected async uploadFile(): Promise<any> {
    const resp = await SlackLib.uploadFile(this.flags.filepath, this.flags.channel, this.flags.initialcomment, this.flags.title); 
    if (resp.ok === true) {
      this.ux.log('Ok, file posted.');
    } else {
      throw new SfdxError(resp.error);
    }
    return resp;
  }

  public async run(): Promise<AnyJson> {
    const resp = await this.uploadFile();
    return resp;
  }
}
