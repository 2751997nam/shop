import { NextPage } from "next";
import Head from "next/head";
import { Fragment } from "react";
import CategoryBottom from "../../components/category/CategoryBottom";
import CategoryTop from "../../components/category/CategoryTop";
import Pagination from "../../components/common/Pagination";
import ProductItem from "../../components/common/ProductItem";

const Category: NextPage = () => {
    return (
        <Fragment>
            <Head>
                <link rel="stylesheet" href="/assets/css/category.css?v=20221014083941" />
            </Head>
            <main className="main-content">
                <CategoryTop />
                <div className="site-w categories-wrapper">
                    <div className="page-wrapper">
                        <section className="category-wrapper">
                            <div className="page-heading flex-b align-c flex-s">
                                <div className="page-heading-left flex-b align-c">
                                    <h1 className="sub-heading">
                                        Popular Sex toys
                                    </h1>
                                    <small>About 10 Results </small>
                                </div>
                                <div className="page-heading-right">
                                    <div className="filter-list-wrapper">
                                        <div className="page-heading filter-heading">
                                            Filters
                                        </div>
                                        <div className="filter-item-box">
                                            <div className="sub-page-heading">
                                                <span className="sub-page-title">Price</span>
                                                <span className="sub-page-value"></span>
                                                <span className="toggle-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16" stroke="currentColor">
                                                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                                                    </svg>
                                                </span>
                                            </div>
                                            <div className="filter-content">
                                                <ul className="filter-level1-list">
                                                    <li className="filter-child-item filter-level1-item">
                                                        <span className="filter-child-link" data-href="/sex-toys/0-30">
                                                            Under $30.00
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item filter-level1-item">
                                                        <span className="filter-child-link" data-href="/sex-toys/30-60">
                                                            From $30.00 - $60.00
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item filter-level1-item">
                                                        <span className="filter-child-link" data-href="/sex-toys/60-90">
                                                            From $60.00 - $90.00
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item filter-level1-item">
                                                        <span className="filter-child-link" data-href="/sex-toys/90-120">
                                                            From $90.00 - $120.00
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item filter-level1-item">
                                                        <span className="filter-child-link" data-href="/sex-toys/120-150">
                                                            From $120.00 - $150.00
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="filter-item-box">
                                            <div className="sub-page-heading">
                                                <span className="sub-page-title">Designer</span>
                                                <span className="sub-page-value"></span>
                                                <span className="toggle-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16" stroke="currentColor">
                                                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                                                    </svg>
                                                </span>
                                            </div>
                                            <div className="filter-content">
                                                <ul className="filter-level1-list">
                                                    <li className="filter-child-item filter-level1-item">
                                                        <span className="filter-child-link" data-href="/nguyen-xuan-truong/sex-toys">
                                                            Nguyễn Xuân Trường
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item filter-level1-item">
                                                        <span className="filter-child-link" data-href="/nguyen-van-nam/sex-toys">
                                                            Nguyễn Văn Nam
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item filter-level1-item">
                                                        <span className="filter-child-link" data-href="/luong-thi-may/sex-toys">
                                                            Lương Thị May
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item filter-level1-item">
                                                        <span className="filter-child-link" data-href="/hoang-manh-ha/sex-toys">
                                                            Hoàng Mạnh Hà
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item filter-level1-item">
                                                        <span className="filter-child-link" data-href="/thuy-huong/sex-toys">
                                                            Thuý Hường
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div id="filter-sort-product" className="filter-item-box">
                                            <div className="sub-page-heading" value="/sex-toys">
                                                <span className="sub-page-title">Most Relevant</span>
                                                <span className="toggle-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16" stroke="currentColor">
                                                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                            <div className="filter-content">
                                                <ul className="filter-level1-list">
                                                    <li className="filter-child-item">
                                                        <span className="filter-child-link " data-href="/sex-toys?order=sold">
                                                            Best Selling
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item">
                                                        <span className="filter-child-link " data-href="/sex-toys?order=lastest">
                                                            Newest
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item">
                                                        <span className="filter-child-link " data-href="/sex-toys?order=view">
                                                            Top View
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item">
                                                        <span className="filter-child-link " data-href="/sex-toys?order=low_price">
                                                            Price: Low to High
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item">
                                                        <span className="filter-child-link " data-href="/sex-toys?order=high_price">
                                                            Price: High to Low
                                                        </span>
                                                    </li>
                                                    <li className="filter-child-item">
                                                        <span className="filter-child-link " data-href="/sex-toys?order=sale">
                                                            Top Discount
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-button-wrapper">
                                    <span className="filter-icon flex-b align-c flex-c">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path
                                                d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"
                                            />
                                        </svg>
                                    </span>
                                </div>
                                <div className="filter-list-background"></div>
                            </div>

                            <div className="category-list-product-wrapper">
                                <div className="list-product">
                                    <ProductItem />
                                    <CategoryBottom />
                                </div>
                                <a href="" className="category-bottom">
                                    <img src="/assets/images/category/category-bottom.webp" alt="" />
                                </a>
                                <Pagination />
                            </div>
                        </section>
                    </div>
                </div>

                <div className="site-w">
                    <div className="even-box-wrapper"></div>
                </div>

                <div className="category-description-wrapper">
                    <div className="category-description"></div>
                    <div className="category-description-action">
                        <button className="button category-description-button">
                            <span> See More</span>
                            <span> See Less</span>
                        </button>
                    </div>
                </div>
            </main>
        </Fragment>
    )
}

export default Category;