import { Material, Mesh, SphereGeometry } from "three";
import THREE = require("three");
import { MovementPacket } from "../SocketManager/SocketManager";

export class Entity {
    name: string = "ERROR"
    uuid: string = "ERROR"

    geo: SphereGeometry
    material: Material
    mesh: Mesh

    constructor(mP: MovementPacket) {
        // DETAILS
        this.name = "???"
        this.uuid = mP.id

        // MESH
        this.geo = new THREE.SphereGeometry(2)
        this.material = new THREE.MeshLambertMaterial({color: new THREE.Color(0xff0000)})
        this.mesh = new THREE.Mesh(this.geo, this.material)
        this.mesh.position.x = Number(mP.x)
        this.mesh.position.y = Number(mP.y)
        this.mesh.position.z = Number(mP.z)
    }

    updatePosition(mP: MovementPacket) {
        this.mesh.position.x = mP.x
        this.mesh.position.y = mP.y
        this.mesh.position.z = mP.z
        this.mesh.rotation.y = mP.rotY
    }
}