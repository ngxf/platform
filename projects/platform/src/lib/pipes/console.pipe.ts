import { Inject, InjectionToken, Pipe, PipeTransform } from '@angular/core';

export function consoleFactory() {
  return console;
}

export const CONSOLE = new InjectionToken<Console>('Console', {
  providedIn: 'root',
  factory: consoleFactory
});

export const skipValueOperators = [
  'count',
  'markTimeline',
  'time',
  'timeEnd',
  'profile',
  'profileEnd',
  'timeline',
  'timelineEnd',
  'timeStamp',
  'group',
  'groupCollapsed'
];

type IConsole = Console;

@Pipe({
  name: 'console'
})
export class ConsolePipe implements PipeTransform {

  constructor(@Inject(CONSOLE) private console: IConsole) {}

  // info(message?: any, ...optionalParams): void;
  transform<T>(message: T, logLevel: 'info', ...optionalParams: any[]): T;
  // log(message?: any, ...optionalParams): void;
  transform<T>(message: T, logLevel: 'log', ...optionalParams: any[]): T;
  // warn(message?: any, ...optionalParams): void;
  transform<T>(message: T, logLevel: 'warn', ...optionalParams: any[]): T;
  // exception(message?: string, ...optionalParams): void;
  transform<T>(message: T, logLevel: 'exception', ...optionalParams: any[]): T;
  // error(message?: any, ...optionalParams): void;
  transform<T>(message: T, logLevel: 'error', ...optionalParams: any[]): T;
  // debug(message?: any, ...optionalParams: any[]): void;
  transform<T>(message: T, logLevel: 'debug', ...optionalParams: any[]): T;
  // trace(message?: any, ...optionalParams: any[]): void;
  transform<T>(message: T, logLevel: 'trace', ...optionalParams: any[]): T;
  // dir(obj: any, options?: NodeJS.InspectOptions): void;
  transform<T>(obj: T, logLevel: 'dir'/*, options?: NodeJS.InspectOptions*/): T;
  // dirxml(value: any): void;
  transform<T>(value: T, logLevel: 'dirxml'): T;
  // table(...tabularData): void;
  transform<T>(value: T, logLevel: 'table'): T;
  // assert(value: any, message?: string, ...optionalParams): void;
  transform<T>(value: T, logLevel: 'trace', message: string, ...optionalParams: any[]): T;
  // count(label?: string): void;
  transform<T>(value: T, logLevel: 'count', label?: string): T;
  // markTimeline(label?: string): void;
  transform<T>(value: T, logLevel: 'markTimeline', label?: string): T;
  // time(label: string): void;
  transform<T>(value: T, logLevel: 'time', label?: string): T;
  // timeEnd(label: string): void;
  transform<T>(value: T, logLevel: 'timeEnd', label?: string): T;
  // profile(reportName?: string): void;
  transform<T>(value: T, logLevel: 'profile', reportName?: string): T;
  // profileEnd(reportName?: string): void;
  transform<T>(value: T, logLevel: 'profileEnd', reportName?: string): T;
  // timeline(label?: string): void;
  transform<T>(value: T, logLevel: 'timeline', label?: string): T;
  // timelineEnd(label?: string): void;
  transform<T>(value: T, logLevel: 'timelineEnd', label?: string): T;
  // timeStamp(label?: string): void;
  transform<T>(value: T, logLevel: 'timeStamp', label?: string): T;
  // group(groupTitle?: string, ...optionalParams: any[]): void;
  transform<T>(value: T, logLevel: 'group', groupTitle?: string, ...optionalParams: any[]): T;
  // groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
  transform<T>(value: T, logLevel: 'groupCollapsed', groupTitle?: string, ...optionalParams: any[]): T;
  // groupEnd(): void;
  transform<T>(value: T, logLevel: 'groupEnd'): T;
  // clear(): void;
  transform<T>(value: T, logLevel: 'clear'): T;
  transform<T>(message: string | T, logLevel: keyof Console = 'log', ...optionalParams: any[]): string | T {
    let params;
    if (skipValueOperators.includes(logLevel)) {
      if (optionalParams.length > 0) {
        params = optionalParams;
      } else {
        params = [ message ];
      }
    } else {
      params = [ message, ...optionalParams ];
    }

    this.console[ logLevel ](...params);
    return message;
  }

}
