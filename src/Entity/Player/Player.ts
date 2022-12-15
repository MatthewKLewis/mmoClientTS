import { Camera, Color, Material, Mesh, MeshLambertMaterial, PerspectiveCamera, SphereGeometry, TorusGeometry } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { MovementPacket, SpawnPacket } from '../../SocketManager/SocketManager';

const PLAYER_SPEED = 0.3

export class Player {
    name: string = "ERROR"
    uuid: string = "ERROR"

    health: number = 100

    geo: TorusGeometry
    material: Material
    mesh: Mesh
    
    camera: Camera
    controls: PointerLockControls

    constructor(sP: SpawnPacket) {
        // CHECK PACKET
        //console.log(spawnPacket)

        // DETAILS
        this.name = sP.playerName
        this.uuid = sP.uuid

        // CAMERA
        var sizes = {width: window.innerWidth, height: window.innerHeight}
        this.camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 300)
        this.camera.position.x = Number(sP.x)
        this.camera.position.y = Number(sP.y)
        this.camera.position.z = Number(sP.z)
        this.camera.rotation.y = Math.PI
        // this.camera.aspect = sizes.width / sizes.height
        // this.camera.updateProjectionMatrix()

        // MODEL
        this.geo = new TorusGeometry(1, 0.5, 6, 6)
        this.material = new MeshLambertMaterial({color: new Color(0xff0000)})
        this.mesh = new Mesh(this.geo, this.material)
        this.mesh.uuid = sP.uuid
        this.mesh.position.x = Number(sP.x)
        this.mesh.position.y = Number(sP.y)
        this.mesh.position.z = Number(sP.z)

        // CONTROLS
        this.controls = new PointerLockControls(this.camera, document.body);

        // CANVAS
        var canvasElement = document.querySelector('#webgl')
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
            uuid: this.uuid,
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z,
            rotY: this.camera.rotation.y
        }
        return "MOVEMENT|" + tempPos.uuid +"|"+ tempPos.x +","+ tempPos.y +","+ tempPos.z +","+ tempPos.rotY
    }

    updatePosition(mP: MovementPacket) {
        return;
    }
}