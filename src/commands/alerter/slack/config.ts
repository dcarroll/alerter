import { flags, SfdxCommand, TableOptions }   from '@salesforce/command';
import { Messages, SfdxError }  from '@salesforce/core';
import { AnyJson }              from '@salesforce/ts-types';
import SlackConfig              from '../../../lib/slackconfig';
import SlackLib                 from '../../../lib/slacklib';
import { TableColumn } from 'cli-ux/lib/styled/table';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('alerter', 'slackconfig');

export default class Configure extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx alerter:slack:config --slacktoken xxxxxxx --slackchannel '#CoolKids'
  Successfully configured alerter! Congratulations! 
  `
  ];

  public static args = [];

  protected static flagsConfig = {
    slacktoken: flags.string( { char: 't', required: true, description: messages.getMessage('slacktokenFlagDescription')}),
    slackchannel: flags.string({ char: 'c', required: false, description: messages.getMessage('slackchannelFlagDescription')})
  };

  protected async validateToken(): Promise<any> {
    
    const resp = await SlackLib.postMessage('Successfully configured alerter! Congratulations!', this.flags.slackchannel, ':thumbsup:', this.flags.slacktoken ); 
    if (resp.ok === true) {
      const slackconfig = await SlackConfig.create({ isGlobal: true });
      slackconfig.set('slacktoken', this.flags.slacktoken);
      slackconfig.write();
      this.ux.log('Successfully configured alerter! Congratulations!');
      return resp;
    } else {
      throw new SfdxError(resp.error);
    }
  }

  public async run(): Promise<AnyJson> {
    const res = await this.validateToken();
    const refreshChannel = await this.ux.prompt('Refresh channel list <y/n>?', { default: 'n', type: 'single' });
    if (refreshChannel === 'y') {
      const channels = await SlackLib.refreshChannelList();
      this.ux.log('');
      this.ux.table(channels, { columns: [ 
        { key: 'name', label: 'Name' },
        { key: 'id', label: 'ID'}, 
        { key: 'purpose.value', label: 'Purpose'}]});
      }
    return res;
  }
}
