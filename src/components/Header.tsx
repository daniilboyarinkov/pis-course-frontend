import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {logout} from '../app/auth/userSlice';

export function Header() {
    const {isLoggedIn} = useAppSelector(state => state.userState);
    const dispatch = useAppDispatch();

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
                                <li>
                                    <Link to='/readers' className="btn btn-ghost normal-case text-xl">
                                        Читатели
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/employees' className="btn btn-ghost normal-case text-xl">
                                        Работники
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/books' className="btn btn-ghost normal-case text-xl">
                                        Книги
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/orders' className="btn btn-ghost normal-case text-xl">
                                        Заказы
                                    </Link>
                                </li>
                                <li>
                                    <Link to='/events' className="btn btn-ghost normal-case text-xl">
                                        События
                                    </Link>
                                </li>
                            </>
                        )
                    }
                    <li>
                        {
                            isLoggedIn
                                ? <button
                                    onClick={() => dispatch(logout())}
                                    className="btn btn-ghost normal-case text-xl"
                                >
                                    Выйти
                                </button>
                                : <Link to='/login' className="btn btn-ghost normal-case text-xl">
                                    Войти
                                </Link>
                        }
                    </li>
                </ul>
            </div>
        </div>
    )
}
