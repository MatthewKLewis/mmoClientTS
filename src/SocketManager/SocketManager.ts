import { BehaviorSubject } from 'rxjs';

export interface EventPacket {
    id: string
    x: number
    y: number
    z: number
    description: string
}

export interface SpawnPacket {
    id: string
    playerName: string
    x: number
    y: number
    z: number
}

export interface MovementPacket {
    id: string
    x: number
    y: number
    z: number
}

export interface AttackPacket {
    id: string
    description: string
}

export class SocketManager {

    open: boolean = false
    spawn$ = new BehaviorSubject<SpawnPacket | null>(null)
    movement$ = new BehaviorSubject<MovementPacket | null>(null)
    attack$ = new BehaviorSubject<AttackPacket | null>(null)
    event$ = new BehaviorSubject<EventPacket | null>(null)

    socket: WebSocket

    constructor() {
        this.open = false;

        this.socket = new WebSocket("ws://localhost:8000", "arraybuffer")
        
        this.socket.onopen = (e:any) => {
            console.log("Socket Open")
            this.open = true
        };  
        this.socket.onmessage = (e: MessageEvent) => {
            if (e.data) {
                this.dispSocketMessage(e)
            } else {
                console.log("PACKET WITHOUT DATA")
            }
        };
        this.socket.onerror = (e:any) => {
            console.log("ERROR")
            console.log(e)
        };
        this.socket.onclose = (e:any) => {
            console.log("CLOSED!")
            this.open = false
            if (e.wasClean) {
                //console.log(e)
            } else {
                //console.log(e)
            }
        };
        console.log("Socket Manager Built")
    }

    //Takes the raw mesage and formats a queue-bound object out of it.
    dispSocketMessage(e: MessageEvent) {
        var messageArray = e.data.split("|")
        var messageHeader = messageArray[0]

        switch (messageHeader) {
            case 'SPAWN':
                var name = messageArray[1]
                var coords = messageArray[2].split(',')
                var tempSpawn: SpawnPacket = {
                    id: "1",
                    playerName: name,
                    x: Number(coords[0]),
                    y: Number(coords[1]),
                    z: Number(coords[2]),
                }
                this.spawn$.next(tempSpawn)
                break;
            case 'MOVEMENT':
                console.log(messageArray)
                //this.movement$.next("Movement")
                break;
            case 'ATTACK':
                console.log(messageArray)
                //this.attack$.next("Attack")
                break;
            case 'EVENT':
                var coords = messageArray[1].split(',')
                var tempEvent: EventPacket = {
                    id: "1",
                    x: Number(coords[0]),
                    y: Number(coords[1]),
                    z: Number(coords[2]),
                    description: "Hello",
                }
                this.event$.next(tempEvent)
                break;
            default:
                console.log("Error parsing packet: " + messageArray[0])
                break;
        }
    }

    send(data:any) {
        this.socket.send(data)
    }
}