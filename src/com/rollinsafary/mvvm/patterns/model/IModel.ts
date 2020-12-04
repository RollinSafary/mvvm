import Facade from '../facade/Facade';
import INotifier from '../observer/INotifier';

export default interface IModel<M> extends INotifier {
  proxyName: string;
  vo: M;
  facade: Facade;

  sendNotification: (notificationName: string, ...args: any[]) => void;

  initializeNotifier: () => void;

  onRegister: () => void;

  onRemove: () => void;
}
