/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head';
import Link from 'next/link';
import { useState, useContext, useEffect } from 'react';
import valid from '../config/validate'
import { DataContext } from '../utils/GlobalState.js'
import { postData } from '../config/fetchData';
import { useRouter } from 'next/router'

const Register = () => {
    const initialState = { name: '', email: '', password: '', cf_password: '' }
    const [userData, setUserData] = useState(initialState)
    const { name, email, password, cf_password } = userData

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
        const errMsg = valid(name, email, password, cf_password)
        if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } })

        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        const res = await postData('auth/register', userData)

        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

        return (dispatch({ type: 'NOTIFY', payload: { success: res.msg } }), router.push("/signin"))
    }

    useEffect(() => {
        if (Object.keys(auth).length !== 0) router.push("/signin")
    }, [auth])

    return (
        <div>
            <Head>
                <title>Register</title>
            </Head>
            <section id="logreg-forms">
                <form className="form-signin" onSubmit={handleSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal" style={{ textAlign: "center" }}> Register</h1>
                    <input name='name' value={name} onChange={handleChangeInput} type="text" id="user-name" className="mb-3 form-control" placeholder="Full name" />
                    <input name='email' value={email} onChange={handleChangeInput} type="email" id="user-email" className="mb-3 form-control" placeholder="Email address" />
                    <input name='password' value={password} onChange={handleChangeInput} type="password" id="user-pass" className="mb-3 form-control" placeholder="Password" />
                    <input name='cf_password' value={cf_password} onChange={handleChangeInput} type="password" id="user-repeatpass" className="mb-3 form-control" placeholder="Repeat Password" />

                    <button className="btn btn-info btn-block" type="submit"><i className="fas fa-user-plus"></i> Register</button>

                    <hr />
                    <p>Already Have Account</p>
                    <Link href="/signin">
                        <a className="btn btn-dark btn-block text-white" type="button" id="btn-signup"><i className="fas fa-sign-in-alt"></i> Login Now</a>
                    </Link>
                </form>
            </section>
        </div>
    )
}
export default Register