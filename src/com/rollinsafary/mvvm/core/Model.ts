import Proxy from '../patterns/model/IModel';

export default class Model {
  protected static instance: Model;
  public static getInstance(): Model {
    if (!this.instance) {
      this.instance = new Model();
    }
    return this.instance;
  }

  private proxyMap: { [key: string]: Proxy<any> } = {};

  constructor() {
    this.initializeModel();
  }

  public registerProxy<M, T extends Proxy<M>>(proxy: T): void {
    proxy.initializeNotifier();
    this.proxyMap[proxy.proxyName] = proxy;
    proxy.onRegister();
  }

  public retrieveProxy<M, T extends Proxy<M>>(proxyName: string): T {
    return this.proxyMap[proxyName] as T;
  }

  public hasProxy(proxyName: string): boolean {
    return this.proxyMap[proxyName] !== undefined;
  }

  public removeProxy<M, T extends Proxy<M>>(proxyName: string): T {
    if (this.proxyMap[proxyName]) {
      const proxy: T = this.proxyMap[proxyName] as T;
      proxy.onRemove();
      delete this.proxyMap[proxyName];
      return proxy;
    }
    return null;
  }

  protected initializeModel(): void {}
}
