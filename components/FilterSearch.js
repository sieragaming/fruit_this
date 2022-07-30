/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import filterSearch from '../config/filterSearch'
import { getData } from '../config/fetchData'
import { useRouter } from 'next/router'

const FilterSearch = () => {

    const [search, setSearch] = useState('')

    const router = useRouter()

    useEffect(() => {
        filterSearch({ router, search: search ? search.toLowerCase() : 'all' })
    }, [search])

    return (
        <form autoComplete="off" className="col-md-12 my-2 px-0">
            <input type="text" className="form-control" list="title_product"
                value={search.toLowerCase()} onChange={e => setSearch(e.target.value)} />
        </form>

    )
}


export default FilterSearch