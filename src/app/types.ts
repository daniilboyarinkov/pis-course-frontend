export enum Position {
    LIBRARIAN = 'librarian',
    BIBLIOGRAPHER = 'bibliographer',
    ADMINISTRATOR = 'administrator',
    READER = 'reader',
}

export enum OrderStatus {
    OPENED = 'opened',
    CLOSED = 'closed',
    OVERDUED = 'overdued',
}

export interface IBook {
    book_id: number,
    title: string,
    registration_date?: any,
    author?: string,
}

export interface IBookStatistic extends IBook {
    taken_count: number,
}

export interface IEmployee {
    employee_id: number,
    library_id: number,
    first_name: string,
    last_name: string,
    login: string,
    password: string,
    position: Position,
    role?: Position,
    pos?: Position,
}

export interface IReader {
    reader_id: number,
    first_name: string,
    last_name: string,
    login: string,
    password: string,
    role?: Position,
}

export interface IReaderStatistic {
    reader_id: number,
    full_name: string,
    opened_count: number,
    closed_count: number,
    overdued_count: number,
}

export type IUser = IEmployee | IReader;

export interface ILibrary {
    library_id: number,
    address: string,
}

export interface ILibraryStatistic {
    opened_count: number,
    closed_count: number,
    overdued_count: number,
}

export interface IStore {
    library_id: number,
    book_id: number,
    count: number,
}

export interface IEvent {
    event_id: number,
    library_id: number,
    employee_id: number,
    start_date: string,
    end_date: string,
    title: string,
    description: string,
}

export interface IOrder {
    order_id: number,
    reader_id: number,
    library_id: number,
    book_id: number,
    taken_date: string,
    return_date: string,
    close_date: string,
    order_status: OrderStatus,
    isLongTerm: boolean,
    isPerpetual: boolean,
}
