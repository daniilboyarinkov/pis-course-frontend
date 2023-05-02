import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {logout} from '../app/auth/userSlice';
import {userPermissions} from '../utils/utils';
import {
    BOOK_READ_PERMISSION,
    EVENT_READ_PERMISSION, LIBRARY_READ_PERMISSION,
    ORDER_READ_PERMISSION,
    USER_READ_PERMISSION
} from '../constants/permissions';

export function Header() {
    const {user, isLoggedIn} = useAppSelector(state => state.userState);
    const dispatch = useAppDispatch();

    const permissions = userPermissions(user?.role);

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to='/' className="btn btn-ghost normal-case text-xl">АИС Библиотека</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    {
                        isLoggedIn && (
                            <>
                                {
                                    permissions.includes(LIBRARY_READ_PERMISSION) && (
                                        <li>
                                            <Link to='/libraries' className="btn btn-ghost normal-case text-xl">
                                                Библиотеки
                                            </Link>
                                        </li>
                                    )
                                }
                                {
                                    permissions.includes(USER_READ_PERMISSION) && (
                                        <li>
                                            <Link to='/readers' className="btn btn-ghost normal-case text-xl">
                                                Читатели
                                            </Link>
                                        </li>
                                    )
                                }
                                {
                                    permissions.includes(USER_READ_PERMISSION) && (
                                        <li>
                                        <Link to='/employees' className="btn btn-ghost normal-case text-xl">
                                            Сотрудники
                                        </Link>
                                    </li>
                                    )
                                }
                                {
                                    permissions.includes(BOOK_READ_PERMISSION) && (
                                        <li>
                                            <Link to='/books' className="btn btn-ghost normal-case text-xl">
                                                Книги
                                            </Link>
                                        </li>
                                    )
                                }{
                                permissions.includes(ORDER_READ_PERMISSION) && (
                                    <li>
                                        <Link to='/orders' className="btn btn-ghost normal-case text-xl">
                                            Заказы
                                        </Link>
                                    </li>
                                )
                            }
                                {
                                    permissions.includes(EVENT_READ_PERMISSION) && (
                                        <li>
                                            <Link to='/events' className="btn btn-ghost normal-case text-xl">
                                                События
                                            </Link>
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
                                    onClick={() => dispatch(logout())}
                                    className="btn normal-case"
                                >
                                    Выйти
                                </button>
                                : <Link to='/login' className="btn normal-case">
                                    Войти
                                </Link>
                        }
                    </li>
                </ul>
            </div>
        </div>
    )
}
