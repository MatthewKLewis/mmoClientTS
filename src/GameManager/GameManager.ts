import * as THREE from 'three'
import { InputManager } from '../InputManager/InputManager'
import { SocketManager } from '../SocketManager/SocketManager'
import { WorldManager } from '../WorldManager/WorldManager'
import { HTMLElementManager } from '../HTMLElementManager/HTMLElementManager'
import { Player } from '../Player/Player'
import { Clock, Renderer, Scene } from 'three'

export class GameManager {

    canvas: HTMLCanvasElement | null

    iM: InputManager
    sM: SocketManager
    wM: WorldManager
    htmlM: HTMLElementManager
    
    scene: Scene
    renderer: Renderer = new THREE.WebGLRenderer
    clock: Clock = new THREE.Clock
    
    timeLastSentGameState: number = 0
    serverSendInterval: number = 0

    player: Player | null

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

        //Scene
        this.wM = new WorldManager(this.scene)

        // Time
        this.clock = new THREE.Clock()
        this.timeLastSentGameState = 0
        this.serverSendInterval = 0.3
        this.tick()

        //Subscribe to Socket Events
        this.sM.spawn$.subscribe((e:any) => {
            console.log(e)
            this.player = new Player(e[0], e[1], e[2])
        })
        this.sM.movement$.subscribe((e:any) => {
            if (e) {
                //console.log(e);
            }
        })
        this.sM.attack$.subscribe((e:any) => {
            if (e) {
                //console.log(e);
            }
        })
        this.sM.event$.subscribe((e:any) => {
            if (e) {
                //console.log(e);
            }
        })
    }

    tick() {
        if (this.sM.open) {
            // Time
            const elapsedTime = this.clock.getElapsedTime()

            // Take user inputs and update position
            if (this.player != null) {
                if (this.iM.w) { this.player.moveForward() }
                if (this.iM.s) { this.player.moveBackward() }
                if (this.iM.d) { this.player.moveRight() }
                if (this.iM.a) { this.player.moveLeft() }

                // Send Gamestate to Server
                if (elapsedTime > this.timeLastSentGameState + this.serverSendInterval) {
                    this.sM.send(`${this.player.camera.position.x},
                        ${this.player.camera.position.y},
                        ${this.player.camera.position.z},
                        ${this.player.camera.rotation.y}`
                    )
                    this.timeLastSentGameState = elapsedTime
                }
                // Update gamestate from server messages

                // Render
                this.renderer.render(this.scene, this.player.camera)
            }
        }
        // Call tick again on the next frame
        window.requestAnimationFrame(() => { this.tick() })
    }
}