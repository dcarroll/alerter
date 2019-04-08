import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { Twilio } from 'twilio';
import TwilioConfig from '../../../lib/twilioconfig';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('alerter', 'twiliosendalert');

export default class SendAlert extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx alerter:sendalert --message 'Hey, you package is created' --phone 1234567890
  Message sent!
  `
  ];

  public static args = [];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    message: flags.string({char: 'm', required: true, description: messages.getMessage('messageFlagDescription')}),
    phone: flags.string({char: 'p', required: true, description: messages.getMessage('phoneFlagDescription')})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {

    let twilioConfig = await TwilioConfig.create({ isGlobal: true});
    twilioConfig.read();
    const authtoken = twilioConfig.get('authtoken').toString();
    const accountsid = twilioConfig.get('accountsid').toString();
    const twilionumber = twilioConfig.get('twilionumber').toString();

      const client = new Twilio(accountsid, authtoken);

      return await client.messages.create({
        body: this.flags.message,
        to: this.flags.phone,  // Text this number
        from: twilionumber // From a valid Twilio number
      }).then(async (message) => {
        console.log('Message successfully sent to ' + this.flags.phone + ' \nMessage Id: ' + message.sid);
        return { message: 'Message successfully sent to ' + this.flags.phone, messageSid: message.sid };
      }).catch((reason) => {
        this.ux.error(reason);
        throw new SfdxError(reason.message, 'alerter', [], 1, reason);
        return (reason);
      })
    
  }
}
