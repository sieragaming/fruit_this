import Head from 'next/head'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../utils/GlobalState'
import { getData } from '../config/fetchData'
import ProductItem from '../components/ProductItem'
import filterSearch from '../config/filterSearch'
import { useRouter } from 'next/router'
import FilterSearch from '../components/FilterSearch'
import FilterCategory from '../components/FilterCategory'
import FilterSort from '../components/FilterSort'

const Product = (props) => {
    const [products, setProducts] = useState(props.products)

    const [isCheck, setIsCheck] = useState(false)
    const [page, setPage] = useState(1)
    const router = useRouter()
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state

    useEffect(() => {
        setProducts(props.products)
    }, [props.products])

    useEffect(() => {
        if (Object.keys(router.query).length === 0) setPage(1)
    }, [router.query])

    const handleCheck = (id) => {
        products.forEach(product => {
            if (product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const handleCheckALL = () => {
        products.forEach(product => product.checked = !isCheck)
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const handleDeleteAll = () => {
        let deleteArr = [];
        products.forEach(product => {
            if (product.checked) {
                deleteArr.push({
                    data: '',
                    id: product._id,
                    title: 'Delete all selected products?',
                    type: 'DELETE_PRODUCT'
                })
            }
        })

        dispatch({ type: 'ADD_MODAL', payload: deleteArr })
    }

    const handleLoadmore = () => {
        setPage(page + 1)
        filterSearch({ router, page: page + 1 })
    }

    return (
        <div>
            <Head>
                <title>Produk</title>
            </Head>
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col col-md-3">
                        <div className="card px-3 py-2">
                            <div className="input-group">
                                <a className="text-uppercase text-dark" style={{ textDecoration: "none", fontSize: "14pt", fontWeight: "bold" }} >
                                    <i className="fab fa-searchengin mr-2 my-2"></i>Pencarian </a>
                                <FilterSearch />
                                <a className="text-uppercase text-dark" style={{ textDecoration: "none", fontSize: "14pt", fontWeight: "bold" }} >
                                    <i className="fas fa-list mr-2 my-2"></i>Kategori </a>
                                <FilterCategory state={state} />
                                <a className="text-uppercase text-dark" style={{ textDecoration: "none", fontSize: "14pt", fontWeight: "bold" }} >
                                    <i className="fas fa-filter mr-2 my-2"></i>Filter </a>
                                <FilterSort />
                            </div>
                        </div>
                    </div>
                    <div className="col col-md-9 ">
                        <div className="card px-3 py-2">
                            {
                                auth.user && auth.user.role === 'admin' &&
                                <>
                                    <div className="row justify-content-end">
                                        <div className="crete btn btn-primary mr-2">
                                            <span style={{ width: '20px', height: '20px', transform: 'translateY(6px)' }}>
                                                <i className="fas fa-square-plus fa-lg"></i>
                                            </span>

                                            <Link href="/create">
                                                <a className="btn btn-primary pt-2 text-uppercase">
                                                    Tambah Produk
                                                </a>
                                            </Link>
                                        </div>

                                        <div className="delete_all btn btn-danger mr-2 align-items-center">
                                            <input type="checkbox" checked={isCheck} onChange={handleCheckALL}
                                                style={{ width: '20px', height: '20px', transform: 'translateY(6px)' }} />

                                            <button className="btn btn-danger pt-2 text-uppercase"
                                                data-toggle="modal" data-target="#exampleModal"
                                                onClick={handleDeleteAll}>
                                                <i className="fas fa-trash mr-2"></i>Hapus Semua
                                            </button>
                                        </div>
                                    </div>
                                    <hr className="solid" />
                                </>
                            }


                            <div className="row">
                                {
                                    products.length === 0
                                        ? <div className="container"><h2>No Products</h2></div>

                                        : products.map(product => (
                                            <ProductItem key={product._id} product={product} handleCheck={handleCheck} />
                                        ))
                                }
                            </div>
                            {
                                props.result < page * 6 ? ""
                                    : <button className="btn btn-outline-info d-block mx-auto mb-4"
                                        onClick={handleLoadmore}>
                                        Load more
                                    </button>
                            }

                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}


export async function getServerSideProps({ query }) {
    const page = query.page || 1
    const category = query.category || 'all'
    const sort = query.sort || ''
    const search = query.search || 'all'

    const res = await getData(
        `product?limit=${page * 6}&category=${category}&sort=${sort}&title=${search}`
    )
    // server side rendering
    return {
        props: {
            products: res.products,
            result: res.result
        }, // will be passed to the page component as props
    }
}

export default Product