import { ConfigFile } from "@salesforce/core";

export default class SlackConfig extends ConfigFile<ConfigFile.Options> {
    public static getFileName(): string {
        return 'slackconfig.json';
    }
}