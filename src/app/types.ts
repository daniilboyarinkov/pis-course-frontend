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
    book_id: string | number,
    registration_date: any,
    title: string,
    author?: string,
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

export type IUser = IEmployee | IReader;

export interface ILibrary {
    library_id: number,
    address: string,
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
