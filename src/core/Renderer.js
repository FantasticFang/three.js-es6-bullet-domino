import { WebGLRenderer, PCFSoftShadowMap } from 'three';

class Renderer {
    constructor(dom) {
        this.renderer = new WebGLRenderer({
            antialias: true
        });

        this._setShadow(true);

        this.resize(dom.clientWidth, dom.clientHeight);

        this.renderer.setClearColor('#000000');

        dom.appendChild(this.renderer.domElement);
    }

    resize(w, h) {
        this.renderer.setSize(w, h);
    }

    _setShadow(falg) {
        this.renderer.shadowMap.enabled = falg;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
    }

    render(scene3D) {
        this.renderer.render(scene3D.scene, scene3D.camera);
    }
}

export { Renderer };