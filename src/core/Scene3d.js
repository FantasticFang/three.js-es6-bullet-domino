import { Scene, MeshBasicMaterial, MeshPhongMaterial, Quaternion, Vector3, TextureLoader, RepeatWrapping } from 'three';
import { Camera3D } from './Camera3d';
import { Light } from './Light';

import { PhysicsWorld } from '../physics/PhysicsWorld';

class Scene3D {
    constructor() {
        this.scene = new Scene();

        this._camera = null;
        this._light = null;

        this._world = null;

        this._initlize();
        this._test();
    }

    _initlize() {
        this._light = new Light(this.scene);

        this._world = new PhysicsWorld();

        this._camera = new Camera3D('camera3d', 45, window.innerWidth / window.innerHeight);
        this._camera.setAttribute(new Vector3(20, 20, 0), new Vector3(0, 0, 0));
        this.scene.add(this.camera);
    }

    _test() {
        let map = new TextureLoader().load('assets/picture/grid.png');
        map.wrapS = RepeatWrapping;
        map.wrapT = RepeatWrapping;
        map.repeat.set(40, 40);

        let pos = new Vector3();
        let quat = new Quaternion();

        // 创建地面
        pos.set(0, -0.5, 0);
        quat.set(0, 0, 0, 1);
        let ground = this._world.createTmpObj(400, 1, 400, 0, pos, quat, new MeshBasicMaterial());
        ground.castShadow = true;
        ground.receiveShadow = true;
        ground.material.map = map;

        this.scene.add(ground);

        function createRendomColorObjectMeatrial() {
            let color = Math.floor(Math.random() * (1 << 24));
            return new MeshPhongMaterial({ color: color });
        }

        let mesh;
        // 随机创建30个箱子
        for (let i = 0; i < 30; i++) {
            pos.set(Math.random(), 2 * i, Math.random());
            quat.set(0, 0, 0, 1);

            mesh = this._world.createTmpObj(1, 1, 1, 0.5, pos, quat, createRendomColorObjectMeatrial());
            this.scene.add(mesh);
        }
    }

    update(deltaTime) {
        this._world.update(deltaTime);
    }

    get camera3D() {
        return this._camera;
    }

    get camera() {
        return this._camera.camera;
    }
}

export { Scene3D };