import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { hit, Food, Snake, size} from './snake';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  width: number;
  height: number;
  private _originalWidth: number;
  private _originalHeight: number;
  private _foods: any[];
  private _foodcount: number;
  private _nextlvl: number;
  private _level: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _score: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _isDead: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _fps: number;
  private _animation: any;
  private _timefood: number;
  snake: Snake;
  imgFood: HTMLImageElement;
  imgSquare: HTMLImageElement;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  _rw: number;
  _rh: number;
  _drawSize: any;
  _gcd: any;
  constructor() {

  }
  async config(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.ctx = ctx;
    this.canvas = canvas;
    this._originalWidth = this.ctx.canvas.width;
    this._originalHeight = this.ctx.canvas.height;
    this.imgFood = new Image();
    this.imgFood.src = 'assets/sprites/snake/food.svg';
    this.imgSquare = new Image();
    this.imgSquare.src = 'assets/sprites/snake/square.svg';
    this.init();

  }

  get level() {
    return this._level.asObservable();
  }

  get score() {
    return this._score.asObservable();
  }

  onDead() {
    return this._isDead.asObservable();
  }

  start() {
    this.init()
    this.snake = new Snake(this.ctx, this.imgSquare)
    this.snake.onEat().subscribe(() => {
      this._score.next(this._score.getValue() + 10);
      this._foodcount += 1;
      this.addFood();
    });
    this._animation = setInterval(() => {
      this.snake.move();
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.snake.draw(this.imgSquare);
      this.drawFood();
      // tslint:disable-next-line: no-unused-expression
      this._foodcount >= this._nextlvl ? this.levelup() : null;
      if (this.snake.dead(this.width, this.height)) {
        window.clearInterval(this._animation);
        this._animation = null;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this._isDead.next(true);
      }
    }, 1000 / this._fps);
  }
  protected addFood() {
    const food = Food.generate(this.ctx, this._drawSize);
    this._foods.push(food)
  }
  protected calcSize() {
    this._drawSize = size(this.width, this.height);
    console.log(this._drawSize);
    this._gcd = size(this.width, this.height);
    console.log(this._gcd);

    this._rw = this.width / this._gcd;
    this._rh = this.height / this._gcd;
    if (this._drawSize < 6) {
      console.log(this._rw);

      this.width += this._rw * 2;
      this.height += this._rh * 2;
      this.calcSize();
    }
  }
  protected init() {
    this.width = this._originalWidth;
    this.height = this._originalHeight;
    this.calcSize();
    this._foodcount = 0;
    this._foods = [];
    this._fps = 15;
    this._level.next(0);
    this._nextlvl = 10;
    this._score.next(0);
    this._timefood = 2000;
    window.clearInterval(this._animation);
    this._animation = null;
  }
  protected removeFromFoods(food) {
    this._foods = this._foods.filter(_food => _food !== food);
  }
  protected drawFood() {
    this._foods.forEach((food: Food) => {
      if (typeof food !== 'undefined') {
        food.draw(this.imgFood);
        if (hit(food, this.snake.head)) {
          this.snake.eat()
          this.removeFromFoods(food)
        }
      }
    });
  }
  levelup() {
    this._score.next(this._score.getValue() + 20);
    this._level.next(this._level.getValue() + 1);
    this._nextlvl = this._level.getValue() * 10;
    this._timefood += 1000
    this._fps = Math.ceil(this._fps * (this._level.getValue() + .2));
    if (this._level.getValue() % 3 === 1) {
      this.width += (this._rw + this._drawSize);
      this.height += (this._rh + this._drawSize);
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

  }
}


