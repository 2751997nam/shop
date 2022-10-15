import { Component } from "react";

const Pagination: Component = () => {
    return (
        <div className="pagination-box">
            <ul className="pagination">
                <li></li>
                <li>
                    <span>Showing 1 - 10 of 10 <span className="is-desktop">products</span> </span>
                </li>
                <li></li>
            </ul>
        </div>
    )
}

export default Pagination;