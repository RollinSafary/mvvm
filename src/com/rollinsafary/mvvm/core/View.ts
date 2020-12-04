import EventEmitter from 'eventemitter3';
import IView from '../patterns/mediator/IView';

export default class View {
  protected static instance: View;
  public static getInstance(): View {
    if (!this.instance) {
      this.instance = new View();
    }
    return this.instance;
  }

  private viewsMap: IMediatorMap = {};
  private eventEmitter: EventEmitter = new EventEmitter();

  constructor() {
    this.initializeView();
  }

  public removeObserver(
    notificationName: string,
    observerMethod: (notificationName: string, ...args: any[]) => void,
    context: any,
  ): void {
    this.eventEmitter.removeListener(notificationName, observerMethod, context);
  }

  public registerObserver(
    notificationName: string,
    observerMethod: (notificationName: string, ...args: any[]) => void,
    context: any,
  ): void {
    this.eventEmitter.on(notificationName, observerMethod, context);
  }

  public notifyObservers(notificationName: string, ...args: any[]): void {
    this.eventEmitter.emit(notificationName, notificationName, ...args);
  }

  public registerView(viewComponent: IView): void {
    if (this.hasView(viewComponent.viewName, viewComponent.viewId)) {
      return;
    }

    viewComponent.initializeNotifier();
    viewComponent.registerNotificationInterests();
    // register the mediator for retrieval by name
    if (!this.viewsMap[viewComponent.viewName]) {
      this.viewsMap[viewComponent.viewName] = [];
    }
    this.viewsMap[viewComponent.viewName].push({
      view: viewComponent,
      interests: [...viewComponent.notificationInterests],
      id: viewComponent.viewId,
    });

    // get notification interests if any
    const interests: string[] = this.viewsMap[viewComponent.viewName][0]
      .interests;

    // register mediator as an observer for each notification
    if (interests.length > 0) {
      for (const interest of interests) {
        this.registerObserver(
          interest,
          viewComponent.handleSubscribedNotification,
          viewComponent,
        );
      }
    }

    viewComponent.onRegister();
  }

  public updateView(viewComponent: IView): void {
    if (!this.hasView(viewComponent.viewName, viewComponent.viewId)) {
      return;
    }
    const viewComponents: IViewsMapElement[] = this.viewsMap[
      viewComponent.viewName
    ];
    const targetElement: IViewsMapElement = viewComponents.filter(
      (element: IViewsMapElement) => {
        return element.id === viewComponent.viewId;
      },
    )[0];
    const registeredInterests: string[] = targetElement.interests;
    const newInterests: string[] = viewComponent.notificationInterests;
    for (const interest of registeredInterests) {
      // interest
      this.removeObserver(
        interest,
        viewComponent.handleSubscribedNotification,
        viewComponent,
      );
    }
    for (const interest of newInterests) {
      this.registerObserver(
        interest,
        viewComponent.handleSubscribedNotification,
        viewComponent,
      );
    }
    targetElement.interests = [...newInterests];
  }

  public retrieveView<T extends IView>(
    viewName: string,
    viewId?: number | string,
  ): T {
    const viewComponents: IViewsMapElement[] = this.viewsMap[
      viewName
    ] as IViewsMapElement[];
    if (!!viewComponents && viewComponents.length) {
      return viewId
        ? (viewComponents.filter(
            (element: IViewsMapElement) => element.id === viewId,
          )[0].view as T)
        : (viewComponents[0].view as T);
    } else {
      return null;
    }
  }

  public retrieveViews<T extends IView>(viewName: string): T[] {
    return this.viewsMap[viewName].map(
      (element: IViewsMapElement) => element.view as T,
    );
  }

  public removeView<T extends IView>(viewName: string, id: number | string): T {
    if (!this.viewsMap[viewName]) {
      return null;
    }
    const viewComponents: IViewsMapElement[] = this.viewsMap[viewName];
    const targetElement: IViewsMapElement = id
      ? viewComponents.filter((element: IViewsMapElement) => {
          return element.id === id;
        })[0]
      : this.viewsMap[viewName][0];
    if (!targetElement) {
      return null;
    }
    // for every notification the mediator is interested in...
    const interests: string[] = targetElement.interests;
    for (const interest of interests) {
      // interest
      this.removeObserver(
        interest,
        targetElement.view.handleSubscribedNotification,
        targetElement.view,
      );
    }
    // remove the mediator from the map
    const index: number = this.viewsMap[viewName].indexOf(targetElement);
    if (index !== -1) {
      this.viewsMap[viewName].splice(index, 1);
    }
    if (this.viewsMap[viewName].length === 0) {
      delete this.viewsMap[viewName];
    }

    // alert the mediator that it has been removed
    targetElement.view.onRemove();
    return targetElement.view as T;
  }

  public hasView(viewName: string, id?: number | string): boolean {
    return this.viewsMap[viewName]
      ? id
        ? this.viewsMap[viewName].filter((el: IViewsMapElement) => el.id === id)
            .length > 0
        : this.viewsMap[viewName].length > 0
      : false;
  }

  protected initializeView(): void {}

  public getViewsCount(viewName: string): number {
    return this.viewsMap[viewName] ? this.viewsMap[viewName].length : 0;
  }

  public getViewIndex<T extends IView>(view: T): number {
    const mediatorMapElements: IViewsMapElement[] = this.viewsMap[
      view.viewName
    ];
    const mapElement: IViewsMapElement = mediatorMapElements.filter(
      (el: IViewsMapElement) => el.view === view,
    )[0];
    return mediatorMapElements.indexOf(mapElement);
  }
}

export interface IViewsMapElement {
  view: IView;
  interests: string[];
  id: number | string;
}

export interface IMediatorMap {
  [key: string]: IViewsMapElement[];
}
