/* eslint-disable */
/**
 * 将物理引擎封装成一个物理场景
 */
const margin = 0.05;
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
     */
    _createRigidBody(threeObj, physicsShape, mass) {
        let pos = threeObj.position;
        let quat = threeObj.quaternion;

        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        let motionState = new Ammo.btDefaultMotionState(transform);

        let localInertia = new Ammo.btVector3(0, 0, 0);
        physicsShape.calculateLocalInertia(mass, localInertia);

        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
        let body = new Ammo.btRigidBody(rbInfo);

        threeObj.userData.physicsBody = body;

        if (mass > 0) {
            this._rigidBodies.push(threeObj);

            // 防止物体弹力过快消失
            // Ammo.DISABLE_DEACTIVATION = 4
            body.setActivationState(4);
        }

        this._physicsWorld.addRigidBody(body);

        return body;
    }

    /**
     * 根据three中mesh类型生成刚体
     * 1. 这里的简单的box，sphere可以根据其本身的height、radius等计算出刚体的形状
     * 2. 对于复杂的物体来说，就要传入点阵，或者高度阵（不同引擎库不同，connon.js是用的triMesh可以生成复杂的地面刚体）
     *
     * @param {THREE.Mesh} threeObj
     * @param {string} type
     * @param {number} mass
     */
    addSimpleObj(threeObj, type, mass) {
        let shape = null;
        let params = null;

        switch (type) {
            case 'box':
                params = threeObj.geometry.parameters;
                shape = new Ammo.btBoxShape(new Ammo.btVector3(params.width * 0.5, params.height * 0.5, params.depth * 0.5));
                break;
            case 'sphere':
                params = threeObj.geometry.parameters.radius;
                shape = new Ammo.btSphereShape(params);
                break;
        }

        shape.setMargin(margin);

        this._createRigidBody(threeObj, shape, mass);

        return threeObj;
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