import { WebGLRenderer, PCFSoftShadowMap } from 'three';

class Renderer {
    constructor(dom) {
        this.renderer = new WebGLRenderer({
            antialias: true
        });

        this.resize(dom.clientWidth, dom.clientHeight);

        this.renderer.autoClear = false;
        this.renderer.setClearColor('#000000');

        dom.appendChild(this.renderer.domElement);
    }

    resize(w, h) {
        this.renderer.setSize(w, h);
    }

    _setShadow() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
    }
}

export { Renderer };