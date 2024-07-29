"use client";

import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Toast() {

    useEffect(() => {
        toast(<p>
            this is v1.0 theres a lot to be updated,full questions loaded soon!,
            <br/>
            loading 270 questions into a database is not fun lol
        </p>);
    }, []);

    return (
        <div>
            <ToastContainer />
        </div>
    );
}
