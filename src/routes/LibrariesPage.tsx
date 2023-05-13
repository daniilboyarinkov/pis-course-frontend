import {useUpdateQuery} from '../app/auth/authApi';
import {useCreateMutation, useDeleteMutation, useGetAllQuery, useUpdateMutation} from '../app/librariesApi';
import {useAppSelector} from '../app/hooks';
import {userPermissions} from '../utils/utils';
import React, {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import {ILibrary, ILibraryStatistic} from '../app/types';
import {useImmer} from 'use-immer';
import {useGetLibraryStatisticQuery} from '../app/statisticApi';
import {toast} from 'react-toastify';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {IFormInput} from '../components/FormInput';
import {Table} from '../components/Table';
import {TABLE_LIBRARY_HEADER_TITLES, TABLE_LIBRARY_STATISCTIC_HEADER_TITLES} from '../constants/table';
import {
    STATISTIC_READ_PERMISSION,
    LIBRARY_CREATE_PERMISSION,
    LIBRARY_DELETE_PERMISSION,
    LIBRARY_UPDATE_PERMISSION
} from '../constants/permissions';
import Modal from '../components/Modal';

const initial: ILibrary = {
    library_id: 1,
    address: '',
}

const CREATE_MODAL = 'create-modal';
const UPDATE_MODAL = 'update-modal';
const DELETE_MODAL = 'delete-modal';

export default function LibrariesPage() {
    const {data: _} = useUpdateQuery('');
    const {data = [], isLoading, error, refetch} = useGetAllQuery("");

    const {user} = useAppSelector(state => state.userState);
    const permissions = userPermissions(user?.role);

    const [searchByName, setSearchByName] = useState('');

    const filtered = data
        .filter(d =>
            d.address.toLowerCase().includes(searchByName.toLowerCase())
        );

    const [active, setActive] = useState<ILibrary | null>(null);
    const [newT, setNewT] = useImmer<ILibrary>(initial);
    const [updated, setUpdated] = useImmer<ILibrary>(initial);
    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        setUpdated(active ?? initial);
    }, [active, setUpdated])

    const [createFn] = useCreateMutation();
    const [updateFn] = useUpdateMutation();
    const [deleteFn] = useDeleteMutation();

    const {data: d} = useGetLibraryStatisticQuery(String(active?.library_id ?? '1'));

    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await createFn(newT).unwrap()
            .then(() => {
                toast.success("Библиотека была успешно добавлена!");
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
            toast.info(`Библиотека ${active?.library_id ?? deleteId} не была удалена`);
            return;
        }

        await deleteFn(deleteId).unwrap()
            .then(() => {
                toast.success(`Библиотека ${deleteId} была успешно удалена`);
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
                label_text: 'Адрес',
                type: 'text',
                placeholder: 'Адрес...',
                value: newT.address,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.address = e.target.value
                }),
            },
        ],
        [newT.address, setNewT]);

    const updateFields = useMemo((): IFormInput[] => [
            {
                id: 'input-form-1',
                label_text: 'Адрес',
                type: 'text',
                placeholder: 'Адрес...',
                value: updated.address,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    (d as ILibrary).address = e.target.value
                }),
            },
        ],
        [setUpdated, updated.address]);

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
                <p className="text-2xl">Библиотеки</p>
                <div className="flex items-center gap-4">
                    <p className="text-xl mr-12">Поиск&nbsp;по:</p>
                    <input
                        value={searchByName}
                        onChange={(e) => setSearchByName(e.target.value)}
                        type="text"
                        placeholder="Адресу..."
                        className="input input-bordered w-full max-w-xs"
                    />
                </div>
            </div>
            <div className="grid" style={{gridTemplateColumns: '3fr 1fr'}}>
                <div className="p-4">
                    <Table
                        data={filtered}
                        headers={TABLE_LIBRARY_HEADER_TITLES}
                        onRowClick={(id) => setActive(data.find(d => {
                            return d.library_id === id;
                        }) ?? null)}
                    />
                </div>
                <div className="pt-2 pr-4">
                    {
                        active && (
                            <>
                                <p className='text-2xl'>Выбранная библиотека:</p>
                                <Table data={Object.keys(active).map((key, index) => ({
                                    columnTitle: TABLE_LIBRARY_HEADER_TITLES[index]?.title ?? '',
                                    [key]: active[key as keyof ILibrary],
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
                                        columnTitle: TABLE_LIBRARY_STATISCTIC_HEADER_TITLES[index].title,
                                        [key]: d[key as keyof ILibraryStatistic],
                                    })
                                })}/>
                            </div>
                        )
                    }
                    {/* CONTROLS */}
                {/*    <div className="flex py-4 gap-2">*/}
                {/*        {*/}
                {/*            active && (*/}
                {/*                <>*/}
                {/*                    {*/}
                {/*                        permissions.includes(LIBRARY_UPDATE_PERMISSION) && (*/}
                {/*                            <label htmlFor={UPDATE_MODAL}*/}
                {/*                                   className="flex-auto btn btn-active btn-primary">Изменить</label>*/}
                {/*                        )*/}
                {/*                    }*/}
                {/*                    /!*{*!/*/}
                {/*                    /!*    permissions.includes(LIBRARY_DELETE_PERMISSION) && (*!/*/}
                {/*                    /!*        <label htmlFor={DELETE_MODAL}*!/*/}
                {/*                    /!*               className="flex-auto btn btn-active btn-secondary">Удалить</label>*!/*/}
                {/*                    /!*    )*!/*/}
                {/*                    /!*}*!/*/}
                {/*                    {*/}
                {/*                        permissions.includes(LIBRARY_DELETE_PERMISSION) && (*/}
                {/*                            <button onClick={() => alert('Я запрещаю вам удалять!')}*/}
                {/*                                   className="flex-auto btn btn-active btn-secondary">Удалить</button>*/}
                {/*                        )*/}
                {/*                    }*/}
                {/*                </>*/}
                {/*            )*/}
                {/*        }*/}
                {/*        {*/}
                {/*            permissions.includes(LIBRARY_CREATE_PERMISSION) && (*/}
                {/*                <label htmlFor={CREATE_MODAL}*/}
                {/*                       className="flex-auto btn btn-active btn-accent">Создать</label>*/}
                {/*            )*/}
                {/*        }*/}
                {/*    </div>*/}
                {/*    <div className="flex pb-4 gap-2">*/}
                {/*        <button onClick={refetch} className="flex-auto btn btn-active">Обновить</button>*/}
                {/*    </div>*/}
                </div>
            </div>

            <Modal name={CREATE_MODAL} fields={createFields} submitAction={handleCreate} submitColor='accent'/>
            <Modal name={UPDATE_MODAL} fields={updateFields} submitAction={handleUpdate} submitColor='primary'/>
            <Modal name={DELETE_MODAL} fields={deleteFields} submitAction={handleDelete} submitColor='danger'/>
        </div>
    )
}
