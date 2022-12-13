import * as THREE from 'three'
import { Camera, Material, Mesh, SphereGeometry } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { SpawnPacket } from '../SocketManager/SocketManager';

const PLAYER_SPEED = 0.3

export class Player {

    name: string = "ERROR"

    x: number = 0;
    y: number = 0;
    z: number = 0;

    camera: Camera
    geo: SphereGeometry
    material: Material
    model: Mesh
    controls: PointerLockControls

    constructor(spawnPacket: SpawnPacket) {
        // DETAILS
        this.name = spawnPacket.playerName

        // CAMERA
        var sizes = {width: window.innerWidth, height: window.innerHeight}
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        this.camera.position.x = Number(spawnPacket.x)
        this.camera.position.y = Number(spawnPacket.y)
        this.camera.position.z = Number(spawnPacket.z)
        this.camera.rotation.y = Math.PI
        // this.camera.aspect = sizes.width / sizes.height
        // this.camera.updateProjectionMatrix()

        // MODEL
        this.geo = new THREE.SphereGeometry(2)
        this.material = new THREE.MeshLambertMaterial({color: new THREE.Color(0xff0000)})
        this.model = new THREE.Mesh(this.geo, this.material)
        this.model.position.x = Number(spawnPacket.x)
        this.model.position.y = Number(spawnPacket.y)
        this.model.position.z = Number(spawnPacket.z)

        // CONTROLS
        this.controls = new PointerLockControls(this.camera, document.body);

        // CANVAS
        var canvasElement = document.querySelector('.webgl')
        canvasElement && canvasElement.addEventListener('click', () => {this.controls.lock()})
    }

    moveForward() {
        this.controls.moveForward(PLAYER_SPEED)
        this.model.position.x = this.camera.position.x
        this.model.position.y = this.camera.position.y
        this.model.position.z = this.camera.position.z
    }

    moveBackward() {
        this.controls.moveForward(-PLAYER_SPEED)
        this.model.position.x = this.camera.position.x
        this.model.position.y = this.camera.position.y
        this.model.position.z = this.camera.position.z
    }

    moveRight() {
        this.controls.moveRight(PLAYER_SPEED)
        this.model.position.x = this.camera.position.x
        this.model.position.y = this.camera.position.y
        this.model.position.z = this.camera.position.z
    }
    moveLeft() {
        this.controls.moveRight(-PLAYER_SPEED)
        this.model.position.x = this.camera.position.x
        this.model.position.y = this.camera.position.y
        this.model.position.z = this.camera.position.z
    }
}