/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useContext } from 'react'
import { DataContext } from '../utils/GlobalState'
import { addToCart } from '../utils/Actions'

const ProductItem = ({ product, handleCheck }) => {
    const { state, dispatch } = useContext(DataContext)
    const { cart, auth } = state

    const userLink = () => {
        return (
            <>
                <Link href={`product/${product._id}`}>
                    <a className="btn btn-info"
                        style={{ marginRight: '2px', flex: 1 }}><i className="fas fa-eye mr-1"></i>Lihat Detail</a>
                </Link>
                <button className="btn btn-success"
                    style={{ marginLeft: '2px' }}
                    disabled={product.inStock === 0 ? true : false}
                    onClick={() => dispatch(addToCart(product, cart))} >
                    <i className="fas fa-shopping-cart mr-1"></i>
                </button>
            </>
        )
    }

    const adminLink = () => {
        return (
            <>
                <Link href={`create/${product._id}`}>
                    <a className="btn btn-info"
                        style={{ marginRight: '2px', flex: 1 }}><i className="fas fa-edit mr-1"></i>Ubah</a>
                </Link>
                <button className="btn btn-danger"
                    style={{ marginLeft: '2px' }}
                    data-toggle="modal" data-target="#exampleModal"
                    onClick={() => dispatch({
                        type: 'ADD_MODAL',
                        payload: [{
                            data: '', id: product._id,
                            title: product.title, type: 'DELETE_PRODUCT'
                        }]
                    })} >
                    <i className="fas fa-trash mr-1"></i>
                </button>
            </>
        )
    }

    return (
        <>
            <div className="col-md-6 col-lg-4 mb-4 d-flex">
                <div className="card flex-fill">
                    {
                        auth.user && auth.user.role === 'admin' &&
                        <input type="checkbox" checked={product.checked}
                            className="position-absolute my-2 mx-2"
                            style={{ height: '20px', width: '20px' }}
                            onChange={() => handleCheck(product._id)} />
                    }
                    <div className="d-flex justify-content-between">
                        <img
                            src={product.images[0].url}
                            className="card-img-top"
                            alt={product.images[0].url}
                            height="150px"
                            width="220px"
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-between mb-3">
                            <h5 className="mb-0 text-uppercase" style={{ fontWeight: "bold" }}>{product.title}</h5>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="medium">Rp. {product.price} <span className="small">/kg</span></p>
                            {
                                product.inStock > 0
                                    ? <p className="medium text-danger">Stok : {product.inStock} <span className="small">/kg</span></p>
                                    : <p className="medium text-danger">Stok Habis</p>
                            }

                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <p className="text-muted mb-0">Kualitas </p>
                            <div className="ms-auto text-warning">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="far fa-star"></i>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mb-2">
                            {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}


export default ProductItem