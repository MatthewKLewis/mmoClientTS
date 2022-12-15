export function returnColorFromInt(index: number): string {
    if (index < 0) index *= -1
    index = index % 10
    switch (index) {
        case 1: return 'green'
        case 2: return 'red'
        case 3: return 'blue'
        case 4: return 'yellow'
        case 5: return 'magenta'
        case 6: return 'purple'
        case 7: return 'black'
        case 8: return 'white'
        case 9: return 'orange'
        default: return 'white'
    }
}