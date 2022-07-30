import React, { useState, useEffect } from 'react'
import filterSearch from '../config/filterSearch'
import { getData } from '../config/fetchData'
import { useRouter } from 'next/router'

const FilterCategory = ({ state }) => {
    const [category, setCategory] = useState('')
    const { categories } = state
    const router = useRouter('')

    const handleCategory = (e) => {
        setCategory(e.target.value)
        filterSearch({ router, category: e.target.value })
    }

    return (
        <div className="input-group-prepend col-md-12 px-0 my-2">
            <select className="custom-select text-capitalize"
                value={category} onChange={handleCategory}>

                <option value="all">All Products</option>

                {
                    categories.map(item => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                    ))
                }
            </select>
        </div>
    )
}

export default FilterCategory