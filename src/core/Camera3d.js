import { PerspectiveCamera } from 'three';

class Camera3D {
    constructor(name, fov, aspect) {
        this.camera = new PerspectiveCamera(fov, aspect, 0.1, 5000);
        this.camera.name = name;
    }

    /**
     * change camera aspect when canvas is resized
     * @param {*} w width
     * @param {*} h height
     */
    resize(w, h) {
        this.camera.aspect = w / h;

        this.camera.updateProjectionMatrix();
    }

    setAttribute(pos, targetPos) {
        this.camera.position.copy(pos);

        this.camera.lookAt(targetPos);
    }
}

export { Camera3D };