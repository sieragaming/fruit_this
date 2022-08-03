import React, { useState, useContext, useEffect } from 'react'
import { DataContext } from '../utils/GlobalState'
import Link from 'next/link'

const Pesanan = () => {
  const { state, dispatch } = useContext(DataContext)
  const { orders } = state
  return (
    <div className='container'>
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
  )
}

export default Pesanan