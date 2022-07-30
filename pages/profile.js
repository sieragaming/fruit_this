/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../utils/GlobalState'
import Link from 'next/link'
import valid from '../config/validate'
import { patchData } from '../config/fetchData'
import { imageUpload } from '../config/imageUpload'


const Profile = () => {
    const initialSate = {
        avatar: '',
        name: '',
        password: '',
        cf_password: ''
    }
    const [data, setData] = useState(initialSate)
    const { avatar, name, password, cf_password } = data

    const { state, dispatch } = useContext(DataContext)
    const { users, auth, notify, orders, modal } = state


    useEffect(() => {
        if (auth.user) setData({ ...data, name: auth.user.name })
    }, [auth.user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const handleUpdateProfile = e => {
        e.preventDefault()
        if (password) {
            const errMsg = valid(name, auth.user.email, password, cf_password)
            if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } })
            updatePassword()
        }

        if (name !== auth.user.name || avatar) updateInfor()
    }

    const updatePassword = () => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        patchData('user/resetPassword', { password }, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
    }

    const changeAvatar = (e) => {
        const file = e.target.files[0]
        if (!file)
            return dispatch({ type: 'NOTIFY', payload: { error: 'File does not exist.' } })

        if (file.size > 1024 * 1024) //1mb
            return dispatch({ type: 'NOTIFY', payload: { error: 'The largest image size is 1mb.' } })

        if (file.type !== "image/jpeg" && file.type !== "image/png") //1mb
            return dispatch({ type: 'NOTIFY', payload: { error: 'Image format is incorrect.' } })

        setData({ ...data, avatar: file })
    }

    const updateInfor = async () => {
        let media;
        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        if (avatar) media = await imageUpload([avatar])

        patchData('user', {
            name, avatar: avatar ? media[0].url : auth.user.avatar
        }, auth.token).then(res => {
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

            dispatch({
                type: 'AUTH', payload: {
                    token: auth.token,
                    user: res.user
                }
            })
            return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
        })
    }


    if (!auth.user) return null;
    return (
        <div>
            <Head>
                <title>Profile</title>
            </Head>
            <div className="container">
                <div className="profile_page">
                    <section className="row text-secondary my-3">
                        <div className="col-md-2">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    <img src={auth.user.avatar} className="avatar" alt="avatar" />
                                    <h5 className="mt-3 text-capitalize">{auth.user.name}</h5>
                                    <hr className='divider' />
                                    <p className="text-muted mb-1" style={{ fontSize: "8pt", fontWeight: "bold" }}>{auth.user.email}</p>
                                </div>
                            </div>
                            <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                <a className="nav-link active" id="v-pills-profil-tab" data-toggle="pill" href="#v-pills-profil" role="tab" aria-controls="v-pills-profil" aria-selected="false">Ubah Profil</a>
                                <a className="nav-link" id="v-pills-pesanan-tab" data-toggle="pill" href="#v-pills-pesanan" role="tab" aria-controls="v-pills-pesanan" aria-selected="false">Pesanan</a>
                                <a className="nav-link" id="v-pills-pengguna-tab" data-toggle="pill" href="#v-pills-pengguna" role="tab" aria-controls="v-pills-pengguna" aria-selected="false">Pengguna</a>
                            </div>
                        </div>

                        <div className="col-md-10">
                            <div className="card mb-4">
                                <div className="card-body tab-content" id="v-pills-tabContent">
                                    <div className="tab-pane fade show active" id="v-pills-profil" role="tabpanel" aria-labelledby="v-pills-profil-tab">
                                        <h3 className=" text-uppercase">
                                            {auth.user.role === 'user' ? 'Profile' : 'Admin Profile'}
                                        </h3>
                                        <hr className='solid' />
                                        <div className='row'>
                                            <div className='col-md-8'>
                                                <div className="form-group">
                                                    <label htmlFor="name">Nama</label>
                                                    <input type="text" name="name" value={name} className="form-control"
                                                        onChange={handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <input type="text" name="email" defaultValue={auth.user.email}
                                                        className="form-control" disabled={true} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="password">Password baru</label>
                                                    <input type="password" name="password" value={password} className="form-control"
                                                        onChange={handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="cf_password">Konfirmasi Password</label>
                                                    <input type="password" name="cf_password" value={cf_password} className="form-control"
                                                        onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className='text-center'>Ubah Gambar</div>
                                                <div className="avatar">
                                                    <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
                                                        alt="avatar" />
                                                    <span>
                                                        <i className="fas fa-camera"></i>
                                                        <p>Change</p>
                                                        <input type="file" name="file" id="file_up"
                                                            accept="image/*" onChange={changeAvatar} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn btn-info" disabled={notify.loading}
                                            onClick={handleUpdateProfile}>
                                            Update
                                        </button>
                                    </div>

                                    <div className="tab-pane fade" id="v-pills-pesanan" role="tabpanel" aria-labelledby="v-pills-pesanan-tab">
                                        <h3 className="text-uppercase">Orders</h3>
                                        <hr className='solid' />
                                        <div className="my-3 table-responsive">
                                            <table className="table-bordered table-hover w-200 text-uppercase"
                                                style={{ minWidth: '600px', cursor: 'pointer' }}>
                                                <thead className="bg-light font-weight-bold">
                                                    <tr>
                                                        <td className="p-2">No. Pesanan</td>
                                                        <td className="p-2">No. HandPhone</td>
                                                        <td className="p-2">Tanggal Pesanan</td>
                                                        <td className="p-2">Total</td>
                                                        <td className="p-2">Status Pengiriman</td>
                                                        <td className="p-2">Status Pembayaran</td>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        orders.map(order => (
                                                            <tr key={order._id}>
                                                                <td className="p-2">
                                                                    <Link href={`/order/${order._id}`}>
                                                                        <a>{order._id}</a>
                                                                    </Link>

                                                                </td>
                                                                <td className="p-2">
                                                                    {order.mobile}
                                                                </td>
                                                                <td className="p-2">
                                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                                </td>
                                                                <td className="p-2">Rp.{order.total}</td>
                                                                <td className="p-2">
                                                                    {
                                                                        order.delivered
                                                                            ? <i className="fas fa-check text-success"></i>
                                                                            : <i className="fas fa-times text-danger"></i>
                                                                    }
                                                                </td>
                                                                <td className="p-2">
                                                                    {
                                                                        order.paid
                                                                            ? <i className="fas fa-check text-success"></i>
                                                                            : <i className="fas fa-times text-danger"></i>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>

                                            </table>
                                        </div>
                                    </div>

                                    <div className="tab-pane fade" id="v-pills-pengguna" role="tabpanel" aria-labelledby="v-pills-pengguna-tab">
                                        <h3 className="text-uppercase">Pengguna</h3>
                                        <hr className='solid' />
                                        <div className="table-responsive">
                                            <table className="table w-100">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>ID</th>
                                                        <th>Avatar</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Admin</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        users.map((user, index) => (
                                                            <tr key={user._id} style={{ cursor: 'pointer' }}>
                                                                <th>{index + 1}</th>
                                                                <th>{user._id}</th>
                                                                <th>
                                                                    <img src={user.avatar} alt={user.avatar}
                                                                        style={{
                                                                            width: '30px', height: '30px',
                                                                            overflow: 'hidden', objectFit: 'cover'
                                                                        }} />
                                                                </th>
                                                                <th>{user.name}</th>
                                                                <th>{user.email}</th>
                                                                <th>
                                                                    {
                                                                        user.role === 'admin'
                                                                            ? user.root ? <span className="text-success pl-2"><i className="fas fa-check text-success"></i> Root</span>
                                                                                : <i className="fas fa-check text-success"></i>

                                                                            : <i className="fas fa-times text-danger"></i>
                                                                    }
                                                                </th>
                                                                <th>
                                                                    <Link href={
                                                                        auth.user.root && auth.user.email !== user.email
                                                                            ? `/edit/${user._id}` : '#!'
                                                                    }>
                                                                        <a><i className="fas fa-edit text-info mr-2" title="Edit"></i></a>
                                                                    </Link>

                                                                    {
                                                                        auth.user.root && auth.user.email !== user.email
                                                                            ? <i className="fas fa-trash-alt text-danger ml-2" title="Remove"
                                                                                data-toggle="modal" data-target="#exampleModal"
                                                                                onClick={() => dispatch({
                                                                                    type: 'ADD_MODAL',
                                                                                    payload: [{ data: users, id: user._id, title: user.name, type: 'ADD_USERS' }]
                                                                                })}></i>

                                                                            : <i className="fas fa-trash-alt text-danger ml-2" title="Remove"></i>
                                                                    }

                                                                </th>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>

    )
}

export default Profile