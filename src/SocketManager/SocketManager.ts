import { BehaviorSubject } from 'rxjs';

export class SocketManager {

    open: boolean = false
    spawn$ = new BehaviorSubject({})
    movement$ = new BehaviorSubject({})
    attack$ = new BehaviorSubject({})
    event$ = new BehaviorSubject({})

    socket: WebSocket

    constructor() {
        this.open = false;

        this.spawn$ = new BehaviorSubject({})
        this.movement$ = new BehaviorSubject({})
        this.attack$ = new BehaviorSubject({})
        this.event$ = new BehaviorSubject({})

        this.socket = new WebSocket("ws://localhost:8000", "arraybuffer")
        
        this.socket.onopen = (e:any) => {
            console.log("Socket Open")
            this.open = true
        };  
        this.socket.onmessage = (e:any) => {
            this.dispSocketMessage(e.data)
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
    dispSocketMessage(e:any) {
        var messageArray = e.split("|")
        switch (messageArray[0]) {
            case 'SPAWN':
                var name = messageArray[1]
                var posArray = messageArray[2].split(',')
                this.spawn$.next(posArray)
                break;
            case 'MOVEMENT':
                //console.log("Spawn player at: " + messageArray[1])
                this.movement$.next("Movement")
                break;
            case 'ATTACK':
                //console.log("Random event at: " + messageArray[1])
                this.attack$.next("Attack")
                break;
            case 'EVENT':
                //console.log("Random event at: " + messageArray[1])
                this.event$.next("Event")
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