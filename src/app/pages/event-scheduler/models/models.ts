export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export interface SaveInLocalStorageEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

export interface MonthDay {
  date: Date;
}
