import INotifier from '../observer/INotifier';
export default interface IView extends INotifier {
  viewId: number;
  viewName: string;
  notificationInterests: string[];
  isAwake: boolean;

  sleep: () => void;
  wake: () => void;
  getViewName: () => string;
  getViewId: () => number;

  subscribeToNotifications: (...notificationNames: string[]) => void;
  subscribeToNotification: (notificationName: string) => void;
  unSubscribeFromNotifications: (...notificationNames: string[]) => void;
  unSubscribeFromNotification: (notificationName: string) => void;

  handleSubscribedNotification: (
    notificationName: string,
    ...args: any[]
  ) => void;
  registerNotificationInterests: () => void;

  handleNotification: (notificationName: string, ...args: any[]) => void;
  onRegister: () => void;
  onRemove: () => void;
}
