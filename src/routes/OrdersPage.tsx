import {useUpdateQuery} from '../app/auth/authApi';
import {useCreateMutation, useDeleteMutation, useGetAllQuery, useUpdateMutation} from '../app/ordersApi';
import {useGetAllQuery as useGetAllLibraries} from '../app/librariesApi';
import {useGetAllQuery as useGetAllBooks} from '../app/booksApi';
import {useGetAllQuery as useGetAllReaders} from '../app/readersApi';
import {useAppSelector} from '../app/hooks';
import {userPermissions} from '../utils/utils';
import React, {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import {IOrder, OrderStatus} from '../app/types';
import {useImmer} from 'use-immer';
import {toast} from 'react-toastify';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {IFormInput} from '../components/FormInput';
import {Table} from '../components/Table';
import {ORDER_CREATE_PERMISSION, ORDER_DELETE_PERMISSION, ORDER_UPDATE_PERMISSION,} from '../constants/permissions';
import Modal from '../components/Modal';
import {TABLE_ORDER_HEADER_TITLES} from '../constants/table';

const initial: IOrder = {
    order_id: 1,
    library_id: 1,
    book_id: 1,
    reader_id: 1,
    order_status: OrderStatus.OPENED,
    close_date: '',
    return_date: '',
    taken_date: '',
    isLongTerm: false,
    isPerpetual: false,
}

const CREATE_MODAL = 'create-modal';
const UPDATE_MODAL = 'update-modal';
const DELETE_MODAL = 'delete-modal';

export default function OrdersPage() {
    const {data: _} = useUpdateQuery('');
    const {data = [], isLoading, error, refetch} = useGetAllQuery("");
    const {data: libraries} = useGetAllLibraries('');
    const {data: books} = useGetAllBooks('');
    const {data: readers} = useGetAllReaders('');

    const {user} = useAppSelector(state => state.userState);
    const permissions = userPermissions(user?.role);

    const [searchByName, setSearchByName] = useState('');

    const filtered = data
        .filter(d => d);

    const [active, setActive] = useState<IOrder | null>(null);
    const [newT, setNewT] = useImmer<IOrder>(initial);
    const [updated, setUpdated] = useImmer<IOrder>(initial);
    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        setUpdated(active ?? initial);
    }, [active, setUpdated])

    const [createFn] = useCreateMutation();
    const [updateFn] = useUpdateMutation();
    const [deleteFn] = useDeleteMutation();

    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await createFn(newT).unwrap()
            .then(() => {
                toast.success("Заказ успешно оформлен!");
                setNewT(initial);
            })
            .catch((err: FetchBaseQueryError) => {
                console.log(err);
                toast.error(`Произошла ошибка: ${err.data}`);
            });
    }

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await updateFn(updated!).unwrap()
            .then(() => {
                toast.success("Успех!");
                setNewT(initial);
            })
            .catch((err: FetchBaseQueryError) => {
                console.log(err);
                toast.error(`Произошла ошибка: ${err.data}`);
            });
    }

    const handleDelete = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (deleteId !== active?.library_id) {
            toast.info(`Заказ ${active?.library_id ?? deleteId} не был удален`);
            return;
        }

        await deleteFn(deleteId).unwrap()
            .then(() => {
                toast.success(`Заказ ${deleteId} был успешно удален`);
                setDeleteId(0);
            })
            .catch((err: FetchBaseQueryError) => {
                console.log(err);
                toast.error(`Произошла ошибка: ${err.data}`);
            });
    }

    const createFields = useMemo((): IFormInput[] => [
            {
                id: 'input-form-1',
                label_text: 'Библиотека',
                type: 'radio',
                value: newT.library_id,
                items: libraries,
                renderItemName: 'address',
                onChangeItemName: 'library_id',
                onChange: (e: string) => setNewT(d => {
                    d.library_id = +e;
                }),
            },
            {
                id: 'input-form-2',
                label_text: 'Книга',
                type: 'radio',
                value: newT.book_id,
                items: books,
                renderItemName: 'title',
                onChangeItemName: 'book_id',
                onChange: (e: string) => setNewT(d => {
                    d.book_id = +e;
                }),
            },
            {
                id: 'input-form-3',
                label_text: 'Читатель',
                type: 'radio',
                value: newT.reader_id,
                items: readers,
                renderItemName: 'last_name',
                onChangeItemName: 'reader_id',
                onChange: (e: string) => setNewT(d => {
                    d.reader_id = +e;
                }),
            },
            {
                id: 'input-form-4',
                label_text: 'Статус',
                type: 'radio',
                value: newT.order_status,
                items: [OrderStatus.OPENED, OrderStatus.OVERDUED, OrderStatus.CLOSED],
                onChangeItemName: 'order_status',
                onChange: (e: string) => setNewT(d => {
                    d.order_status = e as OrderStatus;
                }),
            },
            {
                id: 'input-form-5',
                label_text: 'Дата возврата',
                type: 'text',
                value: newT.return_date,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.return_date = e.target.value
                }),
            },
            {
                id: 'input-form-6',
                label_text: 'Долгосрочный?',
                type: 'bool',
                value: newT.isLongTerm,
                onChange: () => setNewT(d => ({
                    ...d,
                    isLongTerm: !d.isLongTerm,
                })),
            },
            {
                id: 'input-form-7',
                label_text: 'Бессрочный?',
                type: 'bool',
                value: newT.isPerpetual,
                onChange: () => setNewT(d => ({
                    ...d,
                    isPerpetual: !d.isPerpetual,
                })),
            },
        ],
        [books, libraries, newT.book_id, newT.isLongTerm, newT.isPerpetual, newT.library_id, newT.order_status, newT.reader_id, newT.return_date, readers, setNewT]);

    const updateFields = useMemo((): IFormInput[] => [
            {
                id: 'input-form1-1',
                label_text: 'Библиотека',
                type: 'radio',
                value: updated.library_id,
                items: libraries,
                renderItemName: 'address',
                onChangeItemName: 'library_id',
                onChange: (e: string) => setUpdated(d => {
                    d.library_id = +e;
                }),
            },
            {
                id: 'input-form1-2',
                label_text: 'Книга',
                type: 'radio',
                value: updated.book_id,
                items: books,
                renderItemName: 'title',
                onChangeItemName: 'book_id',
                onChange: (e: string) => setUpdated(d => {
                    d.book_id = +e;
                }),
            },
            {
                id: 'input-form1-3',
                label_text: 'Читатель',
                type: 'radio',
                value: updated.reader_id,
                items: readers,
                renderItemName: 'last_name',
                onChangeItemName: 'reader_id',
                onChange: (e: string) => setUpdated(d => {
                    d.reader_id = +e;
                }),
            },
            {
                id: 'input-form1-4',
                label_text: 'Статус',
                type: 'radio',
                value: updated.order_status,
                items: [OrderStatus.OPENED, OrderStatus.OVERDUED, OrderStatus.CLOSED],
                onChangeItemName: 'order_status',
                onChange: (e: string) => setUpdated(d => {
                    d.order_status = e as OrderStatus;
                }),
            },
            {
                id: 'input-form1-5',
                label_text: 'Дата возврата',
                type: 'text',
                value: updated.return_date,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    d.return_date = e.target.value
                }),
            },
            {
                id: 'input-form1-6',
                label_text: 'Долгосрочный?',
                type: 'bool',
                value: updated.isLongTerm,
                onChange: () => setUpdated(d => ({
                    ...d,
                    isLongTerm: !d.isLongTerm,
                })),
            },
            {
                id: 'input-form1-7',
                label_text: 'Бессрочный?',
                type: 'bool',
                value: updated.isPerpetual,
                onChange: () => setUpdated(d => ({
                    ...d,
                    isPerpetual: !d.isPerpetual,
                })),
            },
        ],
        [books, libraries, readers, setUpdated, updated.book_id, updated.isLongTerm, updated.isPerpetual, updated.library_id, updated.order_status, updated.reader_id, updated.return_date]);

    const deleteFields = useMemo((): IFormInput[] => [
            {
                id: 'input-form-1',
                label_text: 'Подтвердите удаление, введя ID строки',
                type: 'number',
                placeholder: 'ID...',
                value: deleteId,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setDeleteId(+e.target.value),
            },
        ],
        [deleteId]);


    if (error) {
        return <div>error...</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="py-8 px-4 flex justify-between">
                <p className="text-2xl">Заказы</p>
                <div className="flex items-center gap-4">
                    <p className="text-xl mr-12">Поиск&nbsp;по:</p>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Адресу</span>
                        </label>
                        <input
                            value={searchByName}
                            onChange={(e) => setSearchByName(e.target.value)}
                            type="text"
                            placeholder="Адресу..."
                            className="input input-bordered w-full max-w-xs"
                        />
                    </div>
                </div>
            </div>
            <div className="grid" style={{gridTemplateColumns: '3fr 1fr'}}>
                <div className="p-4">
                    <Table
                        data={filtered}
                        headers={TABLE_ORDER_HEADER_TITLES}
                        onRowClick={(id) => setActive(data.find(d => {
                            return d.library_id === id;
                        }) ?? null)}
                    />
                </div>
                <div className="pt-2 pr-4">
                    {
                        active && (
                            <>
                                <p className='text-2xl'>Выбранный заказ:</p>
                                <Table data={Object.keys(active).map((key, index) => ({
                                    columnTitle: TABLE_ORDER_HEADER_TITLES[index]?.title ?? '',
                                    [key]: active[key as keyof IOrder],
                                }))}/>
                            </>
                        )
                    }
                    {/* CONTROLS */}
                    <div className="flex py-4 gap-2">
                        {
                            active && (
                                <>
                                    {
                                        permissions.includes(ORDER_UPDATE_PERMISSION) && (
                                            <label htmlFor={UPDATE_MODAL}
                                                   className="flex-auto btn btn-active btn-primary">Изменить</label>
                                        )
                                    }
                                    {
                                        permissions.includes(ORDER_DELETE_PERMISSION) && (
                                            <label htmlFor={DELETE_MODAL}
                                                   className="flex-auto btn btn-active btn-secondary">Удалить</label>
                                        )
                                    }
                                </>
                            )
                        }
                        {
                            permissions.includes(ORDER_CREATE_PERMISSION) && (
                                <label htmlFor={CREATE_MODAL}
                                       className="flex-auto btn btn-active btn-accent">Создать</label>
                            )
                        }
                    </div>
                    <div className="flex pb-4 gap-2">
                        <button onClick={refetch} className="flex-auto btn btn-active">Обновить</button>
                    </div>
                </div>
            </div>

            <Modal name={CREATE_MODAL} fields={createFields} submitAction={handleCreate} submitColor='accent'/>
            <Modal name={UPDATE_MODAL} fields={updateFields} submitAction={handleUpdate} submitColor='primary'/>
            <Modal name={DELETE_MODAL} fields={deleteFields} submitAction={handleDelete} submitColor='danger'/>
        </div>
    )
}
