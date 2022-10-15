import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/home/Banner'
import Category from '../components/home/Category'
import Description from '../components/home/Description'
import Introduction from '../components/home/Introduction'

const Home: NextPage = () => {
    return (
        <main className="main-content">
            <Banner />
            <Category />
            <Introduction />
            <h1 className="text-center home-page-title" id="home-page-title"></h1>
            <Description />
        </main>
    )
}

export default Home
