export class InputManager {

    w: boolean = false;
    a: boolean = false;
    s: boolean = false;
    d: boolean = false;

    constructor() {
        this.w = false;
        this.a = false;
        this.s = false;
        this.d = false;
        document.addEventListener('click', (key)=>{this.click(key)})
        document.addEventListener('keydown', (key)=>{this.keyDown(key)})
        document.addEventListener('keyup', (key)=>{this.keyUp(key)})
        console.log("Input Manager Built")
    }

    keyDown(e:any) {
        switch (e.key) {
            case 'w':
                this.w = true
                break;
            case 'a':
                this.a = true
                break;
            case 's':
                this.s = true
                break;
            case 'd':
                this.d = true
                break;
        }
    }
    
    keyUp(e:any)   { 
        switch (e.key) {
            case 'w':
                this.w = false
                break;
            case 'a':
                this.a = false
                break;
            case 's':
                this.s = false
                break;
            case 'd':
                this.d = false
                break;
        }
    }

    click(e:any) {
        //console.log(e)
        console.log("click")
    }
}