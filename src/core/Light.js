import { AmbientLight, DirectionalLight, Vector3 } from 'three';

class Light {
    constructor(scene, dirLightConfig) {
        let color = 0xffffff;
        let intensity = 1;

        this.ambientLight = new AmbientLight(color, intensity);
        scene.add(this.ambientLight);

        // set directional light params
        let pos = new Vector3(0, 20, 0);
        let targetPos = new Vector3(0, 0, 0);
        if (dirLightConfig) {
            pos.copy(dirLightConfig.pos);
            targetPos.copy(dirLightConfig.targetPos);
        }

        this.directionalLight = this._createDirectionalLight(color, intensity, pos, targetPos);
        scene.add(this.directionalLight);
        scene.add(this.directionalLight.target);
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
        tmpLight.shadow.camera.far = 200;
        tmpLight.shadow.camera.near = 1;
        tmpLight.shadow.camera.left = -200 * shadowSize;
        tmpLight.shadow.camera.right = 200 * shadowSize;
        tmpLight.shadow.camera.bottom = -200 * shadowSize;
        tmpLight.shadow.camera.top = 200 * shadowSize;
        tmpLight.shadow.mapSize.width = 2048;
        tmpLight.shadow.mapSize.height = 2048;

        tmpLight.name = 'directionalLight';

        return tmpLight;
    }
}

export { Light };