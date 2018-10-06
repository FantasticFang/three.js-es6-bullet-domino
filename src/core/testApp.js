import { Scene3D } from './Scene3d';
import { Renderer } from './Renderer';

class App {
    constructor(dom) {
        this.appScene = new Scene3D();

        this.appRenderer = new Renderer(dom);
    }

    run() {
        this._frameLoop();
    }

    _frameLoop() {
        this.appRenderer.renderer.render(this.appScene.scene, this.appScene.camera);

        requestAnimationFrame(() => {
            this._frameLoop();
        });
    }
}

export { App };