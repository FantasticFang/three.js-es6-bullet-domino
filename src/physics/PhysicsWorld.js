class PhysicsWorld {
    constructor() {
        this.physicsWorld = {};

        this.rigidBodies = []; // put meshs into physics world

        this.transformAux1 = new Ammo.btTransform();
    }

    initPhysics() {
        // bullet config
        // /* eslint-disable */
        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        let dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        let broadphase = new Ammo.btDbvtBroadphase();
        let solver = new Ammo.btSequentialImpulseConstraintSolver();
        let gravityConstant = -9.8;

        this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
        this.physicsWorld.setGravity(new Ammo.btVector3(0, gravityConstant, 0));
    }

    update(deltaTime) {
        this.physicsWorld.stepSimulation(deltaTime, 10);

        // update rigidBodies
        for (let i = 0, iL = this.rigidBodies.length; i < iL; i++) {
            let objThree = this.rigidBodies[i];
            let objPhys = objThree.userData.physicsBody;

            let ms = objPhys.getMotionState();
            if (ms) {
                ms.getWorldTransform(this.transformAux1);
                let p = this.transformAux1.getOrigin();
                let q = this.transformAux1.getRotation();
                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }
}

export { PhysicsWorld };