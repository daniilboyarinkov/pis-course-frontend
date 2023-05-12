import {useUpdateQuery} from '../app/auth/authApi';
import {
    useCreateMutation,
    useDeleteMutation,
    useGetAllQuery,
    useUpdateMutation
} from '../app/readersApi';
import {useAppSelector} from '../app/hooks';
import {userPermissions} from '../utils/utils';
import React, {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import {IReader, IReaderStatistic} from '../app/types';
import {useImmer} from 'use-immer';
import {useGetReaderStatisticQuery} from '../app/statisticApi';
import {toast} from 'react-toastify';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {IFormInput} from '../components/FormInput';
import {Table} from '../components/Table';
import {TABLE_READER_HEADER_TITLES, TABLE_STATISTIC_READER_HEADER_TITLES} from '../constants/table';
import {
    USER_CREATE_PERMISSION,
    USER_DELETE_PERMISSION,
    USER_UPDATE_PERMISSION,
    STATISTIC_READ_PERMISSION
} from '../constants/permissions';
import Modal from '../components/Modal';

const initial: IReader = {
    reader_id: 1,
    first_name: '',
    last_name: '',
    login: '',
    password: '',
}

const CREATE_MODAL = 'create-modal';
const UPDATE_MODAL = 'update-modal';
const DELETE_MODAL = 'delete-modal';

export default function ReadersPage() {
    const {data: _} = useUpdateQuery('');
    const {data = [], isLoading, error, refetch} = useGetAllQuery("");

    const {user} = useAppSelector(state => state.userState);
    const permissions = userPermissions(user?.role);

    const [searchByName, setSearchByName] = useState('');

    const filtered = data
        .filter(d =>
            d.first_name.toLowerCase().includes(searchByName.toLowerCase())
            || d.last_name.toLowerCase().includes(searchByName.toLowerCase())
        );

    const [active, setActive] = useState<IReader | null>(null);
    const [newT, setNewT] = useImmer<IReader>(initial);
    const [updated, setUpdated] = useImmer<IReader>(initial);
    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        setUpdated(active ?? initial);
    }, [active, setUpdated])

    const [createFn] = useCreateMutation();
    const [updateFn] = useUpdateMutation();
    const [deleteFn] = useDeleteMutation();

    const {data: d} = useGetReaderStatisticQuery(String(active?.reader_id ?? '1'));

    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await createFn(newT).unwrap()
            .then(() => {
                toast.success("Читатель была успешно создан");
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

        if (deleteId !== active?.reader_id) {
            toast.info(`Читатель ${active?.reader_id ?? deleteId} не был удален`);
            return;
        }

        await deleteFn(deleteId).unwrap()
            .then(() => {
                toast.success(`Читатель ${deleteId} была успешно удален`);
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
                label_text: 'Имя',
                type: 'text',
                placeholder: 'Имя...',
                value: newT.first_name,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.first_name = e.target.value
                }),
            },
            {
                id: 'input-form-2',
                label_text: 'Фамилия',
                type: 'text',
                placeholder: 'Фамилия...',
                value: newT.last_name,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.last_name = e.target.value
                }),
            },
            {
                id: 'input-form-3',
                label_text: 'Логин',
                type: 'text',
                placeholder: 'Логин...',
                value: newT.login,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.login = e.target.value
                }),
            },
            {
                id: 'input-form-4',
                label_text: 'Пароль',
                type: 'text',
                placeholder: 'Пароль...',
                value: newT.password,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.password = e.target.value
                }),
            },
        ],
        [newT.first_name, newT.last_name, newT.login, newT.password, setNewT]);

    const updateFields = useMemo((): IFormInput[] => [
            {
                id: 'input-form-1',
                label_text: 'Имя',
                type: 'text',
                placeholder: 'Имя...',
                value: updated.first_name,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    (d as IReader).first_name = e.target.value
                }),
            },
            {
                id: 'input-form-2',
                label_text: 'Фамилия',
                type: 'text',
                placeholder: 'Фамилия...',
                value: updated.last_name,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    (d as IReader).last_name = e.target.value
                }),
            },
            {
                id: 'input-form-2',
                label_text: 'Логин',
                type: 'text',
                placeholder: 'Логин...',
                value: updated.login,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    (d as IReader).login = e.target.value
                }),
            },
            {
                id: 'input-form-2',
                label_text: 'Пароль',
                type: 'text',
                placeholder: 'Пароль...',
                value: updated.password,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    (d as IReader).password = e.target.value
                }),
            },
        ],
        [setUpdated, updated.first_name, updated.last_name, updated.login, updated.password]);

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
                <p className="text-2xl">Читатели</p>
                <div className="flex items-center gap-4">
                    <p className="text-xl mr-12">Поиск&nbsp;по:</p>
                    <input
                        value={searchByName}
                        onChange={(e) => setSearchByName(e.target.value)}
                        type="text"
                        placeholder="Имени..."
                        className="input input-bordered w-full max-w-xs"
                    />
                </div>
            </div>
            <div className="grid" style={{gridTemplateColumns: '3fr 1fr'}}>
                <div className="p-4">
                    <Table
                        data={filtered.map(f => ({
                            ...f,
                            password: '*****'
                        }))}
                        headers={TABLE_READER_HEADER_TITLES}
                        onRowClick={(id) => setActive(data.find(d => {
                            return d.reader_id === id;
                        }) ?? null)}
                    />
                </div>
                <div className="pt-2 pr-4">
                    {
                        active && (
                            <>
                                <p className='text-2xl'>Выбранный читатель:</p>
                                <Table data={Object.keys(active).map((key, index) => ({
                                    columnTitle: TABLE_READER_HEADER_TITLES[index]?.title ?? '',
                                    [key]: (index === Object.keys(active).length - 1)
                                        ? '*****'
                                        : active[key as keyof IReader],
                                }))}/>
                            </>
                        )
                    }
                    {
                        permissions.includes(STATISTIC_READ_PERMISSION) && active && d && (
                            <div className="py-8">
                                <p className='text-2xl'>Статистика:</p>
                                <Table data={Object.keys(d).map((key, index) => {
                                    return ({
                                        columnTitle: TABLE_STATISTIC_READER_HEADER_TITLES[index].title,
                                        [key]: d[key as keyof IReaderStatistic],
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
                                        permissions.includes(USER_UPDATE_PERMISSION) && (
                                            <label htmlFor={UPDATE_MODAL}
                                                   className="flex-auto btn btn-active btn-primary">Изменить</label>
                                        )
                                    }
                                    {
                                        permissions.includes(USER_DELETE_PERMISSION) && (
                                            <label htmlFor={DELETE_MODAL}
                                                   className="flex-auto btn btn-active btn-secondary">Удалить</label>
                                        )
                                    }
                                </>
                            )
                        }
                        {
                            permissions.includes(USER_CREATE_PERMISSION) && (
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
