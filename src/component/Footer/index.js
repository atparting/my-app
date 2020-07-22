import React from 'react';
import './index.css';

function Footer() {

    return (
        <div id="bottom_layer">
            <div className="s-bottom-layer-left">
                <span className="lh">FlyPigeon</span>
            </div>
            <div className="s-bottom-layer-right">
                <span className="lh">©2020 FlyPigeon </span>
                <a
                    className="lh"
                    target="_blank"
                    href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802032451"
                >
                    <img src="beian.png" alt="备案图标"/>
                    <span>
                            京公网安备11010802032451号
                        </span>
                </a>
                <a className="lh" href="http://beian.miit.gov.cn" target="_blank">京ICP备20027897号</a>
            </div>
        </div>
    );
}

export default Footer;
