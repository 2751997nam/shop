import { Component } from "react";
import CustomLink from "../common/CustomLink";

const Menu: Component = () => {
    return (
        <nav className="navigation-wrapper">
            <div className=" site-w">
                <ul className="navigation-list flex-b align-c" role="menubar">
                    <li id="mobileCustomerStatus" className="navigation-item is-mobile navigation-mobile">
                        <div className="mobile-menuu-link">
                            <a href="/user/sign-in">Log In</a>
                            <span className="text-light pad-x-4">or</span>
                            <a href="/user/sign-up">Sign Up</a>
                        </div>
                    </li>

                    <li className="navigation-item" data-menu-id="76">
                        <div className="navigation-box navigation-has-arrow">
                            <CustomLink href="/collections/sex-toys" className="navigation-link">
                                Sex Toys
                            </CustomLink>
                        </div>
                        <div className="sub-navigation" data-menu-id="76">
                            <ul className="navigation-lev2-list">
                                <li className="lev2-item goback-menu goback-lev2menu">
                                    <CustomLink href="/collections/sex-toys" className="lev2-link">
                                        <span className="goback-icon">
                                            <img src="/images/svg/arrow-01.svg" alt="Sex Toys" />
                                        </span>
                                        <span className="hide-small-screen">All Sex Toys</span>
                                        <div className="hide-large-screen">Sex Toys</div>
                                    </CustomLink>
                                </li>
                                <li className="lev2-item goall-category">
                                    <CustomLink href="/collections/sex-toys" className="lev2-link">
                                        All Sex Toys
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/man" className="lev2-link">
                                        For Him
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/for-her" className="lev2-link">
                                        For Her
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/sex-toys-for-couples" className="lev2-link">
                                        For Couples
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/for-lesbian" className="lev2-link">
                                        For Lesbian
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/anal-toys" className="lev2-link">
                                        For Gay
                                    </CustomLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="78">
                        <div className="navigation-box navigation-has-arrow">
                            <CustomLink href="/collections/vibrators" className="navigation-link">
                                Vibrators
                            </CustomLink>
                        </div>
                        <div className="sub-navigation" data-menu-id="78">
                            <ul className="navigation-lev2-list">
                                <li className="lev2-item goback-menu goback-lev2menu">
                                    <CustomLink href="/collections/vibrators" className="lev2-link">
                                        <span className="goback-icon">
                                            <img src="/images/svg/arrow-01.svg" alt="Vibrators" />
                                        </span>
                                        <span className="hide-small-screen">All Vibrators</span>
                                        <div className="hide-large-screen">Vibrators</div>
                                    </CustomLink>
                                </li>
                                <li className="lev2-item goall-category">
                                    <CustomLink href="/collections/vibrators" className="lev2-link">
                                        All Vibrators
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/g-spot-vibrators" className="lev2-link">
                                        G-Spot Vibrators
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/clitoral-vibrators" className="lev2-link">
                                        Clitoral Vibrators
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/rabbit-vibrators" className="lev2-link">
                                        Rabbit Vibrators
                                    </CustomLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="id1665384384682">
                        <div className="navigation-box ">
                            <CustomLink href="/collections/dildos" className="navigation-link">
                                Dildos
                            </CustomLink>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="19">
                        <div className="navigation-box ">
                            <CustomLink href="/collections/anal-toys" className="navigation-link">
                                <img className="is-mobile menu-image" src="https://cdn.sweetsextoy.com/unsafe/fit-in/40x40/filters:fill(fff)/sweetsextoy.com/images/logo.png" alt="Anal Toys" loading="lazy" width="40" height="40" />
                                Anal Toys
                            </CustomLink>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="8">
                        <div className="navigation-box navigation-has-arrow">
                            <CustomLink href="/collections/lingerie-and-apparel" className="navigation-link">
                                <img
                                    className="is-mobile menu-image"
                                    src="https://cdn.sweetsextoy.com/unsafe/40x40/sweetsextoy.com/files/us/category/04-10-2022/sexy-lingerie-page-lead-desktop-633bf55ea3af4.webp"
                                    alt="Lingerie &amp; Apparel"
                                    loading="lazy"
                                    width="40"
                                    height="40"
                                />
                                Lingerie &amp; Apparel
                            </CustomLink>
                        </div>
                        <div className="sub-navigation" data-menu-id="8">
                            <ul className="navigation-lev2-list">
                                <li className="lev2-item goback-menu goback-lev2menu">
                                    <CustomLink href="/collections/lingerie-and-apparel" className="lev2-link">
                                        <span className="goback-icon">
                                            <img src="/images/svg/arrow-01.svg" alt="Lingerie &amp; Apparel" />
                                        </span>
                                        <span className="hide-small-screen">All Lingerie &amp; Apparel</span>
                                        <div className="hide-large-screen">Lingerie &amp; Apparel</div>
                                    </CustomLink>
                                </li>
                                <li className="lev2-item goall-category">
                                    <CustomLink href="/collections/lingerie-and-apparel" className="lev2-link">
                                        All Lingerie &amp; Apparel
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/sexy-bras-and-bra-sets" className="lev2-link">
                                        Sexy Bras and Bra Sets
                                    </CustomLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="30">
                        <div className="navigation-box ">
                            <CustomLink href="/collections/bondage" className="navigation-link">
                                Bondage
                            </CustomLink>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="29">
                        <div className="navigation-box ">
                            <CustomLink href="/collections/sexual-wellness" className="navigation-link">
                                Sexual Wellness
                            </CustomLink>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="82">
                        <div className="navigation-box navigation-has-arrow">
                            <CustomLink href="/collections/lubes-condoms" className="navigation-link">
                                Lubes &amp; Condoms
                            </CustomLink>
                        </div>
                        <div className="sub-navigation" data-menu-id="82">
                            <ul className="navigation-lev2-list">
                                <li className="lev2-item goback-menu goback-lev2menu">
                                    <CustomLink href="/collections/lubes-condoms" className="lev2-link">
                                        <span className="goback-icon">
                                            <img src="/images/svg/arrow-01.svg" alt="Lubes &amp; Condoms" />
                                        </span>
                                        <span className="hide-small-screen">All Lubes &amp; Condoms</span>
                                        <div className="hide-large-screen">Lubes &amp; Condoms</div>
                                    </CustomLink>
                                </li>
                                <li className="lev2-item goall-category">
                                    <CustomLink href="/collections/lubes-condoms" className="lev2-link">
                                        All Lubes &amp; Condoms
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/water-based-lubes" className="lev2-link">
                                        Water-Based Lubes
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/silicone-based-lubes" className="lev2-link">
                                        Silicone-Based Lubes
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/hybrid-lubes" className="lev2-link">
                                        Hybrid Lubes
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/heating-cooling-lubes" className="lev2-link">
                                        Heating / Cooling Lubes
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/flavored-lubes" className="lev2-link">
                                        Flavored Lubes
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/massage-oils" className="lev2-link">
                                        Massage Oils
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/condoms" className="lev2-link">
                                        Condoms
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/plant-based-lube" className="lev2-link">
                                        Plant-Based Lube
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/vegan" className="lev2-link">
                                        Vegan
                                    </CustomLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="96">
                        <div className="navigation-box navigation-has-arrow">
                            <CustomLink href="/collections/massage-relaxation" className="navigation-link">
                                Massage &amp; Relaxation
                            </CustomLink>
                        </div>
                        <div className="sub-navigation" data-menu-id="96">
                            <ul className="navigation-lev2-list">
                                <li className="lev2-item goback-menu goback-lev2menu">
                                    <CustomLink href="/collections/massage-relaxation" className="lev2-link">
                                        <span className="goback-icon">
                                            <img src="/images/svg/arrow-01.svg" alt="Massage &amp; Relaxation" />
                                        </span>
                                        <span className="hide-small-screen">All Massage &amp; Relaxation</span>
                                        <div className="hide-large-screen">Massage &amp; Relaxation</div>
                                    </CustomLink>
                                </li>
                                <li className="lev2-item goall-category">
                                    <CustomLink href="/collections/massage-relaxation" className="lev2-link">
                                        All Massage &amp; Relaxation
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/candles" className="lev2-link">
                                        Candles
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/edibles" className="lev2-link">
                                        Edibles
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/tools" className="lev2-link">
                                        Tools
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/lotions" className="lev2-link">
                                        Lotions
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/oils" className="lev2-link">
                                        Oils
                                    </CustomLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="102">
                        <div className="navigation-box navigation-has-arrow">
                            <CustomLink href="/collections/personal-care-hygiene" className="navigation-link">
                                Personal Care &amp; Hygiene
                            </CustomLink>
                        </div>
                        <div className="sub-navigation" data-menu-id="102">
                            <ul className="navigation-lev2-list">
                                <li className="lev2-item goback-menu goback-lev2menu">
                                    <CustomLink href="/collections/personal-care-hygiene" className="lev2-link">
                                        <span className="goback-icon">
                                            <img src="/images/svg/arrow-01.svg" alt="Personal Care &amp; Hygiene" />
                                        </span>
                                        <span className="hide-small-screen">All Personal Care &amp; Hygiene</span>
                                        <div className="hide-large-screen">Personal Care &amp; Hygiene</div>
                                    </CustomLink>
                                </li>
                                <li className="lev2-item goall-category">
                                    <CustomLink href="/collections/personal-care-hygiene" className="lev2-link">
                                        All Personal Care &amp; Hygiene
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/bath-body" className="lev2-link">
                                        Bath &amp; Body
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/intimate-cleansing" className="lev2-link">
                                        Intimate Cleansing
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/scents" className="lev2-link">
                                        Scents
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/shaving" className="lev2-link">
                                        Shaving
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/toy-cleaner" className="lev2-link">
                                        Toy Cleaner
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/menstrual-cups" className="lev2-link">
                                        Menstrual Cups
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/toy-storage" className="lev2-link">
                                        Toy Storage
                                    </CustomLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="110">
                        <div className="navigation-box navigation-has-arrow">
                            <CustomLink href="/collections/books" className="navigation-link">
                                Books
                            </CustomLink>
                        </div>
                        <div className="sub-navigation" data-menu-id="110">
                            <ul className="navigation-lev2-list">
                                <li className="lev2-item goback-menu goback-lev2menu">
                                    <CustomLink href="/collections/books" className="lev2-link">
                                        <span className="goback-icon">
                                            <img src="/images/svg/arrow-01.svg" alt="Books" />
                                        </span>
                                        <span className="hide-small-screen">All Books</span>
                                        <div className="hide-large-screen">Books</div>
                                    </CustomLink>
                                </li>
                                <li className="lev2-item goall-category">
                                    <CustomLink href="/collections/books" className="lev2-link">
                                        All Books
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/guides-how-to-instructional" className="lev2-link">
                                        Guides, How-To &amp; Instructional
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/art-pictorials-coloring-books" className="lev2-link">
                                        Art &amp; Pictorials, Coloring Books
                                    </CustomLink>
                                </li>
                                <li className="lev2-item ">
                                    <CustomLink href="/collections/erotica" className="lev2-link">
                                        Erotica
                                    </CustomLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="navigation-item" data-menu-id="114">
                        <div className="navigation-box ">
                            <CustomLink href="/collections/gift-cards" className="navigation-link">
                                Gift Cards
                            </CustomLink>
                        </div>
                    </li>
                    <li className="more-menu-item">
                        <div className="more-menu-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="more-menu-item-wrapper">
                            <div className="more-menu-item-content">
                                <div className="more-menu-init-menu"></div>
                            </div>
                        </div>
                        <div className="more-menu-item-wrapper-background"></div>
                    </li>
                </ul>
                <div className="mobile-menu is-mobile">
                    <ul className="mobile-menu-list">
                        <li className="mobile-menuu-item">
                            <a className="mobile-menuu-link" href="/top-sale">
                                <span>Top Sale</span>
                            </a>
                        </li>
                        <li className="mobile-menuu-item">
                            <CustomLink className="mobile-menuu-link" href="/collections/shipping-delivery-n7.html">
                                Delivery
                            </CustomLink>
                        </li>
                        <li className="mobile-menuu-item">
                            <CustomLink className="mobile-menuu-link" href="/collections/refund-exchange-n11.html">
                                Returns
                            </CustomLink>
                        </li>
                        <li className="mobile-menuu-item">
                            <CustomLink className="mobile-menuu-link" href="/collections/faq-n9.html">
                                Help Center
                            </CustomLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Menu;