import { AmbientLight, BoxGeometry, Clock, Color, Light, Mesh, MeshLambertMaterial, PointLight, Renderer, Scene, WebGLRenderer } from 'three'
import { InputManager } from '../InputManager/InputManager'
import { DisconnectPacket, EventPacket, MovementPacket, SocketManager, SpawnPacket } from '../SocketManager/SocketManager'
import { HTMLElementManager } from '../HTMLElementManager/HTMLElementManager'
import { Player } from '../Entity/Player/Player'
import { Entity } from '../Entity/Entity'
import { returnColorFromInt } from '../Utility/ColorUtility'
import { OBJManager } from '../Utility/OBJManager'

const NUMBER_OF_TILES = 10

export class GameManager {

    canvas: HTMLCanvasElement | null

    iM: InputManager
    sM: SocketManager

    objM: OBJManager
    htmlM: HTMLElementManager

    renderer: Renderer = new WebGLRenderer
    clock: Clock = new Clock
    
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
        this.objM = new OBJManager()

        //ThreeJS Objects
        this.scene = new Scene()
        this.canvas = document.querySelector('#webgl')

        if (this.canvas) this.renderer = new WebGLRenderer({ canvas: this.canvas })
        var sizes = { width: window.innerWidth, height: window.innerHeight }
        this.renderer.setSize(sizes.width, sizes.height)

        //this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Time
        this.clock = new Clock()
        this.timeLastSentGameState = 0
        this.serverSendInterval = 0.1
        
        this.drawGrid()
        this.tick()

        //Subscribe to Socket Game Events
        this.sM.spawn$.subscribe((sP: SpawnPacket | null) => {
            if (sP != null) { this.handleSpawnPacket(sP) }
        })
        this.sM.event$.subscribe((eP: EventPacket | null) => {
            if (eP != null) {this.handleEventPacket(eP) }
        })
        this.sM.movement$.subscribe((mP: MovementPacket | null) => {
            if (mP != null) {this.handleMovementPacket(mP) }
        })
        this.sM.disconnect$.subscribe((dP: DisconnectPacket | null) => {
            if (dP != null) {this.handleDisconnectPacket(dP)}
        })

        //Subscribe to Socket Error Events
        this.sM.error$.subscribe((error: any)=>{
            if (error) {
                console.log(error)
                this.htmlM.showHideLoader(true);
            }
        })
        this.sM.close$.subscribe((isClosed: boolean)=>{
            if (isClosed) {
                console.log("Socket is CLosed!")
                this.htmlM.showHideLoader(true);
            }
        })
    }

    tick() {
        if (this.sM.open) {
            // CHECK TIME
            const elapsedTime = this.clock.getElapsedTime()

            if (this.player != null) {

                // CONTROLLER - Take user inputs and update position
                if (this.iM.w) { this.player.moveForward() }
                if (this.iM.s) { this.player.moveBackward() }
                if (this.iM.d) { this.player.moveRight() }
                if (this.iM.a) { this.player.moveLeft() }

                // MODEL COMMS - Send Player State to Server
                if (elapsedTime > this.timeLastSentGameState + this.serverSendInterval) {
                    this.sM.send(this.player.serializePosition())
                    this.timeLastSentGameState = elapsedTime
                }

                // VIEW UI
                this.htmlM.update(
                    this.player.name, 
                    this.player.uuid, 
                    this.player.health, 
                    this.player.mesh.position.x, 
                    this.player.mesh.position.y, 
                    this.player.mesh.position.z
                )

                // VIEW 3D
                this.renderer.render(this.scene, this.player.camera)
            }
        }
        window.requestAnimationFrame(() => { this.tick() })
    }

    //DRAW SAMPLE WORLD
    drawGrid() {
        // Grid Squares
        for (let x = -NUMBER_OF_TILES; x < NUMBER_OF_TILES; x++) {
            for (let z = -NUMBER_OF_TILES; z < NUMBER_OF_TILES; z++) {
                var planeGeometry = new BoxGeometry(10, 1, 10)
                const planeMaterial = new MeshLambertMaterial()
                planeMaterial.color = new Color(returnColorFromInt(x+z))
                var plane = new Mesh(planeGeometry, planeMaterial)
                plane.position.x = x * 10
                plane.position.z = z * 10
                this.grid.push(plane)
            }
        }
        this.scene.add(...this.grid)

        // Lights
        for (let x = 0; x < 10; x++) {
            for (let z = 0; z < 10; z++) {
                const pointLight = new PointLight(0xffffff, 0.1)
                pointLight.position.x = x*10
                pointLight.position.y = 5
                pointLight.position.z = z*10
                pointLight.intensity = 0.03
                this.lights.push(pointLight)
            }
        }

        const ambLight = new AmbientLight(0xffffff, 0.1)
        ambLight.position.x = 0
        ambLight.position.y = 5
        ambLight.position.z = 0
        ambLight.intensity = 0.1
        this.lights.push(ambLight)

        this.scene.add(...this.lights)
    }


    // ASYNC RESPONSES TO SOCKET EVENTS
    handleSpawnPacket(sP: SpawnPacket) {
        console.log("SPAWN PACKET")
        this.htmlM.showHideLoader(false)
        this.player = new Player(sP)
        this.entities.push(this.player)
    }

    handleMovementPacket(mP: MovementPacket) {
        var entityFound = false
        this.entities.forEach((entity: Entity | Player)=>{
            //find associated entity and update pos
            if (entity.uuid == mP.uuid) {
                entity.updatePosition(mP)
                entityFound = true
            }
        })
        if (!entityFound) {
            //spawn entity
            console.log("SPAWNING from MOVEMENT:" + mP.uuid)
            var tempEntity = new Entity(mP)
            this.entities.push(tempEntity);
            this.scene.add(tempEntity.mesh)
        }
    }

    handleDisconnectPacket(dP: DisconnectPacket) {
        console.log(dP)
        console.log("REMOVING:" + dP.uuid)
        var objToRemove = this.scene.getObjectByProperty('uuid', dP.uuid)
        if (objToRemove) {
            //this.entities = this.entities.splice(entityIndex, 1);
            objToRemove && this.scene.remove(objToRemove)
            console.log("REMOVED")
        }
    }

    handleEventPacket(eP: EventPacket) {
        //do nothing
    }

}