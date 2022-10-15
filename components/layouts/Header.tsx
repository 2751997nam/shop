import { Component } from "react";

const Header: Component = () => {
    return (
        <div id="main-header">
            <div className="site-w">
                <header className="site-header flex-b align-c">
                    <div className="flex-b align-c">
                        <form id="logout-form" action="/user/logout" method="POST">
                            <input type="hidden" name="_token" value="Mz9nNgWPRTy6uRZjMUVsMZrDc6xWW1DIz7sygwwK" />
                        </form>
                        <span className="is-mobile nav-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                        <label for="js-search-text" className="js-search-icon is-mobile">
                        </label>
                    </div>
                    <a className="site-logo" href="/">
                    <img src="/files/us/setting/04-10-2022/logo-633bf4c3a59a4.svg" alt="Shop Sex Toys | Adult Toys - Spencer's" />
                    </a>
                    <div className="main-search">
                        <form className="form-search" action="/search" method="get">
                            <div className="searchbox-grpup flex-b align-c">
                                <div className="form-searchbox">
                                    <input id="js-search-text" disabled className="form-control search-text" autocomplete="off" type="text" value="" name="q" placeholder="Search e.g. lube, cock ring, dildo" />

                                    <button className="button search-button" type="submit">
                                    </button>
                                </div>
                                <span className="is-moble close-search-mobile">
                                </span>
                            </div>
                        </form>
                    </div>

                </header>
            </div>
        </div>
    )
}

export default Header;