import React from 'react'

function Footer() {
    return (
        <div>
            <footer className="bg-dark text-center text-white">
                <div className="container p-4">
                    <section className="mb-4">
                        <a
                            className="btn btn-outline-light btn-floating m-1"
                            role="button"
                        >
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a
                            className="btn btn-outline-light btn-floating m-1"
                            role="button"
                        >
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a
                            className="btn btn-outline-light btn-floating m-1"
                            role="button"
                        >
                            <i className="fab fa-google"></i>
                        </a>
                        <a
                            className="btn btn-outline-light btn-floating m-1"
                            role="button"
                        >
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a
                            className="btn btn-outline-light btn-floating m-1"
                            role="button"
                        >
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                        <a
                            className="btn btn-outline-light btn-floating m-1"
                            role="button"
                        >
                            <i className="fab fa-github"></i>
                        </a>
                    </section>

                    <section className="mb-4">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
                            distinctio earum repellat quaerat voluptatibus placeat nam, commodi
                            optio pariatur est quia magnam eum harum corrupti dicta, aliquam
                            sequi voluptate quas.
                        </p>
                    </section>
                </div>
                <div
                    className="text-center p-3"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
                >
                    © 2022 Copyright :
                    <a className="text-white ml-2">
                        UD Jendral Buah
                    </a>
                </div>
            </footer>
        </div>
    )
}

export default Footer