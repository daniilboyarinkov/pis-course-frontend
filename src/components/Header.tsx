import {NavLink} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {logout} from '../app/auth/userSlice';
import {userPermissions} from '../utils/utils';
import {
    BOOK_READ_PERMISSION,
    EVENT_READ_PERMISSION, LIBRARY_READ_PERMISSION,
    ORDER_READ_PERMISSION, STORE_READ_PERMISSION,
    USER_READ_PERMISSION
} from '../constants/permissions';

export function Header() {
    const {user, isLoggedIn} = useAppSelector(state => state.userState);
    const dispatch = useAppDispatch();

    const permissions = userPermissions(user?.role);

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <NavLink
                    to='/'
                    className={({ isActive, isPending }) =>
                        isPending ? "pending" : isActive ? "btn btn-ghost normal-case text-xl bg-red" : "btn btn-ghost normal-case text-xl"
                    }
                >
                    АИС Библиотека
                </NavLink>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    {
                        isLoggedIn && (
                            <>
                                {
                                    permissions.includes(STORE_READ_PERMISSION) && (
                                        <li>
                                            <NavLink to='/store' className="btn btn-ghost normal-case text-xl">
                                                Хранилище
                                            </NavLink>
                                        </li>
                                    )
                                }
                                {
                                    permissions.includes(LIBRARY_READ_PERMISSION) && (
                                        <li>
                                            <NavLink to='/libraries' className="btn btn-ghost normal-case text-xl">
                                                Библиотеки
                                            </NavLink>
                                        </li>
                                    )
                                }
                                {
                                    permissions.includes(USER_READ_PERMISSION) && (
                                        <li>
                                            <NavLink to='/readers' className="btn btn-ghost normal-case text-xl">
                                                Читатели
                                            </NavLink>
                                        </li>
                                    )
                                }
                                {
                                    permissions.includes(USER_READ_PERMISSION) && (
                                        <li>
                                        <NavLink to='/employees' className="btn btn-ghost normal-case text-xl">
                                            Сотрудники
                                        </NavLink>
                                    </li>
                                    )
                                }
                                {
                                    permissions.includes(BOOK_READ_PERMISSION) && (
                                        <li>
                                            <NavLink to='/books' className="btn btn-ghost normal-case text-xl">
                                                Книги
                                            </NavLink>
                                        </li>
                                    )
                                }{
                                permissions.includes(ORDER_READ_PERMISSION) && (
                                    <li>
                                        <NavLink to='/orders' className="btn btn-ghost normal-case text-xl">
                                            Заказы
                                        </NavLink>
                                    </li>
                                )
                            }
                                {
                                    permissions.includes(EVENT_READ_PERMISSION) && (
                                        <li>
                                            <NavLink to='/events' className="btn btn-ghost normal-case text-xl">
                                                События
                                            </NavLink>
                                        </li>
                                    )
                                }
                            </>
                        )
                    }
                    <li>
                        {
                            isLoggedIn
                                ? <button
                                    onClick={() => {
                                        dispatch(logout());
                                        window.location.reload();
                                    }}
                                    className="btn normal-case"
                                >
                                    Выйти
                                </button>
                                : <NavLink to='/login' className="btn normal-case">
                                    Войти
                                </NavLink>
                        }
                    </li>
                </ul>
            </div>
        </div>
    )
}
