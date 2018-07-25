import * as PubSub from 'pubsub-js';

/**
 * Any class that wants to use the PubSub bus needs to extend this class.
 * No one should use PubSub directly!!
 */
export default class PubSubber {
    private subscriptionTokens: Array<string> = [];

    protected publish(event: string, data: any) {
        PubSub.publish(event, data);
    }

    protected publishNamespaced(namespace: string, event: string, data: any) {
        this.publish(this.makeNamespace(namespace, event), data);
    }

    protected subscribeNamespaced(namespace: string, event: string, fn: Function) {
        this.subscribe(this.makeNamespace(namespace, event), fn);
    }

    protected subscribe(event: string, fn: Function): void {
        const token = PubSub.subscribe(event, fn);
        this.subscriptionTokens.push(token);
    }

    protected unsubscribeAll() {
        this.subscriptionTokens.forEach(token => {
            PubSub.unsubscribe(token);
        });
    }

    private makeNamespace(namespace: string, event: string): string {
        return `${event}--${namespace}`;
    }
}