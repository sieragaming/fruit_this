/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../utils/GlobalState'
import CartItem from '../components/CartItem'
import Link from 'next/link'
import { getData, postData } from '../config/fetchData'
import { useRouter } from 'next/router'


const Cart = () => {
    const { state, dispatch } = useContext(DataContext)
    const { cart, auth, orders } = state

    const [total, setTotal] = useState(0)

    const [address, setAddress] = useState('')
    const [mobile, setMobile] = useState('')

    const [callback, setCallback] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const getTotal = () => {
            const res = cart.reduce((prev, item) => {
                return prev + 13000 + (item.price * item.quantity)
            }, 0)

            setTotal(res)
        }

        getTotal()
    }, [cart])

    useEffect(() => {
        const cartLocal = JSON.parse(localStorage.getItem('___next___cart___agung'))
        if (cartLocal && cartLocal.length > 0) {
            let newArr = []
            const updateCart = async () => {
                for (const item of cartLocal) {
                    const res = await getData(`product/${item._id}`)
                    const { _id, title, images, price, inStock, sold } = res.product
                    if (inStock > 0) {
                        newArr.push({
                            _id, title, images, price, inStock, sold,
                            quantity: item.quantity > inStock ? 1 : item.quantity
                        })
                    }
                }

                dispatch({ type: 'ADD_CART', payload: newArr })
            }

            updateCart()
        }
    }, [callback])

    const handlePayment = async () => {
        if (!address || !mobile)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Please add your address and mobile.' } })

        let newCart = [];
        for (const item of cart) {
            const res = await getData(`product/${item._id}`)
            if (res.product.inStock - item.quantity >= 0) {
                newCart.push(item)
            }
        }

        if (newCart.length < cart.length) {
            setCallback(!callback)
            return dispatch({
                type: 'NOTIFY', payload: {
                    error: 'The product is out of stock or the quantity is insufficient.'
                }
            })
        }

        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        postData('order', { address, mobile, cart, total }, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                dispatch({ type: 'ADD_CART', payload: [] })

                const newOrder = {
                    ...res.newOrder,
                    user: auth.user
                }
                dispatch({ type: 'ADD_ORDERS', payload: [...orders, newOrder] })
                dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                return router.push(`/order/${res.newOrder._id}`)
            })

    }

    if (cart.length === 0)
        return (
            <div>
                <center>
                    <img className="img-responsive" height="200px" width="auto" src="/image/gmb1.png" alt="not empty" />
                    <h1>Empty Cart</h1>
                </center>
            </div>
        )

    return (
        <div>
            <Head>
                <title>Keranjang</title>
            </Head>
            <div className="container">
                <div className="row d-flex justify-content-center my-2">
                    <div className="col-md-12">
                        <div className="card my-2">
                            <div className="card-header py-3 bg-light">
                                <h5 className="mb-0">Keranjang Belanja</h5>
                            </div>
                            <div className="card-body">
                                <table className="table my-2">
                                    <thead>
                                        <tr>
                                            <td></td>
                                            <td>Nama Produk</td>
                                            <td>Stok</td>
                                            <td>Harga</td>
                                            <td>Quantity</td>
                                            <td></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            cart.map(item => (
                                                <CartItem key={item._id} item={item} dispatch={dispatch} cart={cart} />
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="card my-2">
                            <div className="card-header py-3 bg-light">
                                <h5 className="mb-0">Pengiriman</h5>
                            </div>
                            <div className="card-body">
                                <form>
                                    <label htmlFor="address">Alamat</label>
                                    <input type="text" name="address" id="address"
                                        className="form-control mb-2" value={address}
                                        onChange={e => setAddress(e.target.value)} />

                                    <label htmlFor="mobile">No Handphone/Whatsapp</label>
                                    <input type="text" name="mobile" id="mobile"
                                        className="form-control mb-2" value={mobile}
                                        onChange={e => setMobile(e.target.value)} />
                                    <label htmlFor="ongkir">Ongkos Kirim</label>
                                    <input type="text" className="form-control mb-2 ml-auto" defaultValue={13000} disabled />
                                </form>
                                <div className="row justify-content-end">
                                    <div className="col-md-3 offset-md-3 my-2 ">
                                        <h3>Total: <span className="text-primary">Rp. {total}</span></h3>
                                    </div>
                                    <div className="col-md-3 offset-md-4 align-self-end">
                                        <Link href={auth.user ? '#!' : '/signin'}>
                                            <a className="btn btn-info my-2" onClick={handlePayment}><i className="fas fa-credit-card mr-2"></i>Lanjutkan Pembayaran</a>
                                        </Link>
                                    </div>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Cart