import Head from "next/head";
import { Component, Fragment } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Menu from "./Menu";

const Master: Component = (props) => {
    return (
        <Fragment>
            <Head>
                <meta charset="utf-8" />
                <meta http-equiv="x-ua-compatible" content="ie=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" media="all" href="/assets/css/rules.css?v=20221014083941" />
        <link rel="stylesheet" media="all" href="/assets/css/master.css?v=20221014083941" />
        <link rel="stylesheet" media="all" href="/assets/css/layout.css?v=20221014083941" />

        <link rel="stylesheet" media="all" href="/assets/css/swiper.css?v=20221014083941" />
                <link rel="stylesheet" type="text/css" href="/assets/css/toastr.min.css?v=20221014083941" />
                <link rel="stylesheet" href="/assets/css/home.css?v=20221014083941" />
                <link rel="stylesheet" href="/assets/css/featured-products.css?v=20221014083941" />
                <link rel="stylesheet" href="/assets/css/slider.css?v=20221014083941" />
            </Head>
            <Header></Header>
            <Menu></Menu>
            {props.children}
            <Footer></Footer>

        </Fragment>
    )
}

export default Master;