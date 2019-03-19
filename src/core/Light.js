import { AmbientLight, DirectionalLight, Vector3, SpotLight } from 'three';

class Light {
    constructor(scene, dirLightConfig) {
        let color = 0x404040;
        let intensity = 1;

        this.ambientLight = new AmbientLight(color, intensity);
        scene.add(this.ambientLight);

        // set directional light params
        let pos = new Vector3(20, 20, 0);
        let targetPos = new Vector3(0, 0, 0);
        if (dirLightConfig) {
            pos.copy(dirLightConfig.pos);
            targetPos.copy(dirLightConfig.targetPos);
        }

        this.directionalLight = this._createDirectionalLight(0xffffff, 1, pos, targetPos);
        scene.add(this.directionalLight);
        scene.add(this.directionalLight.target);

        // let soptLight = this._createSpotLight(0xffffff, intensity, new Vector3(0, 40, 0), targetPos);
        // scene.add(soptLight);
        // scene.add(soptLight.target);
    }


    /**
     * initialize directional light
     * @param {0x} color
     * @param {number} intensity
     * @param {THREE.Vector3} pos
     * @param {THREE.Vector3} targetPos
     * @param {number} shadowSize
     */
    _createDirectionalLight(color, intensity, pos, targetPos, shadowSize = 1) {
        let tmpLight = new DirectionalLight(color, intensity);

        tmpLight.castShadow = true;
        tmpLight.position.copy(pos);
        tmpLight.target.position.copy(targetPos);

        // Set up shadow properties for the light
        tmpLight.shadow.camera.far = 100;
        tmpLight.shadow.camera.near = 1;
        tmpLight.shadow.camera.left = -100 * shadowSize;
        tmpLight.shadow.camera.right = 100 * shadowSize;
        tmpLight.shadow.camera.bottom = -100 * shadowSize;
        tmpLight.shadow.camera.top = 100 * shadowSize;
        tmpLight.shadow.mapSize.width = 2048;
        tmpLight.shadow.mapSize.height = 2048;

        tmpLight.name = 'directionalLight';

        return tmpLight;
    }

    _createSpotLight(color, intensity, pos, targetPos) {
        let spotLight = new SpotLight(color, intensity);
        spotLight.position.copy(pos);
        spotLight.target.position.copy(targetPos);

        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.05;
        spotLight.decay = 2;
        spotLight.distance = 200;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 200;

        return spotLight;
    }
}

export { Light };