/* eslint-disable */
/**
 * 将物理引擎封装成一个物理场景
 */
import { Mesh, BoxGeometry } from 'three';

let margin = 0.05;
let transformAux1 = new Ammo.btTransform();

class PhysicsWorld {
    constructor() {
        this._physicsWorld = null;

        this._rigidBodies = []; // put meshs into physics world

        this._initPhysics();
    }

    _initPhysics() {
        // bullet config
        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        let broadphase = new Ammo.btDbvtBroadphase();
        let solver = new Ammo.btSequentialImpulseConstraintSolver();
        let gravityConstant = -9.8;

        this._physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
        this._physicsWorld.setGravity(new Ammo.btVector3(0, gravityConstant, 0));
    }

    // 创建刚体
    /**
     *
     * @param { Object } threeObj 场景中的obj
     * @param { Ammo.btBoxShape } physicsShp 传入物理面
     * @param { number } mass 质量
     * @param {*} pos 物理
     * @param {*} quat 旋转四元数
     */
    _createRigidBody(threeObject, physicsShape, mass, pos, quat) {
        threeObject.position.copy(pos);
        threeObject.quaternion.copy(quat);

        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        let motionState = new Ammo.btDefaultMotionState(transform);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);

        threeObject.userData.physicsBody = body;

        if (mass > 0) {
            this._rigidBodies.push(threeObject);

            // Disable deactivation
            // 防止物体弹力过快消失

            // Ammo.DISABLE_DEACTIVATION = 4
            body.setActivationState(4);
        }

        this._physicsWorld.addRigidBody(body);

        return body;
    }

    createTmpObj(sx, sy, sz, mass, pos, quat, material) {
        let threeObject = new Mesh(new BoxGeometry(sx, sy, sz, 1, 1, 1), material);
        let shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
        shape.setMargin(margin);

        this._createRigidBody(threeObject, shape, mass, pos, quat);

        return threeObject;
    }

    update(deltaTime) {
        this._physicsWorld.stepSimulation(deltaTime);

        // 更新物体位置
        for (let i = 0, iL = this._rigidBodies.length; i < iL; i++) {
            let objThree = this._rigidBodies[i];
            let objPhys = objThree.userData.physicsBody;
            let ms = objPhys.getMotionState();
            if (ms) {
                ms.getWorldTransform(transformAux1);
                let p = transformAux1.getOrigin();
                let q = transformAux1.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }
}

export { PhysicsWorld };