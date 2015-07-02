interface Auth0Lock {
    new (clientID: string, domain: string): Auth0Lock;
    parseHash(hash: any): any;
    show(options: any): void;
}
