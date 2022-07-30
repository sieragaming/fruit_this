import React from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import Notify from './Notify'
import Modal from './Modal'

function Layout({ children }) {
    return (
        <div>
            <Head>
                <link rel="icon" href="/image/logo.png" />
            </Head>
            <Navbar />
            <Notify />
            <Modal />
            <main className="my-4 py-3">
                {children}
            </main>
            <Footer />
        </div>
    )
}
export default Layout
