import React, {useState} from "react";

import {TABLE_ROW_LIMIT} from "../constants/table";

type TableProps<T> = {
    /**
     * информация отображаемая в таблице
     */
    data: Array<T>;
    /**
     * заголовки столбцов таблицы
     */
    headers: IHeadRowTitle[];
    /**
     * действие выполняемое при клике на строку таблицы
     * @param id
     */
    onRowClick?: (id?: any) => any,
    /**
     * ограничение по количеству строк, отображаемых в таблице
     */
    rowLimit?: number;
    /**
     * скрывать ли строки выше предельно допустимого количества строк таблицы?
     */
    hideOverLimit?: boolean;
};

export function Table<T extends object>(props: TableProps<T>) {
    const [expanded, setExpanded] = useState(!props.hideOverLimit);

    const handleExpandedChange = () => setExpanded((prev) => !prev);

    return (
        <div className="grid place-items-center overflow-x-auto">
            {props.data.length > 0 ?
                <>
                    <table className="table-zebra table-compact table w-full">
                        <TableHeadRow headers={props.headers ?? []}/>
                        <tbody>
                        {props.data.map((item, index) =>
                            (props.hideOverLimit ?? true) && !expanded && index >= (props.rowLimit ?? TABLE_ROW_LIMIT) ? null : (
                                <TableRow<T>
                                    key={index}
                                    onRowClick={props.onRowClick}
                                    content={item}
                                    index={index + 1}
                                />
                            )
                        )}
                        </tbody>
                    </table>
                    <button className="btn my-2" onClick={handleExpandedChange}>
                        {expanded ? "Скрыть" : "Показать ещё"}
                    </button>
                </>
                : <div>No data...</div>}
        </div>
    );
}

export interface IHeadRowTitle {
    id: string;
    title: string;
}

type HeadRowProps = {
    headers: IHeadRowTitle[];
};

export const TableHeadRow = ({headers}: HeadRowProps) => {
    return (
        <thead>
        <tr>
            {headers.map((header, index) => (
                <th key={`${header.title}-${index}`}
                    className="whitespace-normal capitalize break-all"
                >{header.title}</th>
            ))}
        </tr>
        </thead>
    );
};

type TableRowProps<T> = {
    content: T;
    // номер строки
    index: number;
    onRowClick?: (id?: T[keyof T]) => any,
};

export function TableRow<T extends object>(props: TableRowProps<T>) {
    return (
        <tr onClick={() => props.onRowClick?.(props.content[Object.keys(props.content)[0] as keyof typeof props.content])}>
            {Object.keys(props.content).map((el, index) => (
                <td key={`${el}-${index}`} className="whitespace-normal">
                    {String(props.content[el as keyof typeof props.content])}
                </td>
            ))}
        </tr>
    );
}
