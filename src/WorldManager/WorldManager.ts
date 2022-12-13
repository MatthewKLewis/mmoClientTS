import * as THREE from 'three'
import { Light, Scene } from 'three'

const NUMBER_OF_TILES = 10

export class WorldManager {

    scene: Scene
    grid: any[] = []
    lights: Light[]

    constructor(scene: Scene) {
        this.scene = scene
        this.grid = []
        this.lights = []
        this.drawGrid()
        console.log("World Manager Built")
    }

    drawGrid() {
        // Grid Squares
        for (let x = 0; x < NUMBER_OF_TILES; x++) {
            for (let z = 0; z < NUMBER_OF_TILES; z++) {
                var planeGeometry = new THREE.BoxGeometry(10, 1, 10)
                const planeMaterial = new THREE.MeshLambertMaterial()
                if ((x+z) % 2 == 0) {
                    planeMaterial.color = new THREE.Color(0xff5533)
                } else {
                    planeMaterial.color = new THREE.Color(0x55ff33)
                }
                var plane = new THREE.Mesh(planeGeometry, planeMaterial)
                plane.position.x = x * 10
                plane.position.z = z * 10
                this.grid.push(plane)
            }
        }
        this.scene.add(...this.grid)

        // Lights
        for (let x = 0; x < 10; x++) {
            for (let z = 0; z < 10; z++) {
                const pointLight = new THREE.PointLight(0xffffff, 0.1)
                pointLight.position.x = x*10
                pointLight.position.y = 5
                pointLight.position.z = z*10
                pointLight.intensity = 0.03
                this.lights.push(pointLight)
            }
        }
        this.scene.add(...this.lights)
    }
}