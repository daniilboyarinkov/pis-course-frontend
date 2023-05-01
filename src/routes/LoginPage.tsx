import React from 'react';
import {useForm} from 'react-hook-form';
import FormErrorMessage from '../components/FormErrorMessage';
import {useLoginMutation} from '../app/auth/authApi';
import {useNavigate} from 'react-router-dom';

export type LoginInput = {
    login: string;
    password: string;
};

export default function LoginPage() {
    const [loginUser] = useLoginMutation();
    const navigate = useNavigate();

    const {register, handleSubmit, formState: {errors}} = useForm<LoginInput>();

    const onSubmit = handleSubmit((data: LoginInput) => {
        loginUser(data);
        navigate('/orders');
    });

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Войти в личный кабинет
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                            <div>
                                <label htmlFor="login"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Логин:
                                </label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="John Doe"
                                    {...register("login", {
                                            required: {
                                                value: true,
                                                message: 'Это обязательное поле...'
                                            }
                                        }
                                    )}
                                />
                                {errors?.login && <FormErrorMessage message={errors.login.message!}/>}
                            </div>
                            <div>
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Пароль:
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register("password",
                                        {
                                            required: {
                                                value: true,
                                                message: 'Это обязательное поле...'
                                            }
                                        }
                                    )}
                                />
                                {errors?.password && <FormErrorMessage message={errors.password.message!}/>}
                            </div>
                            <div className="flex items-center justify-between">
                                <a href="#"
                                   className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                                    Забыли пароль?
                                </a>
                            </div>
                            <input
                                type="submit"
                                value='Войти'
                                className="cursor-pointer w-full text-white bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
