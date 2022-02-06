import {useFormik} from "formik";
import React, {useRef} from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import "./sign-in.styles.scss";
import bgrImage from './../../assets/images/sign-in-background.jpg'
import {authenticationService} from "../../services/authentication/authentication.service";
import {useStateValue} from "../../contexts/state-context";
import {setCurrentUser, setUserError} from "../../redux/user/user.action";
import { Toast } from 'primereact/toast';
import {SetGlobalLoading} from "../../redux/global/global.actions";

export const SignInPage = () => {
    const [state, dispatch] = useStateValue();
    const toast = useRef();
    const passwordField = useRef();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate: (data) => {
            let errors = {};

            if (!data.email) {
                errors.email = 'Поле Email не заполненно.';
            }
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = 'Поле Email заполненно неверно. Прим.: example@email.com';
            }

            if (!data.password) {
                errors.password = 'Поле Пароль не заполненно.';
            }

            return errors;
        },
        onSubmit: (data) => {
            dispatch(new SetGlobalLoading(true));
            const {email, password} = data;

            authenticationService.login(email, password)
                .then((user)=>{
                    formik.resetForm();
                    dispatch(setCurrentUser(user));
                    console.log(authenticationService.currentUserValue);
                }).catch(err => {
                dispatch(new SetGlobalLoading(false));
                dispatch(setUserError(err))

                toast.current.show({severity: 'info', summary: 'Авторизация', detail: 'Введен неверный логин или пароль', life: 3000});
                formik.resetForm();
                formik.setFieldValue("email", email);
                console.log( passwordField.current);
                passwordField.current.inputRef.current.focus();
            });
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (

        <div className="sign-in-page"
             // style={{backgroundImage: `url(${bgrImage})`}}
        >
            <Toast ref={toast} />
            <h1 className="title">BUP</h1>
            <div className="sign-in-form">
                <div className="p-d-flex p-jc-center">
                    <div className="card">
                        <form onSubmit={formik.handleSubmit} className="p-fluid">
                            <div className="p-field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText id="email" name="email" value={formik.values.email} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
                                <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Email</label>
                            </span>
                                {getFormErrorMessage('email')}
                            </div>
                            <div className="p-field">
                            <span className="p-float-label">
                                <Password id="password" name="password" ref={passwordField} value={formik.values.password} onChange={formik.handleChange}
                                          feedback={false}

                                          className={classNames({ 'p-invalid': isFormFieldValid('password') })} />
                                <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>Пароль</label>
                            </span>
                                {getFormErrorMessage('password')}
                            </div>
                            <Button type="submit" label="Войти" className="p-mt-2" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}