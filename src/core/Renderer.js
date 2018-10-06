import { WebGLRenderer, PCFSoftShadowMap } from 'three';

class Renderer {
    constructor(dom) {
        this.renderer = new WebGLRenderer({
            antialias: true
        });

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