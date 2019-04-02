import { range, BehaviorSubject } from 'rxjs';

export const random = (inicio, final, step) => {
    const r = Math.floor(Math.random() * final) + inicio;
    return r % step === 0 ? r : random(inicio, final, step);
};

export const squarehit = (cuno, cdos) => cuno.x == cdos.x && cuno.y == cdos.y;

export const size =(a: number, b: number) => (b === 0) ? a : size(b, a % b);

export const hit = (a, b) => {
    let hit = false;
    b.x + b.width >= a.x && b.x < a.x + a.width ?
        b.y + b.height >= a.y && b.y < a.y + a.height ? hit = true
            : false
        : false;

    b.x <= a.x && b.x + b.width >= a.x + a.width ?
        b.y <= a.y && b.y + b.height >= a.y + a.height ? hit = true
            : false
        : false;

    a.x <= b.x && a.x + a.width >= b.x + b.width ?
        a.y <= b.y && a.y + a.height >= b.y + b.height ? hit = true
            : false
        : false;
    return hit
}

export class Draw {
    width: number;
    height: number;

    constructor(public ctx: CanvasRenderingContext2D) {
        this.getSize();

    }
    getSize() {
        const _size = size(this.ctx.canvas.offsetWidth, this.ctx.canvas.offsetHeight);
        this.width = _size;
        this.height = _size;
    }

}

export class Food extends Draw {
    constructor(public x: number, public y: number, public ctx: CanvasRenderingContext2D) {
        super(ctx);
    }

    static generate(ctx: CanvasRenderingContext2D, size) {
        return new Food(random(0, ctx.canvas.width - size, size), random(0, ctx.canvas.height - size, size), ctx);
    }

    draw(imgFood) {
        this.getSize();
        this.ctx.drawImage(imgFood, this.x, this.y, this.width, this.height)
    }
}

export class Square extends Draw {
    constructor(
        public x: number,
        public y: number,
        public ctx: CanvasRenderingContext2D,
        public back: Square = null,
    ) {
        super(ctx);
    }

    draw(imgSquare) {
        this.getSize();
        this.ctx.drawImage(imgSquare, this.x, this.y, this.width, this.height)
        if (this.hasBack()) {
            this.back.draw(imgSquare)
        }
    }
    add() {
        if (this.hasBack()) return this.back.add();

        this.back = new Square(this.x, this.y, this.ctx)
    }
    hasBack() {
        return this.back !== null;
    }
    copy() {
        if (this.hasBack()) {
            this.back.copy()
            this.back.x = this.x
            this.back.y = this.y
        }
    }
    left() {
        this.copy()
        this.x -= this.width
    }
    right() {
        this.copy()
        this.x += this.width
    }
    up() {
        this.copy()
        this.y -= this.width
    }
    down() {
        this.copy()
        this.y += this.width
    }
    hit(head, seg = false) {
        if (this === head && !this.hasBack()) return false
        if (this === head) return this.back.hit(head, true)

        if (seg && !this.hasBack()) return false
        if (seg) return this.back.hit(head)

        if (this.hasBack()) {
            return squarehit(this, head) || this.back.hit(head)
        }

        return squarehit(this, head)
    }
    hitBorder(canvasW, canvasH) {
        return this.x > canvasW - 10 || this.x < 0 || this.y > canvasH - 10 || this.y < 0
    }
}

export class Snake {
    _eating: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    head: Square;
    direction: 'left' | 'right' | 'up' | 'down';
    constructor(public ctx: CanvasRenderingContext2D, imgSquare, size = 4) {
        this.head = new Square(100, 0, this.ctx);
        this.draw(imgSquare);
        this.direction = 'right'
        range(1, size).forEach(() => {
            this.head.add();
        })
    }
    draw(imgSquare) {


        this.head.draw(imgSquare)
    }
    left() {
        if (this.direction == 'right') return false
        this.direction = 'left'
    }
    right() {
        if (this.direction == 'left') return false
        this.direction = 'right'
    }
    up() {
        if (this.direction == 'down') return false
        this.direction = 'up'
    }
    down() {
        if (this.direction == 'up') return false
        this.direction = 'down'
    }
    move() {
        if (this.direction === 'left') return this.head.left();
        if (this.direction === 'right') return this.head.right();
        if (this.direction === 'up') return this.head.up();
        if (this.direction === 'down') return this.head.down();
    }
    eat() {
        this.head.add();
        this._eating.next(true);
    }
    onEat() {
        return this._eating.asObservable();
    }
    dead(canvasW, canvasH) {
        return this.head.hit(this.head) || this.head.hitBorder(canvasW, canvasH)
    }

}