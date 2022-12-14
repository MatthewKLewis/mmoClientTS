import { Color, Material, Mesh, MeshLambertMaterial, SphereGeometry } from "three";
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
        this.geo = new SphereGeometry(2)
        this.material = new MeshLambertMaterial({color: new Color(0xff0000)})
        this.mesh = new Mesh(this.geo, this.material)
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