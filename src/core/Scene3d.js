import { Scene, PlaneBufferGeometry, MeshBasicMaterial, Mesh, Vector3, BoxGeometry, DoubleSide } from 'three';
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
        let geo = new PlaneBufferGeometry(1000, 1000, 1, 1);
        let mat = new MeshBasicMaterial({ color: 0x550005, side: DoubleSide });

        let mesh = new Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2;
        mesh.name = 'test';
        this.scene.add(mesh);

        let geo2 = new BoxGeometry(5, 5, 5);
        let mat2 = new MeshBasicMaterial({ color: 0xffff00 });

        let mesh2 = new Mesh(geo2, mat2);
        mesh2.name = 'test2';
        this.scene.add(mesh2);
    }

    get camera() {
        return this._camera.camera;
    }
}

export { Scene3D };