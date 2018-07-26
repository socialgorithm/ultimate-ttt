export default class PubSubber {
    private subscriptionTokens;
    protected publish(event: string, data: any): void;
    protected publishNamespaced(namespace: string, event: string, data: any): void;
    protected subscribeNamespaced(namespace: string, event: string, fn: Function): void;
    protected subscribe(event: string, fn: Function): void;
    protected unsubscribeAll(): void;
    private makeNamespace;
}
