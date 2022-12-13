import * as THREE from 'three'
import { InputManager } from '../InputManager/InputManager'
import { EventPacket, MovementPacket, SocketManager, SpawnPacket } from '../SocketManager/SocketManager'
import { HTMLElementManager } from '../HTMLElementManager/HTMLElementManager'
import { Player } from '../Entity/Player/Player'
import { Clock, Light, Renderer, Scene } from 'three'
import { Entity } from '../Entity/Entity'

const NUMBER_OF_TILES = 10

export class GameManager {

    canvas: HTMLCanvasElement | null

    iM: InputManager
    sM: SocketManager

    htmlM: HTMLElementManager

    renderer: Renderer = new THREE.WebGLRenderer
    clock: Clock = new THREE.Clock
    
    scene: Scene
    grid: any[] = []
    lights: Light[] = []
    
    timeLastSentGameState: number = 0
    serverSendInterval: number = 0

    player: Player | null
    entities: (Entity | Player)[] = []

    constructor() {
        this.player = null

        // Managers
        this.iM = new InputManager()
        this.sM = new SocketManager()
        this.htmlM = new HTMLElementManager()

        //ThreeJS Objects
        this.scene = new THREE.Scene()
        this.canvas = document.querySelector('.webgl')

        if (this.canvas) this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
        var sizes = { width: window.innerWidth, height: window.innerHeight }
        this.renderer.setSize(sizes.width, sizes.height)

        //this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Time
        this.clock = new THREE.Clock()
        this.timeLastSentGameState = 0
        this.serverSendInterval = 0.3
        
        this.drawGrid()
        this.tick()

        //Subscribe to Socket Events
        this.sM.spawn$.subscribe((sP: SpawnPacket | null) => {
            if (sP != null) {
                this.player = new Player(sP)
                this.entities.push(this.player)
            }
        })
        this.sM.event$.subscribe((eP: EventPacket | null) => {
            if (eP != null) {this.handleSpawnPacket(eP) }
        })
        this.sM.movement$.subscribe((mP: MovementPacket | null) => {
            if (mP != null) {this.handleMovementPacket(mP) }
        })
    }

    tick() {
        if (this.sM.open) {
            // Time
            const elapsedTime = this.clock.getElapsedTime()

            if (this.player != null) {

                // Take user inputs and update position
                if (this.iM.w) { this.player.moveForward() }
                if (this.iM.s) { this.player.moveBackward() }
                if (this.iM.d) { this.player.moveRight() }
                if (this.iM.a) { this.player.moveLeft() }

                // Send Gamestate to Server
                if (elapsedTime > this.timeLastSentGameState + this.serverSendInterval) {
                    this.sM.send(this.player.serializePosition())
                    this.timeLastSentGameState = elapsedTime
                }

                // Update gamestate from server messages
                this.entities.forEach((entity: Entity)=>{

                })

                // Render
                this.renderer.render(this.scene, this.player.camera)
            }
        }
        // Call tick again on the next frame
        window.requestAnimationFrame(() => { this.tick() })
    }

    //DRAW SAMPLE WORLD
    drawGrid() {
        // Grid Squares
        for (let x = -NUMBER_OF_TILES; x < NUMBER_OF_TILES; x++) {
            for (let z = -NUMBER_OF_TILES; z < NUMBER_OF_TILES; z++) {
                var planeGeometry = new THREE.BoxGeometry(10, 1, 10)
                const planeMaterial = new THREE.MeshLambertMaterial()
                if ((x+z) % 2 == 0) {
                    planeMaterial.color = new THREE.Color(0x225555)
                } else {
                    planeMaterial.color = new THREE.Color(0x1aacc)
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

        const ambLight = new THREE.AmbientLight(0xffffff, 0.1)
        ambLight.position.x = 0
        ambLight.position.y = 5
        ambLight.position.z = 0
        ambLight.intensity = 0.1
        this.lights.push(ambLight)

        this.scene.add(...this.lights)
    }

    //TESTER SOCKET
    handleSpawnPacket(eP: EventPacket) {
        this.scene.add(this.createInertGeometry(eP.x, eP.y, eP.z))
    }

    handleMovementPacket(mP: MovementPacket) {        
        var entityFound = false
        this.entities.forEach((entity: Entity | Player)=>{
            //find associated entity and update pos
            if (entity.uuid == mP.id) {
                entity.updatePosition(mP)
                entityFound = true
            }
        })
        if (!entityFound) {
            //spawn entity
            var tempEntity = new Entity(mP)
            this.entities.push(tempEntity);
            this.scene.add(tempEntity.mesh)
        }
    }

    createInertGeometry(x: number, y: number, z: number): THREE.Mesh {
        var testGeo = new THREE.TorusGeometry(1, 1)
        const testMat = new THREE.MeshLambertMaterial()
        var testMesh = new THREE.Mesh(testGeo, testMat)
        testMesh.position.x = x
        testMesh.position.y = z
        testMesh.position.z = z
        return testMesh
    }
}