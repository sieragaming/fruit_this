/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head';
import Link from 'next/link';
import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../utils/GlobalState';
import { postData } from '../config/fetchData';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

const SignIn = () => {
    const initialState = { email: '', password: '' }
    const [userData, setUserData] = useState(initialState)
    const { email, password } = userData

    const { state, dispatch } = useContext(DataContext)
    const { auth } = state

    const router = useRouter()

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        const res = await postData('auth/login', userData)

        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

        dispatch({
            type: 'AUTH', payload: {
                token: res.access_token,
                user: res.user
            }
        })

        Cookie.set('refreshtoken', res.refresh_token, {
            path: 'api/auth/accessToken',
            expires: 7
        })

        localStorage.setItem('firstLogin', true)
        router.push("/")
    }

    useEffect(() => {
        if (Object.keys(auth).length !== 0) router.push("/")
    }, [auth])

    return (
        <div>
            <Head>
                <title>Login</title>
            </Head>
            <section id="logreg-forms">
                <form className="form-signin" onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal" style={{ textAlign: "center" }}> Sign in</h1>
                    <input name='email' value={email} onChange={handleChangeInput} type="email" id="inputEmail" className="mb-3 form-control" placeholder="Email address" />
                    <input name='password' value={password} onChange={handleChangeInput} type="password" id="inputPassword" className="mb-3 form-control" placeholder="Password" />

                    <button className="btn btn-info btn-block" type="submit"><i className="fas fa-sign-in-alt"></i> Sign in</button>

                    <hr />
                    <p>Dont have an account!</p>
                    <Link href="/register">
                        <a className="btn btn-dark btn-block text-white" type="button" id="btn-signup"><i className="fas fa-user-plus"></i> Sign up New Account</a>
                    </Link>
                </form>
            </section>
        </div >
    )
}
export default SignIn