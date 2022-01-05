import {useFormik} from "formik";
import React, {useState} from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import "./sign-in.styles.scss";
import bgrImage from './../../assets/images/sign-in-background.jpg'

export const SignInPage = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

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
            setFormData(data);
            setShowMessage(true);

            formik.resetForm();
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <div className="sign-in-page" style={{backgroundImage: `url(${bgrImage})`}}>
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
                                <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange}
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