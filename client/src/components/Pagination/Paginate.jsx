import React from "react";

const Paginate = ({ dataPerPage, totalData, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalData / dataPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="py-2">
            <div>
                <p className="text-sm text-gray-700">
                    Showing
                    <span className="font-medium"> {currentPage * dataPerPage - 5} </span>
                    to
                    <span className="font-medium"> {currentPage * dataPerPage} </span>
                    of
                    <span className="font-medium"> {totalData} </span>
                    results
                </p>
            </div>
            <nav className="block mt-1">
                <ul className="flex pl-0 rounded list-none flex-wrap">
                    <li>
                        {pageNumbers.map((number, i) => (
                            <a
                                onClick={() => {
                                    paginate(number);
                                }}
                                key={i}
                                className={
                                    currentPage === number
                                        ? "bg-blue border-red-300 text-red-500 hover:bg-blue-200 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                        : "bg-white border-gray-300 text-gray-500 hover:bg-blue-200 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                }
                            >
                                {number}
                            </a>
                        ))}
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Paginate;
