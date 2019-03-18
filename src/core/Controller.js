import { OrbitControls } from '../../libs/OrbitControls';

class Controller {
    constructor(camera, renderDom) {
        this._camera = camera;

        this._orbit = new OrbitControls(camera, renderDom);
    }

    update(deltaTime) {
        this._orbit.update(deltaTime);
    }
}

export { Controller };