import { IHeadRowTitle } from '../components/Table';

export const TABLE_BOOK_HEADER_TITLES: IHeadRowTitle[] = [
    { id: 'title-1', title: 'ID' },
    { id: 'title-2', title: 'Дата регистрации' },
    { id: 'title-3', title: 'Название' },
    { id: 'title-4', title: 'Автор' },
];

export const TABLE_STATISTIC_BOOK_HEADER_TITLES: IHeadRowTitle[] = [
    { id: 'title-1', title: 'ID' },
    { id: 'title-2', title: 'Дата регистрации' },
    { id: 'title-3', title: 'Название' },
    { id: 'title-4', title: 'Автор' },
    { id: 'title-5', title: 'Была взята (раз)' },
];

export const TABLE_READER_HEADER_TITLES: IHeadRowTitle[] = [
    { id: 'title-1', title: 'ID' },
    { id: 'title-2', title: 'Имя' },
    { id: 'title-3', title: 'Фамилия' },
    { id: 'title-4', title: 'Логин' },
    { id: 'title-5', title: 'Пароль' },
];

export const TABLE_STATISTIC_READER_HEADER_TITLES: IHeadRowTitle[] = [
    { id: 'title-2', title: 'Имя' },
    { id: 'title-3', title: 'Книг взято' },
    { id: 'title-4', title: 'Книг возвращено' },
    { id: 'title-5', title: 'Книг просрочено' },
];

export const TABLE_EMPLOYEE_HEADER_TITLES: IHeadRowTitle[] = [
    { id: 'title-1', title: 'ID' },
    { id: 'title-2', title: 'Библиотека' },
    { id: 'title-3', title: 'Имя' },
    { id: 'title-4', title: 'Фамилия' },
    { id: 'title-5', title: 'Логин' },
    { id: 'title-6', title: 'Пароль' },
    { id: 'title-7', title: 'Должность' },
];

export const TABLE_LIBRARY_HEADER_TITLES: IHeadRowTitle[] = [
    { id: 'title-1', title: 'ID' },
    { id: 'title-2', title: 'Адрес' },
];

export const TABLE_EVENT_HEADER_TITLES: IHeadRowTitle[] = [
    { id: 'title-1', title: 'ID' },
    { id: 'title-2', title: 'Библиотека' },
    { id: 'title-3', title: 'Оформил' },
    { id: 'title-4', title: 'Дата начала' },
    { id: 'title-5', title: 'Дата окончания' },
    { id: 'title-6', title: 'Название' },
    { id: 'title-7', title: 'Описание' },
];

export const TABLE_ORDER_HEADER_TITLES: IHeadRowTitle[] = [
    { id: 'title-1', title: 'ID' },
    { id: 'title-2', title: 'Читатель' },
    { id: 'title-3', title: 'Библиотека' },
    { id: 'title-4', title: 'Книга' },
    { id: 'title-5', title: 'Дата взятия' },
    { id: 'title-6', title: 'Дата окончания' },
    { id: 'title-7', title: 'Дата возвращения' },
    { id: 'title-8', title: 'Статус' },
    { id: 'title-9', title: 'Долгосрочный?' },
    { id: 'title-10', title: 'Бессрочный?' },
];

export const TABLE_ROW_LIMIT = 10;
