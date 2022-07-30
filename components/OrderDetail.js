/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import PaypalBtn from './PaypalBtn'
import { patchData } from '../config/fetchData'
import { updateItem } from '../utils/Actions'

const OrderDetail = ({ orderDetail, state, dispatch }) => {
    const { auth, orders } = state

    const handleDelivered = (order) => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        patchData(`order/delivered/${order._id}`, null, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                const { paid, dateOfPayment, method, delivered } = res.result

                dispatch(updateItem(orders, order._id, {
                    ...order, paid, dateOfPayment, method, delivered
                }, 'ADD_ORDERS'))

                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
    }


    if (!auth.user) return null;
    return (
        <>
            {
                orderDetail.map(order => (
                    <div key={order._id} className="row justify-content-around">

                        <div className="text-uppercase my-5" style={{ maxWidth: '600px' }}>
                            <h2 className="text-break">Pesanan {order.user.name}</h2>

                            <div className="mt-4 text-secondary">
                                <h3>Detail Pesanan</h3>
                                <p>Nama: {order.user.name}</p>
                                <p>Email: {order.user.email}</p>
                                <p>Alamat: {order.address}</p>
                                <p>No Handphone/Whatsapp: {order.mobile}</p>

                                <div className={`alert ${order.delivered ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-items-center`} role="alert">
                                    {
                                        order.delivered ? `Pesanan Dikirim ${order.updatedAt}` : 'Belum Dikirim'
                                    }
                                    {
                                        auth.user.role === 'admin' && !order.delivered &&
                                        <button className="btn btn-dark text-uppercase"
                                            onClick={() => handleDelivered(order)}>
                                            Pembayaran Sudah Diterima
                                        </button>
                                    }

                                </div>

                                <h3>Payment</h3>
                                {
                                    order.method && <h6>Method: <em>{order.method}</em></h6>
                                }

                                {
                                    order.paymentId && <p>PaymentId: <em>{order.paymentId}</em></p>
                                }

                                <div className={`alert ${order.paid ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-items-center`} role="alert">
                                    {
                                        order.paid ? `Paid on ${order.dateOfPayment}` : 'Not Paid'
                                    }

                                </div>

                                <div>
                                    <h3>Order Items</h3>
                                    {
                                        order.cart.map(item => (
                                            <div className="row border-bottom mx-0 p-2 justify-content-betwenn
                                    align-items-center" key={item._id} style={{ maxWidth: '550px' }}>
                                                <img src={item.images[0].url} alt={item.images[0].url}
                                                    style={{ width: '50px', height: '45px', objectFit: 'cover' }} />

                                                <h5 className="flex-fill text-secondary px-3 m-0">
                                                    <Link href={`/product/${item._id}`}>
                                                        <a>{item.title}</a>
                                                    </Link>
                                                </h5>

                                                <span className="text-info m-0">
                                                    {item.quantity} x Rp.{item.price} = Rp.{item.price * item.quantity}
                                                </span>

                                            </div>
                                        ))
                                    }
                                </div>

                            </div>

                        </div>

                        {
                            !order.paid && auth.user.role !== 'admin' &&
                            <div className="p-4">
                                <h2 className="mb-4 text-uppercase my-4">Total: Rp. {order.total}</h2>
                                <PaypalBtn order={order} />
                            </div>
                        }

                    </div>
                ))
            }
        </>
    )
}

export default OrderDetail