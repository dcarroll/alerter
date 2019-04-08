import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { Twilio } from 'twilio';
import TwilioConfig from '../../lib/twilioconfig';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('alerter', 'config');

export default class Configure extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx alerter:config --authtoken feae4a --accountsid 80b18 --verificationphonenumber 1232314321
  Message successfully sent, configuration confirmed 
  Message Id: SM170bf514384c4428bd293198b5558017
  `
  ];

  public static args = [];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    authtoken: flags.string({char: 't', required: true, description: messages.getMessage('authtokenFlagDescription')}),
    accountsid: flags.string({char: 'a', required: true, description: messages.getMessage('accountsidFlagDescription')}),
    verificationphonenumber: flags.string({ char: 'v', required: true, description: messages.getMessage('verificationphonenumberFlagDescription')}),
    twilionumber: flags.string({ char: 'n', required: true, description: messages.getMessage('twilionmberFlagDescription')})
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  protected results;

  public async run(): Promise<AnyJson> {

    // Test the twilio setup
    const client = new Twilio(this.flags.accountsid, this.flags.authtoken);

    await client.messages.create({
      body: 'Hello from Oclif',
      to: this.flags.verificationphonenumber,  // Text this number
      from: this.flags.twilionumber // From a valid Twilio number
    }).then(async (message) => {
      console.log('Message successfully sent, configuration confirmed \nMessage Id: ' + message.sid);
      const x = await TwilioConfig.create({ isGlobal: true });
      x.set('authtoken', this.flags.authtoken);
      x.set('accountsid', this.flags.accountsid);
      x.set('twilionumber', this.flags.twilionumber);
      x.write();
      this.results = { message: 'Message successfully sent, configuration confirmed', messageSid: message.sid };
    }).catch((reason) => {
      const e = new SfdxError(reason.message, 'authentication error', ['Check your token and secret and twilio number.']);
      this.results = e;
      throw e;
    })
    return this.results;
  }
}
