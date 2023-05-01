import {Table} from '../components/Table';
import {TABLE_BOOK_HEADER_TITLES, TABLE_STATISTIC_BOOK_HEADER_TITLES} from '../constants/table';
import {
    useCreateBookMutation,
    useDeleteBookMutation,
    useGetAllBooksQuery,
    useUpdateBookMutation
} from '../app/booksApi';
import React, {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import {IBook} from '../app/types';
import {useImmer} from 'use-immer';
import {toast} from 'react-toastify';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {FormInput, IFormInput} from '../components/FormInput';
import {useGetBookStatisticQuery} from '../app/statisticApi';
import {useUpdateQuery} from '../app/auth/authApi';

const initialBook: IBook = {
    book_id: 1,
    author: '',
    title: '',
}

export default function BooksPage() {
    const {data: _} = useUpdateQuery('');
    const {data: books = [], isLoading, error, refetch} = useGetAllBooksQuery("");

    const [searchByTitle, setSearchByTitle] = useState('');
    const [searchByAuthor, setSearchByAuthor] = useState('');

    const filteredBooks = books
        .filter(book =>
            book.title.toLowerCase().includes(searchByTitle.toLowerCase())
            && (!!searchByAuthor.length ? book.author?.toLowerCase().includes(searchByAuthor.toLowerCase()) : true)
        );

    const [activeBook, setActiveBook] = useState<IBook | null>(null);
    const [newBook, setNewBook] = useImmer<IBook>(initialBook);
    const [updatedBook, setUpdatedBook] = useImmer<IBook>(initialBook);
    const [deleteId, setDeleteId] = useState(0);

    useEffect(() => {
        setUpdatedBook(activeBook ?? initialBook);
    }, [activeBook, setUpdatedBook])

    const [createBook] = useCreateBookMutation();
    const [updateBook] = useUpdateBookMutation();
    const [deleteBook] = useDeleteBookMutation();

    const {data: book} = useGetBookStatisticQuery(String(activeBook?.book_id ?? '1'));

    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await createBook(newBook).unwrap()
            .then(() => {
                toast.success("Книга была успешно создана");
                setNewBook(initialBook);
            })
            .catch((err: FetchBaseQueryError) => {
                console.log(err);
                toast.error(`Произошла ошибка: ${err.data}`);
            });
    }

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await updateBook(updatedBook!).unwrap()
            .then(() => {
                toast.success("Успех!");
                setNewBook(initialBook);
            })
            .catch((err: FetchBaseQueryError) => {
                console.log(err);
                toast.error(`Произошла ошибка: ${err.data}`);
            });
    }

    const handleDelete = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (deleteId !== activeBook?.book_id) {
            toast.info(`Книга ${activeBook?.book_id ?? deleteId} не была удалена`);
            return;
        }

        await deleteBook(deleteId).unwrap()
            .then(() => {
                toast.success(`Книга ${deleteId} была успешно удалена`);
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
                type: 'text',
                placeholder: 'Название...',
                value: newBook.title,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewBook(book => {
                    book.title = e.target.value
                }),
            },
            {
                id: 'input-form-2',
                label_text: 'Автор',
                type: 'text',
                placeholder: 'Автор...',
                value: newBook.author ?? '',
                onChange: (e: ChangeEvent<HTMLInputElement>) => setNewBook(book => {
                    book.author = e.target.value
                }),
            },
        ],
        [newBook.author, newBook.title, setNewBook]);

    const updateFields = useMemo((): IFormInput[] => [
            {
                id: 'input-form-1',
                label_text: 'Название',
                type: 'text',
                placeholder: 'Название...',
                value: updatedBook.title,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdatedBook(book => {
                    (book as IBook).title = e.target.value
                }),
            },
            {
                id: 'input-form-2',
                label_text: 'Автор',
                type: 'text',
                placeholder: 'Автор...',
                value: updatedBook.author ?? '',
                onChange: (e: ChangeEvent<HTMLInputElement>) => setUpdatedBook(book => {
                    (book as IBook).author = e.target.value
                }),
            },
        ],
        [setUpdatedBook, updatedBook?.author, updatedBook?.title]);

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
                <p className="text-2xl">Книги</p>
                <div className="flex items-center gap-4">
                    <p className="text-xl mr-12">Поиск&nbsp;по:</p>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Названию</span>
                        </label>
                        <input
                            value={searchByTitle}
                            onChange={(e) => setSearchByTitle(e.target.value)}
                            type="text"
                            placeholder="Название..."
                            className="input input-bordered w-full max-w-xs"
                        />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Автору</span>
                        </label>
                        <input
                            value={searchByAuthor}
                            onChange={(e) => setSearchByAuthor(e.target.value)}
                            type="text"
                            placeholder="Автор..."
                            className="input input-bordered w-full max-w-xs"
                        />
                    </div>
                </div>
            </div>
            <div className="grid" style={{gridTemplateColumns: '3fr 1fr'}}>
                <div className="p-4">
                    <Table
                        data={filteredBooks}
                        headers={TABLE_BOOK_HEADER_TITLES}
                        onRowClick={(id) => setActiveBook(books.find(book => {
                            return book.book_id === id;
                        }) ?? null)}
                    />
                </div>
                <div className="pt-2 pr-4">
                    {
                        activeBook && (
                            <>
                                <p className='text-2xl'>Выбранная книга:</p>
                                <Table data={Object.keys(activeBook).map((key, index) => ({
                                    columnTitle: TABLE_BOOK_HEADER_TITLES[index].title,
                                    [key]: activeBook[key as keyof IBook],
                                }))}/>
                            </>
                        )
                    }
                    {
                        activeBook && book && (
                            <div className="py-8">
                                <p className='text-2xl'>Статистика по выбранной книге:</p>
                                <Table data={Object.keys(book).map((key, index) => {
                                    return ({
                                        columnTitle: TABLE_STATISTIC_BOOK_HEADER_TITLES[index].title,
                                        [key]: book[key as keyof IBook],
                                    })
                                })}/>
                            </div>
                        )
                    }
                    <div className="flex py-4 gap-2">
                        {
                            activeBook && (
                                <>
                                    <label htmlFor="update-modal" className="flex-auto btn btn-active btn-primary">Изменить</label>
                                    <label htmlFor="delete-modal" className="flex-auto btn btn-active btn-secondary">Удалить</label>
                                </>
                            )
                        }
                        <label htmlFor="add-modal" className="flex-auto btn btn-active btn-accent">Создать</label>
                    </div>
                    <div className="flex pb-4 gap-2">
                        <button onClick={refetch} className="flex-auto btn btn-active">Обновить</button>
                    </div>
                </div>
            </div>


            {/* Create Book Modal */}
            <input type="checkbox" id="add-modal" className="modal-toggle"/>
            <label htmlFor="add-modal" className="modal cursor-pointer">
                <form className="modal-box relative grid gap-4 grid-cols-2" onSubmit={handleCreate}>
                    {
                        createFields.map(inp => (
                            <FormInput
                                key={inp.id}
                                {...inp}
                            />
                        ))
                    }
                    <button className="btn btn-accent col-span-2"> Submit</button>
            </form>
        </label>

            {/* Update Book Modal */}
            <input type="checkbox" id="update-modal" className="modal-toggle"/>
            <label htmlFor="update-modal" className="modal cursor-pointer">
                <form className="modal-box relative grid gap-4 grid-cols-2" onSubmit={handleUpdate}>
                    {
                        updateFields.map(inp => (
                            <FormInput
                                key={inp.id}
                                {...inp}
                            />
                        ))
                    }
                    <button className="btn btn-primary col-span-2"> Submit</button>
            </form>
        </label>

        {/* Delete Book Modal */}
        <input type="checkbox" id="delete-modal" className="modal-toggle"/>
        <label htmlFor="delete-modal" className="modal cursor-pointer">
            <form className="modal-box relative grid gap-4" onSubmit={handleDelete}>
                {
                    deleteFields.map(inp => (
                        <FormInput
                            key={inp.id}
                            {...inp}
                        />
                    ))
                }
                <button className="btn btn-danger">Submit</button>
            </form>
        </label>
</div>
)
}
