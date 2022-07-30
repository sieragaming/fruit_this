/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { decrease, increase } from '../utils/Actions'

const CartItem = ({ item, dispatch, cart }) => {
    return (
        <tr>
            <td style={{ width: '80px', overflow: 'hidden' }}>
                <img src={item.images[0].url} alt={item.images[0].url}
                    className="img-thumbnail w-80"
                    style={{ minWidth: '80px', height: '80px', objectFit: "cover" }} />
            </td>

            <td style={{ minWidth: '100px' }} className="w-40 align-middle" >
                <h5 className="text-capitalize text-dark">
                    {item.title}
                </h5>
                <Link href={`/product/${item._id}`}>
                    <a className="btn btn-info"><i className="fas fa-eye mr-2"></i>Lihat Detail</a>
                </Link>
            </td>
            <td className="align-middle">
                {
                    item.inStock > 0
                        ? <p className="mb-1 text-dark">In Stock: {item.inStock}</p>
                        : <p className="mb-1 text-danger">Out Stock</p>
                }
            </td>
            <td className="align-middle ">
                <h6 className="text-dark">Rp. {item.price}</h6>
            </td>
            <td className="align-middle w-80" style={{ minWidth: '100px', cursor: "pointer" }}>
                <button className="btn btn-primary"
                    onClick={() => dispatch(decrease(cart, item._id))}
                    disabled={item.quantity === 1 ? true : false} > <i className="fas fa-minus fa-lg"></i> </button>

                <span className="px-3">{item.quantity}</span>

                <button className="btn btn-primary"
                    onClick={() => dispatch(increase(cart, item._id))}
                    disabled={item.quantity === item.inStock ? true : false} > <i className="fas fa-plus fa-lg"></i> </button>
            </td>

            <td className="align-middle w-20" style={{ minWidth: '50px', cursor: 'pointer' }}>
                <i className="fas fa-trash text-danger" aria-hidden="true"
                    style={{ fontSize: '18px' }} data-toggle="modal" data-target="#exampleModal"
                    onClick={() => dispatch({
                        type: 'ADD_MODAL',
                        payload: [{ data: cart, id: item._id, title: item.title, type: 'ADD_CART' }]
                    })} ></i>
            </td>
        </tr>
    )
}

export default CartItem