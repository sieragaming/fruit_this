/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable @next/next/no-img-element */
import React, { useContext } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DataContext } from '../utils/GlobalState';
import Cookie from 'js-cookie'

function Navbar() {
    const router = useRouter();

    const { state, dispatch } = useContext(DataContext)
    const { auth, cart } = state

    const isActive = (route) => {
        if (route === router.pathname) {
            return " active"
        } else {
            return ""
        }
    }

    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: 'api/auth/accessToken' })
        localStorage.removeItem('firstLogin')
        dispatch({ type: 'AUTH', payload: {} })
        dispatch({ type: 'NOTIFY', payload: { success: 'Logged out!' } })
        router.push('/')
        return
    }

    const adminRouter = () => {
        return (
            <>
                <Link href="/categories">
                    <a className="dropdown-item"><i className="fas fa-list mr-2"></i>Kategori</a>
                </Link>
            </>
        )
    }

    const loggedRouter = () => {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link active dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={auth.user.avatar} alt={auth.user.avatar} className="image"
                        style={{
                            borderRadius: '50%', width: '30px', height: '30px',
                            transform: 'translateY(-3px)', marginRight: '3px'
                        }} /> {auth.user.name}
                </a>

                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link href="/profile">
                        <a className="dropdown-item"><i className="fas fa-user mr-2"></i>Profil</a>
                    </Link>
                    {
                        auth.user.role === 'admin' && adminRouter()
                    }
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}><i className="fas fa-right-from-bracket mr-2"></i>Keluar</button>
                </div>
            </li>
        )
    }


    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link href="/">
                        <a className="navbar-brand text-uppercase font-weight-bold" > <img src="/image/logo.png" width="auto" height="50" alt="" />UD Jendral Buah</a>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarsExample07">
                        <ul className="navbar-nav  ml-auto">
                            <li className="nav-item">
                                <Link href="/">
                                    <a className={"nav-link" + isActive('/')}><span className="fas fa-home mr-2 pr-1"></span>Beranda </a>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/cart">
                                    <a className={"nav-link" + isActive('/cart')}><span className="fas fa-shopping-cart mr-2 pr-1 position-relative">
                                        <span className="position-absolute"
                                            style={{
                                                padding: '3px 6px',
                                                background: '#ed143dc2',
                                                borderRadius: '50%',
                                                top: '-10px',
                                                right: '-10px',
                                                color: 'white',
                                                fontSize: '14px'
                                            }}>
                                            {cart.length}
                                        </span></span>Keranjang </a>
                                </Link>
                            </li>
                            {
                                Object.keys(auth).length === 0
                                    ? <li className="nav-item">
                                        <Link href="/signin">
                                            <a className="btn btn-success ml-3" ><span className="fas fa-circle-user mr-2 pr-1"></span>Masuk Sekarang </a>
                                        </Link>
                                    </li>
                                    : loggedRouter()
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}
export default Navbar
