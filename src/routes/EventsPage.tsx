import {useUpdateQuery} from '../app/auth/authApi';
import {useCreateMutation, useDeleteMutation, useGetAllQuery, useUpdateMutation} from '../app/eventsApi';
import {useGetAllQuery as useGetAllLibraries} from '../app/librariesApi';
import {useGetAllQuery as useGetAllEmployees} from '../app/employeesApi';
import {useAppSelector} from '../app/hooks';
import {userPermissions} from '../utils/utils';
import React, {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import {IEvent} from '../app/types';
import {useImmer} from 'use-immer';
import {toast} from 'react-toastify';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {IFormInput} from '../components/FormInput';
import {Table} from '../components/Table';
import {TABLE_EVENT_HEADER_TITLES} from '../constants/table';
import {EVENT_CREATE_PERMISSION, EVENT_DELETE_PERMISSION, EVENT_UPDATE_PERMISSION} from '../constants/permissions';
import Modal from '../components/Modal';

const initial: IEvent = {
    event_id: 1,
    title: '',
    description: '',
    employee_id: 1,
    library_id: 1,
    start_date: '',
    end_date: '',
}

const CREATE_MODAL = 'create-modal';
const UPDATE_MODAL = 'update-modal';
const DELETE_MODAL = 'delete-modal';

export default function EventsPage() {
    const {data: _} = useUpdateQuery('');
    const {data = [], isLoading, error, refetch} = useGetAllQuery("");
    const {data: libraries} = useGetAllLibraries('');
    const {data: employees} = useGetAllEmployees('');

    const {user} = useAppSelector(state => state.userState);
    const permissions = userPermissions(user?.role);

    const [searchByName, setSearchByName] = useState('');

    const filtered = data
        .filter(d => d);

    const [active, setActive] = useState<IEvent | null>(null);
    const [newT, setNewT] = useImmer<IEvent>(initial);
    const [updated, setUpdated] = useImmer<IEvent>(initial);
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

        if (deleteId !== active?.event_id) {
            toast.info(`Заказ ${active?.event_id ?? deleteId} не был удален`);
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
                label_text: 'Название',
                placeholder: 'Название...',
                type: 'text',
                value: newT.title,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.title = e.target.value
                }),
            },
            {
                id: 'input-form-2',
                label_text: 'Описание',
                placeholder: 'Описание...',
                type: 'text',
                value: newT.description,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.description = e.target.value
                }),
            },
            {
                id: 'input-form-3',
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
                id: 'input-form-4',
                label_text: 'Ответственный',
                type: 'radio',
                value: newT.employee_id,
                items: employees,
                renderItemName: 'last_name',
                onChangeItemName: 'employee_id',
                onChange: (e: string) => setNewT(d => {
                    d.employee_id = +e;
                }),
            },
            {
                id: 'input-form-5',
                label_text: 'Дата начала',
                placeholder: 'Дата начала...',
                type: 'text',
                value: newT.start_date,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.start_date = e.target.value
                }),
            },
            {
                id: 'input-form-6',
                label_text: 'Дата окончания',
                placeholder: 'Дата окончания...',
                type: 'text',
                value: newT.end_date,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewT(d => {
                    d.end_date = e.target.value
                }),
            },
        ],
        [employees, libraries, newT.description, newT.employee_id, newT.end_date, newT.library_id, newT.start_date, newT.title, setNewT]);

    const updateFields = useMemo((): IFormInput[] => [
            {
                id: 'input-form1-1',
                label_text: 'Название',
                placeholder: 'Название...',
                type: 'text',
                value: updated.title,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    d.title = e.target.value
                }),
            },
            {
                id: 'input-form1-2',
                label_text: 'Описание',
                placeholder: 'Описание...',
                type: 'text',
                value: updated.description,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    d.description = e.target.value
                }),
            },
            {
                id: 'input-form1-3',
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
                id: 'input-form1-4',
                label_text: 'Ответственный',
                type: 'radio',
                value: updated.employee_id,
                items: employees,
                renderItemName: 'last_name',
                onChangeItemName: 'employee_id',
                onChange: (e: string) => setUpdated(d => {
                    d.employee_id = +e;
                }),
            },
            {
                id: 'input-form1-5',
                label_text: 'Дата начала',
                placeholder: 'Дата начала...',
                type: 'text',
                value: updated.start_date,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    d.start_date = e.target.value
                }),
            },
            {
                id: 'input-form1-6',
                label_text: 'Дата окончания',
                placeholder: 'Дата окончания...',
                type: 'text',
                value: updated.end_date,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    d.end_date = e.target.value
                }),
            },
        ],
        [employees, libraries, setUpdated, updated.description, updated.employee_id, updated.end_date, updated.library_id, updated.start_date, updated.title]);

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
                        headers={TABLE_EVENT_HEADER_TITLES}
                        onRowClick={(id) => setActive(data.find(d => {
                            return d.event_id === id;
                        }) ?? null)}
                    />
                </div>
                <div className="pt-2 pr-4">
                    {
                        active && (
                            <>
                                <p className='text-2xl'>Выбранный заказ:</p>
                                <Table data={Object.keys(active).map((key, index) => ({
                                    columnTitle: TABLE_EVENT_HEADER_TITLES[index]?.title ?? '',
                                    [key]: active[key as keyof IEvent],
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
                                        permissions.includes(EVENT_UPDATE_PERMISSION) && (
                                            <label htmlFor={UPDATE_MODAL}
                                                   className="flex-auto btn btn-active btn-primary">Изменить</label>
                                        )
                                    }
                                    {
                                        permissions.includes(EVENT_DELETE_PERMISSION) && (
                                            <label htmlFor={DELETE_MODAL}
                                                   className="flex-auto btn btn-active btn-secondary">Удалить</label>
                                        )
                                    }
                                </>
                            )
                        }
                        {
                            permissions.includes(EVENT_CREATE_PERMISSION) && (
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
