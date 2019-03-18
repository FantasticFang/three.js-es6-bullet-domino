import { Scene, MeshBasicMaterial, MeshPhongMaterial, Quaternion, Vector3, TextureLoader, RepeatWrapping, Mesh, BoxGeometry, Raycaster, Vector2 } from 'three';
import { Camera3D } from './Camera3d';
import { Light } from './Light';

import { PhysicsWorld } from '../physics/PhysicsWorld';

class Scene3D {
    constructor() {
        this.scene = new Scene();

        this._camera = null;
        this._light = null;

        this._initialize();
        this._test();
    }

    _initialize() {
        this._light = new Light(this.scene);

        this._world = new PhysicsWorld();

        this._camera = new Camera3D('camera3d', 45, window.innerWidth / window.innerHeight);
        this._camera.setAttribute(new Vector3(20, 20, 0), new Vector3(0, 0, 0));

        this.scene.background = new TextureLoader().load('assets/picture/grey-background.jpg');
    }

    _testDomino() {
        let map = new TextureLoader().load('assets/picture/grid.png');
        map.wrapS = RepeatWrapping;
        map.wrapT = RepeatWrapping;
        map.repeat.set(40, 40);

        let pos = new Vector3();
        let quat = new Quaternion();

        // 创建地面
        pos.set(0, -0.5, 0);
        quat.set(0, 0, 0, 1);
        let ground = new Mesh(new BoxGeometry(400, 1, 400, 1, 1, 1), new MeshBasicMaterial({ map: map }));
        ground.receiveShadow = true;
        ground.position.copy(pos);
        ground.quaternion.copy(quat);

        this._world.addSimpleObj(ground, 'box', 0);

        this.scene.add(ground);

        let mesh;
        let mat = [new MeshPhongMaterial({ map: new TextureLoader().load('assets/picture/domino.jpg') }),
            new MeshPhongMaterial({ map: new TextureLoader().load('assets/picture/domino2.jpg') })];
        // 随机创建30个箱子

        let tmpArr = [];
        for (let i = 0; i < 30; i++) {
            pos.set(0.5, 1, i * 2);
            quat.set(0, 0, 0, 1);

            mesh = new Mesh(new BoxGeometry(1, 3, 0.5, 1, 1, 1), mat[i % 2]);
            mesh.position.copy(pos);
            mesh.quaternion.copy(quat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this._world.addSimpleObj(mesh, 'box', 1);
            this.scene.add(mesh);
            tmpArr.push(mesh);
        }

        this._addRaycaster(tmpArr, (intersect) => {
            mesh = intersect.object; // FIXME：ammo.js的文档太少，这里不知道如何改变已有刚体的动量
            mesh.position.z += 0.4;
            mesh.quaternion.set(0.3, 0, 0, 1);
            this._world.addSimpleObj(mesh, 'box', 2);
        });
    }

    _addRaycaster(objects, callback) {
        let scope = this;
        window.addEventListener('dblclick', function(event) {
            let raycaster = new Raycaster();
            let mouseCoords = new Vector2();

            mouseCoords.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );

            raycaster.setFromCamera(mouseCoords, scope.camera);
            let intersects = raycaster.intersectObjects(objects, true);
            if (intersects.length && callback) {
                callback(intersects[0]);
            }
        }, false);
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