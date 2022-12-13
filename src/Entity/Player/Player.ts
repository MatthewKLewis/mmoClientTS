import * as THREE from 'three'
import { Camera, Material, Mesh, SphereGeometry } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { MovementPacket, SpawnPacket } from '../../SocketManager/SocketManager';

const PLAYER_SPEED = 0.3

export class Player {
    name: string = "ERROR"
    uuid: string = "ERROR"

    geo: SphereGeometry
    material: Material
    mesh: Mesh
    
    camera: Camera
    controls: PointerLockControls

    constructor(spawnPacket: SpawnPacket) {
        // CHECK PACKET
        //console.log(spawnPacket)

        // DETAILS
        this.name = spawnPacket.playerName
        this.uuid = spawnPacket.id

        // CAMERA
        var sizes = {width: window.innerWidth, height: window.innerHeight}
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 300)
        this.camera.position.x = Number(spawnPacket.x)
        this.camera.position.y = Number(spawnPacket.y)
        this.camera.position.z = Number(spawnPacket.z)
        this.camera.rotation.y = Math.PI
        // this.camera.aspect = sizes.width / sizes.height
        // this.camera.updateProjectionMatrix()

        // MODEL
        this.geo = new THREE.SphereGeometry(2)
        this.material = new THREE.MeshLambertMaterial({color: new THREE.Color(0xff0000)})
        this.mesh = new THREE.Mesh(this.geo, this.material)
        this.mesh.position.x = Number(spawnPacket.x)
        this.mesh.position.y = Number(spawnPacket.y)
        this.mesh.position.z = Number(spawnPacket.z)

        // CONTROLS
        this.controls = new PointerLockControls(this.camera, document.body);

        // CANVAS
        var canvasElement = document.querySelector('.webgl')
        canvasElement && canvasElement.addEventListener('click', () => {this.controls.lock()})
    }

    moveForward() {
        this.controls.moveForward(PLAYER_SPEED)
        this.mesh.position.x = this.camera.position.x
        this.mesh.position.y = this.camera.position.y
        this.mesh.position.z = this.camera.position.z
    }

    moveBackward() {
        this.controls.moveForward(-PLAYER_SPEED)
        this.mesh.position.x = this.camera.position.x
        this.mesh.position.y = this.camera.position.y
        this.mesh.position.z = this.camera.position.z
    }

    moveRight() {
        this.controls.moveRight(PLAYER_SPEED)
        this.mesh.position.x = this.camera.position.x
        this.mesh.position.y = this.camera.position.y
        this.mesh.position.z = this.camera.position.z
    }
    moveLeft() {
        this.controls.moveRight(-PLAYER_SPEED)
        this.mesh.position.x = this.camera.position.x
        this.mesh.position.y = this.camera.position.y
        this.mesh.position.z = this.camera.position.z
    }

    serializePosition(): string {
        var tempPos: MovementPacket = {
            id: this.uuid,
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z,
            rotY: this.camera.rotation.y
        }
        return "MOVEMENT|" + tempPos.id +"|"+ tempPos.x +","+ tempPos.y +","+ tempPos.z +","+ tempPos.rotY
    }

    updatePosition(mP: MovementPacket) {
        return;
    }
}