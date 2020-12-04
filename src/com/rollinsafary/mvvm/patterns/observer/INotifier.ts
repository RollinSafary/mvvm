import Facade from '../facade/Facade';
export default interface INotifier {
  facade: Facade;
  initializeNotifier: () => void;
  sendNotification: (notificationName: string, ...args: any[]) => void;
}
