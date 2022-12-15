import { BehaviorSubject } from 'rxjs';

export interface EventPacket {
    uuid: string
    x: number
    y: number
    z: number
    description: string
}

export interface SpawnPacket {
    uuid: string
    playerName: string
    x: number
    y: number
    z: number
}

export interface MovementPacket {
    uuid: string
    x: number
    y: number
    z: number
    rotY: number
}

export interface AttackPacket {
    uuid: string
    description: string
}

export interface DisconnectPacket {
    uuid: string
}

export class SocketManager {
    open: boolean = false

    error$ = new BehaviorSubject<any>(null)
    close$ = new BehaviorSubject<boolean>(false)

    disconnect$ = new BehaviorSubject<DisconnectPacket | null>(null)
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
                this.handleSocketMessage(e)
            } else {
                console.log("PACKET WITHOUT DATA")
            }
        };
        this.socket.onerror = (e:any) => {
            this.error$.next(e)
        };
        this.socket.onclose = (e:any) => {
            this.open = false
            this.close$.next(true)
        };
        console.log("Socket Manager Built")
    }

    //Takes the raw mesage and formats a queue-bound object out of it.
    handleSocketMessage(e: MessageEvent) {
        var messageArray = e.data.split("|")
        var messageHeader = messageArray[0]

        switch (messageHeader) {
            case 'SPAWN':
                var uuid = messageArray[1]
                var name = messageArray[2]
                var coords = messageArray[3].split(',')
                
                var tempSpawn: SpawnPacket = {
                    uuid: uuid,
                    playerName: name,
                    x: Number(coords[0]),
                    y: Number(coords[1]),
                    z: Number(coords[2]),
                }
                this.spawn$.next(tempSpawn)
                break;
            case 'MOVEMENT':
                var uuid = messageArray[1]
                var coords = messageArray[2].split(',')

                var tempMove: MovementPacket = {
                    uuid: uuid,
                    x: Number(coords[0]),
                    y: Number(coords[1]),
                    z: Number(coords[2]),
                    rotY: Number(coords[3])
                }
                this.movement$.next(tempMove)
                break;
            case 'ATTACK':
                console.log(messageArray)
                //this.attack$.next("Attack")
                break;
            case 'EVENT':
                var uuid = messageArray[1]
                var coords = messageArray[2].split(',')
                var desc = messageArray[3]

                var tempEvent: EventPacket = {
                    uuid: uuid,
                    x: Number(coords[0]),
                    y: Number(coords[1]),
                    z: Number(coords[2]),
                    description: desc,
                }
                this.event$.next(tempEvent)
                break;
            case 'DISCONNECT':
                var uuid = messageArray[1]

                var tempDcon: DisconnectPacket = {
                    uuid: uuid
                }
                this.disconnect$.next(tempDcon)
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