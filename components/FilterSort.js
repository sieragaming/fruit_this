import React, { useState, useEffect } from 'react'
import filterSearch from '../config/filterSearch'
import { getData } from '../config/fetchData'
import { useRouter } from 'next/router'

const FilterSort = () => {

    const [sort, setSort] = useState('')
    const router = useRouter()

    const handleSort = (e) => {
        setSort(e.target.value)
        filterSearch({ router, sort: e.target.value })
    }

    return (
        <div className="input-group-prepend col-md-12 px-0 mt-2">

            <select className="custom-select text-capitalize"
                value={sort} onChange={handleSort}>

                <option value="-createdAt">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="-sold">Terjual Banyak</option>
                <option value="-price">Harga Dari Tinggi Ke Rendah</option>
                <option value="price">Harga Dari Rendah Ke Tinggi</option>

            </select>
        </div>
    )
}

export default FilterSort