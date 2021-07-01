import React from 'react';

export default function Header() {
    const logoutBtn = () => {
        localStorage.clear();
        window.location.reload()

    }
    return (
        <header>
            <a href="/main"><img src="/assets/images/Logo.png" class="logo" alt="Logo" /></a>
            <div class="menu">
                <input type="checkbox" id="check" />
                <label for="check" class="check-btn">
                    <i class="fa fa-bars"></i>
                </label>
                <ul>
                    <li><a href="./index.html">Feed</a></li>
                    <li><a href="/userprofile">Account</a></li>
                    <li><a href="#section@">Feedback</a></li>
                    <li><a onClick={logoutBtn}>Sign Out</a></li>
                </ul>
            </div>
        </header>
    )
}

    
