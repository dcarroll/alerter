import { ConfigFile } from "@salesforce/core";

export default class TwilioConfig extends ConfigFile<ConfigFile.Options> {
    public static getFileName(): string {
        return 'twilioconfig.json';
    }
}