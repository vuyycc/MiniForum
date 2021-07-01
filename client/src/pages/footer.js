import React from 'react';
import '../css/footer.css'

class Footer extends React.Component {
    
    render() {
        return (
            <footer>
                <div class="main-content" id="section@" >
                    <div class="left box-home">
                        <h2>What is TIE?</h2>
                        <div class="content">
                            <p>TIE - Tech It Easy is forum which was created for technicians, tech-lovers and answers for every technical problems, questions in real life. </p>
                            <div class="social">
                                <a href=""><span class="fab fa-facebook-f" ></span></a>
                                <a href=""><span class="fab fa-twitter" ></span></a>
                                <a href=""><span class="fab fa-instagram" ></span></a>
                            </div>
                        </div>
                    </div>
                    <div class="center box-home">
                        <h2>Address</h2>
                        <div class="content">
                            <div class="place">
                                <span class="fas fa-map-marker-alt"></span>
                                <span class="text">22 Thành Công, Hà Nội, Việt Nam</span>
                            </div>
                            <div class="phone">
                                <span class="fas fa-phone-alt"></span>
                                <span class="text">+84-918802002</span>
                            </div>
                            <div class="email">
                                <span class="fas fa-envelope"></span>
                                <span class="text">techiteasy.mindx@gmail.com</span>
                            </div>
                        </div>
                    </div>
                    <div class="right box-home">
                        <h2>Feedback</h2>
                        <div class="content">
                            <form action="#">
                                <div class="email">
                                    <div class="text">Email *</div>
                                    <input type="email" required />
                                </div>
                                <div class="msg">
                                    <div class="text">Message *</div>
                                    <textarea cols="25" rows="2.5" required></textarea>
                                </div>
                                <div class="btn-home">
                                    <button type="submit">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <center>
                        <span class="credit">Created By <a href="../index.html">Tech It Easy</a> | </span>
                        <span class="far fa-copyright"></span><span> 2021 All rights reserved.</span>
                    </center>
                </div>
            </footer>



        )
    }
}

export default Footer;