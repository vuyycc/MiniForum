import React, { Component, useState,useEffect } from 'react';
import '../css/trangchu.css'

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            token: localStorage.getItem('accessToken')
        }
    }
    render() {
        return (
            <div class="container">
                <header>
                    <a href="#"><img src="/assets/images/Logo.png" class="logo" alt="Logo" /></a>

                    <div class="menu">
                        <input type="checkbox" id="check" />
                        <label for="check" class="check-btn">
                            <i class="fa fa-bars"></i>
                        </label>
                        <ul>
                            <li><a href="./index.html">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href={this.state.token?"/main":"/login"}>Forum</a></li>
                            <li><a href="#">Feedback</a></li>
                        </ul>
                    </div>

                </header>

                <main>
                    <div class="slider">
                        <div class="slider-inner">
                            <div class="item" data-text="Welcome">
                                <img src="/assets/images/Slider1.png" alt="Picture 1" />
                                <div class="text">
                                    <h1>Welcome to Tech It Eazy</h1>
                                    <p>A forum for every Tech-lover in the world</p>
                                </div>
                            </div>
                            <div class="item" data-text="Technology Questions">
                                <img src="/assets/images/Slider2.png" alt="Picture 2" />
                                <div class="text">
                                    <h1>Tech It Eazy | Q&A</h1>
                                    <p>Where every question about technology can be answered</p>
                                </div>
                            </div>
                            <div class="item" data-text="Mordern Forum">
                                <img src="/assets/images/Slider3.png" alt="Picture 3" />
                                <div class="text">
                                    <h1>Tech It Eazy | Forum</h1>
                                    <p>A mordern platform that can ease anyone from the first look</p>
                                </div>
                            </div>
                        </div>
                        <div class="btn">
                            <button><a href="./login/index.html">Explore</a></button>
                        </div>

                    </div>
                    <div class="wave-line">
                        <div class="line line1"></div>
                        <div class="line line2"></div>
                        <div class="line line3"></div>
                    </div>
                </main>



            </div>
        )
    }
}

export default Home;