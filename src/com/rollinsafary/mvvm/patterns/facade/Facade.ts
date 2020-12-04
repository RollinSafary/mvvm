import Model from '../../core/Model';
import View from '../../core/View';
import IView from '../mediator/IView';
import Proxy from '../model/IModel';

export default class Facade {
  protected static instance: Facade;
  public static getInstance(): Facade {
    if (!this.instance) {
      this.instance = new Facade();
    }
    return Facade.instance;
  }

  private model: Model;
  private view: View;

  constructor() {
    this.initializeFacade();
  }

  public initializeFacade(): void {
    this.initializeModel();
    this.initializeView();
  }

  public registerProxy<M, T extends Proxy<M>>(proxy: T): void {
    this.model.registerProxy<M, T>(proxy);
  }

  public retrieveProxy<M, T extends Proxy<M>>(proxyName: string): T {
    return this.model.retrieveProxy(proxyName);
  }

  public removeProxy<M, T extends Proxy<M>>(proxyName: string): T {
    if (this.model) {
      return this.model.removeProxy(proxyName);
    }
    return null;
  }

  public hasProxy(proxyName: string): boolean {
    return this.model.hasProxy(proxyName);
  }

  public registerView<T extends IView>(mediator: T): void {
    this.view.registerView(mediator);
  }

  public registerMediators<T extends IView>(mediators: T[]): void {
    for (const mediator of mediators) {
      this.view.registerView(mediator);
    }
  }

  public updateView<T extends IView>(mediator: T): void {
    this.view.updateView(mediator);
  }
  public getViewIndex<T extends IView>(mediator: T): number {
    return this.view.getViewIndex(mediator);
  }

  public retrieveView<T extends IView>(
    mediatorName: string,
    id?: number | string,
  ): T {
    return this.view.retrieveView(mediatorName, id);
  }
  public retrieveViews<T extends IView>(mediatorName: string): T[] {
    return this.view.retrieveViews(mediatorName);
  }

  public removeView<T extends IView>(
    mediatorName: string,
    id?: number | string,
  ): T {
    return this.view.removeView(mediatorName, id);
  }

  public removeViews<T extends IView>(
    mediatorAndIdPairs: { mediatorName: string; id?: number | string }[],
  ): T[] {
    const removedMediators: T[] = [];
    for (const pair of mediatorAndIdPairs) {
      removedMediators.push(this.view.removeView(pair.mediatorName, pair.id));
    }
    return removedMediators;
  }

  public hasView(viewName: string, id: number | string): boolean {
    return this.view.hasView(viewName, id);
  }
  public hasViewWithName(viewName: string): boolean {
    return this.view.hasView(viewName);
  }

  public getViewsCount(viewName: string): number {
    return this.view.getViewsCount(viewName);
  }

  public sendNotification(notificationName: string, ...args: any[]): void {
    this.notifyObservers(notificationName, ...args);
  }

  public notifyObservers(notificationName: string, ...args: any[]): void {
    this.view.notifyObservers(notificationName, ...args);
  }

  protected initializeModel(): void {
    if (this.model) {
      return;
    }
    this.model = Model.getInstance();
  }

  protected initializeView(): void {
    if (this.view) {
      return;
    }
    this.view = View.getInstance();
  }
}
