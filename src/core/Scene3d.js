import { Scene, PlaneBufferGeometry, MeshBasicMaterial, Mesh, Vector3 } from 'three';
import { Camera3D } from './Camera3d';
import { Light } from './Light';

class Scene3D {
    constructor() {
        this.scene = new Scene();

        this._initlize();
        this._test();
    }

    _initlize() {
        this._light = new Light(this.scene);

        this._camera = new Camera3D('camera3d', 45, window.innerWidth / window.innerHeight);
        this._camera.setAttribute(new Vector3(0, 100, 0), new Vector3(0, 0, 0));
    }

    _test() {
        let geo = new PlaneBufferGeometry(1000, 1000);
        let mat = new MeshBasicMaterial({ color: 0xff0000 });

        let mesh = new Mesh(geo, mat);
        mesh.name = 'test';
        this.scene.add(mesh);
    }

    get camera() {
        return this._camera.camera;
    }
}

export { Scene3D };