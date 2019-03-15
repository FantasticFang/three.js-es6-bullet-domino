import { Scene3D } from './Scene3d';
import { Renderer } from './Renderer';
import { Controller } from './Controller';
import { Clock } from 'three';

const clock = new Clock();

class App {
    constructor(dom) {
        this._dom = dom;

        this._lastFrameTime = 0;

        this._appScene3D = new Scene3D();

        this._appRenderer = new Renderer(dom);

        this._appController = new Controller(this._appScene3D.camera, this._appRenderer.renderer.domElement);
    }

    run() {
        this._frameLoop();

        this._listenCanvasSize();
    }

    _frameLoop(time) {
        let deltaTime = clock.getDelta();

        this._appController.update(deltaTime);
        this._appScene3D.update(deltaTime);
        this._appRenderer.render(this._appScene3D);

        // use ES6 or bind to change this pointer
        requestAnimationFrame(() => {
            this._frameLoop(time);
        });
    }

    _listenCanvasSize() {
        let scope = this;
        function canvasChanged() {
            let [w, h] = [scope._dom.clientWidth, scope._dom.clientHeight];

            scope._appScene3D.camera3D.resize(w, h);
            scope._appRenderer.resize(w, h);
        }

        window.addEventListener('resize', canvasChanged, false);
    }
}

export { App };