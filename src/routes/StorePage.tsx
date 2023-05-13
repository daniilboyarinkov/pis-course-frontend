import {useUpdateQuery} from '../app/auth/authApi';
import {useCreateMutation, useDeleteMutation, useGetAllQuery, useUpdateMutation} from '../app/storeApi';
import {useGetAllQuery as useGetAllLibraries} from '../app/librariesApi';
import {useGetAllQuery as useGetAllBooks} from '../app/booksApi';
import {useGetAllQuery as useGetAllReaders} from '../app/readersApi';
import {useAppSelector} from '../app/hooks';
import {userPermissions} from '../utils/utils';
import React, {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import {IStore} from '../app/types';
import {useImmer} from 'use-immer';
import {toast} from 'react-toastify';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {IFormInput} from '../components/FormInput';
import {Table} from '../components/Table';
import {TABLE_STORE_HEADER_TITLES} from '../constants/table';
import {
    STATISTIC_READ_PERMISSION,
    STORE_CREATE_PERMISSION,
    STORE_DELETE_PERMISSION,
    STORE_UPDATE_PERMISSION,
} from '../constants/permissions';
import Modal from '../components/Modal';
import {useGetTakenStatisticQuery} from '../app/statisticApi';

const initial: IStore = {
    library_id: 1,
    book_id: 1,
    count: 1,
}

const CREATE_MODAL = 'create-modal';
const UPDATE_MODAL = 'update-modal';
const DELETE_MODAL = 'delete-modal';

export default function StorePage() {
    const {data: _} = useUpdateQuery('');
    const {data = [], isLoading, error, refetch} = useGetAllQuery("");

    const {data: libraries} = useGetAllLibraries('');
    const {data: books} = useGetAllBooks('');
    const {data: readers} = useGetAllReaders('');

    const {user} = useAppSelector(state => state.userState);
    const permissions = userPermissions(user?.role);

    const {data: ddd} = useGetTakenStatisticQuery('');

    const filtered = data.map(d => ({
        ...d,
        book_id: (books ?? []).find(f => f.book_id === d.book_id)?.title,
    }))

    const [active, setActive] = useState<IStore | null>(null);
    const [newT, setNewT] = useImmer<IStore>(initial);
    const [updated, setUpdated] = useImmer<IStore>(initial);
    const [deleteId, setDeleteId] = useState(0);
    const [deleteBookId, setDeleteBookId] = useState(0);

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
                toast.success("Запись была успешно добавлена!");
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
            toast.info(`Запись ${active?.library_id ?? deleteId} не была удалена`);
            return;
        }

        // @ts-ignore
        await deleteFn([deleteId, deleteBookId]).unwrap()
            .then(() => {
                toast.success(`Запись №${deleteId}#${deleteBookId} была успешно удалена`);
                setDeleteId(0);
                setDeleteBookId(0);
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
                id: 'input-form-5',
                label_text: 'Количество',
                type: 'number',
                value: newT.count,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.count = +e.target.value
                }),
            },
        ],
        [books, libraries, newT.book_id, newT.count, newT.library_id, setNewT]);

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
                id: 'input-form1-5',
                label_text: 'Количество',
                type: 'number',
                value: updated.count,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    d.count = +e.target.value
                }),
            },
        ],
        [books, libraries, setUpdated, updated.book_id, updated.count, updated.library_id]);

    const deleteFields = useMemo((): IFormInput[] => [
            {
                id: 'input-form2-1',
                label_text: 'Подтвердите удаление, введя ID библиотеки',
                type: 'number',
                placeholder: 'ID...',
                value: deleteId,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setDeleteId(+e.target.value),
            },
            {
                id: 'input-form2-2',
                label_text: 'Подтвердите удаление, введя ID книги',
                type: 'number',
                placeholder: 'ID...',
                value: deleteBookId,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setDeleteBookId(+e.target.value),
            },
        ],
        [deleteBookId, deleteId]);


    if (error) {
        return <div>error...</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="py-8 px-4 flex justify-between">
                <p className="text-2xl">Хранилище</p>
                <div className="flex items-center gap-4">
                    {/*<p className="text-xl mr-12">Поиск&nbsp;по:</p>*/}
                    {/*<input*/}
                    {/*    value={searchByName}*/}
                    {/*    onChange={(e) => setSearchByName(e.target.value)}*/}
                    {/*    type="text"*/}
                    {/*    placeholder="Адресу..."*/}
                    {/*    className="input input-bordered w-full max-w-xs"*/}
                    {/*/>*/}
                </div>
            </div>
            <div className="grid" style={{gridTemplateColumns: '3fr 1fr'}}>
                <div className="p-4">
                    <Table
                        data={filtered}
                        headers={TABLE_STORE_HEADER_TITLES}
                        onRowClick={(library_id: any, book_id: any) => setActive(data.find(d => {
                            return d.library_id === library_id && (books ?? []).find(f => f.book_id === d.book_id)?.title === book_id;
                        }) ?? null)}
                    />
                </div>
                <div className="pt-2 pr-4">
                    {
                        active && (
                            <>
                                <Table data={Object.keys(active).map((key, index) => ({
                                    columnTitle: TABLE_STORE_HEADER_TITLES[index]?.title ?? '',
                                    [key]: active[key as keyof IStore],
                                }))}/>
                            </>
                        )
                    }
                    {
                        permissions.includes(STATISTIC_READ_PERMISSION) && active && ddd && (
                            <div className="py-8">
                                <p className='text-2xl'>Книги на руках:</p>
                                <Table headers={[
                                    {id: '1', title: 'Читатель'},
                                    {id: '2', title: 'Книга'},
                                ]} data={Object.keys(ddd).map((key, index) => {
                                    return ({
                                        reader: (readers ?? []).find(r => ddd[key as any].reader_id === r.reader_id)?.last_name ?? '',
                                        book: (books ?? []).find(r => ddd[key as any].book_id === r.book_id)?.title ?? '',
                                    })
                                })}/>
                            </div>
                        )
                    }
                    {/* CONTROLS */}
                    <div className="flex py-4 gap-2">
                        {
                            active && (
                                <>
                                    {
                                        permissions.includes(STORE_UPDATE_PERMISSION) && (
                                            <label htmlFor={UPDATE_MODAL}
                                                   className="flex-auto btn btn-active btn-primary">Изменить</label>
                                        )
                                    }
                                    {
                                        permissions.includes(STORE_DELETE_PERMISSION) && (
                                            <label htmlFor={DELETE_MODAL}
                                                   className="flex-auto btn btn-active btn-secondary">Удалить</label>
                                        )
                                    }
                                </>
                            )
                        }
                        {
                            permissions.includes(STORE_CREATE_PERMISSION) && (
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
