import {useUpdateQuery} from '../app/auth/authApi';
import {useCreateMutation, useDeleteMutation, useGetAllQuery, useUpdateMutation} from '../app/employeesApi';
import {useGetAllQuery as useGetAllLibraries} from '../app/librariesApi';
import {useAppSelector} from '../app/hooks';
import {userPermissions} from '../utils/utils';
import React, {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import {IEmployee, Position} from '../app/types';
import {useImmer} from 'use-immer';
import {toast} from 'react-toastify';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {IFormInput} from '../components/FormInput';
import {Table} from '../components/Table';
import {TABLE_EMPLOYEE_HEADER_TITLES} from '../constants/table';
import {USER_CREATE_PERMISSION, USER_DELETE_PERMISSION, USER_UPDATE_PERMISSION} from '../constants/permissions';
import Modal from '../components/Modal';

const initial: IEmployee = {
    employee_id: 1,
    library_id: 1,
    first_name: '',
    last_name: '',
    login: '',
    password: '',
    role: Position.READER,
    position: Position.READER,
}

const CREATE_MODAL = 'create-modal';
const UPDATE_MODAL = 'update-modal';
const DELETE_MODAL = 'delete-modal';


export default function EmployeesPage() {
    const {data: _} = useUpdateQuery('');
    const {data = [], isLoading, error, refetch} = useGetAllQuery("");
    const {data: libraies} = useGetAllLibraries("");

    const {user} = useAppSelector(state => state.userState);
    const permissions = userPermissions(user?.role);

    const [searchByName, setSearchByName] = useState('');

    const converted = data.map(d => ({
        ...d,
        position: d.position === Position.LIBRARIAN ? 'Библиотекарь' : d.position === Position.BIBLIOGRAPHER ? 'Библиограф' : d.position === Position.ADMINISTRATOR ? 'Администратор' : 'Читатель',
    }))

    const filtered = converted
        .filter(d =>
            d.first_name.toLowerCase().includes(searchByName.toLowerCase())
            || d.last_name.toLowerCase().includes(searchByName.toLowerCase())
        );

    const [active, setActive] = useState<IEmployee | null>(null);
    const [newT, setNewT] = useImmer<IEmployee>(initial);
    const [updated, setUpdated] = useImmer<IEmployee>(initial);
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
                toast.success("Работник был успешно создан");
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

        if (deleteId !== active?.employee_id) {
            toast.info(`Работник ${active?.employee_id ?? deleteId} не был удален`);
            return;
        }

        await deleteFn(deleteId).unwrap()
            .then(() => {
                toast.success(`Работник ${deleteId} был успешно удален`);
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
                id: 'input-form-6',
                label_text: 'Библиотека',
                type: 'radio',
                value: newT.library_id,
                items: libraies,
                renderItemName: 'library_id',
                onChange: (e: string) => setNewT(d => {
                    d.library_id = +e;
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
            {
                id: 'input-form-5',
                label_text: 'Должность',
                type: 'radio',
                items: [Position.BIBLIOGRAPHER, Position.ADMINISTRATOR, Position.LIBRARIAN],
                renderItems: ['Библиограф', 'Администратор', 'Библиотекарь'],
                value: newT.position,
                onChange: (e: string) => setNewT(d => {
                    d.position = e as Position
                }),
            },
        ],
        [libraies, newT.first_name, newT.last_name, newT.library_id, newT.login, newT.password, newT.position, setNewT]);

    const updateFields = useMemo((): IFormInput[] => [
            {
                id: 'input-form-1',
                label_text: 'Имя',
                type: 'text',
                placeholder: 'Имя...',
                value: updated.first_name,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    d.first_name = e.target.value
                }),
            },
            {
                id: 'input-form-6',
                label_text: 'Библиотека',
                type: 'radio',
                value: updated.library_id,
                items: libraies,
                renderItemName: 'library_id',
                onChange: (e: string) => setUpdated(d => {
                    d.library_id = +e;
                }),
            },
            {
                id: 'input-form-2',
                label_text: 'Фамилия',
                type: 'text',
                placeholder: 'Фамилия...',
                value: updated.last_name,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    d.last_name = e.target.value
                }),
            },
            {
                id: 'input-form-3',
                label_text: 'Логин',
                type: 'text',
                placeholder: 'Логин...',
                value: updated.login,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    d.login = e.target.value
                }),
            },
            {
                id: 'input-form-4',
                label_text: 'Пароль',
                type: 'text',
                placeholder: 'Пароль...',
                value: updated.password,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdated(d => {
                    d.password = e.target.value
                }),
            },
            {
                id: 'input-form-5',
                label_text: 'Должность',
                type: 'radio',
                items: [Position.BIBLIOGRAPHER, Position.ADMINISTRATOR, Position.LIBRARIAN],
                renderItems: ['Библиограф', 'Администратор', 'Библиотекарь'],
                value: updated.position,
                onChange: (e: string) => setUpdated(d => {
                    d.position = e as Position
                }),
            },
        ],
        [libraies, updated.first_name, updated.last_name, updated.library_id, updated.login, updated.password, updated.position, setUpdated]);

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
                <p className="text-2xl">Сотрудники</p>
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
                        headers={TABLE_EMPLOYEE_HEADER_TITLES}
                        onRowClick={(id) => setActive(data.find(d => {
                            return d.employee_id === id;
                        }) ?? null)}
                    />
                </div>
                <div className="pt-2 pr-4">
                    {
                        active && (
                            <>
                                <p className='text-2xl'>Выбранный сотрудник:</p>
                                <Table data={Object.keys(active).map((key, index) => ({
                                    columnTitle: TABLE_EMPLOYEE_HEADER_TITLES[index]?.title ?? '',
                                    [key]: (index === Object.keys(active).length - 2)
                                        ? '*****'
                                        : key === 'position'
                                            ? (active.position === Position.LIBRARIAN ? 'Библиотекарь' : active.position === Position.BIBLIOGRAPHER ? 'Библиограф' : active.position === Position.ADMINISTRATOR ? 'Администратор' : 'Читатель')
                                    : active[key as keyof IEmployee]
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
