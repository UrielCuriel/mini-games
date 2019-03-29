import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { hit, Food, Snake } from './snake';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _width: number;
  private _height: number;
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
  constructor() {

  }
  async config(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.init()
    this.imgFood = new Image();
    this.imgFood.src = 'assets/sprites/snake/food.svg';
    this.imgSquare = new Image();
    this.imgSquare.src = 'assets/sprites/snake/square.svg';


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
    });
    this._animation = setInterval(() => {
      this.snake.move();
      this.ctx.clearRect(0, 0, this._width, this._height);
      this.snake.draw(this.ctx, this.imgSquare);
      this.drawFood();
      // tslint:disable-next-line: no-unused-expression
      this._foodcount >= this._nextlvl ? this.levelup() : null;
      if (this.snake.dead(this._width, this._height)) {
        window.clearInterval(this._animation);
        this.ctx.clearRect(0, 0, this._width, this._height);
        this._isDead.next(true);
      }
    }, 1000 / this._fps);
    setInterval(() => {
      const food = Food.generate(this._width, this._height);
      this._foods.push(food)
      setTimeout(() => {
        this.removeFromFoods(food)
      }, 10000)
    }, this._timefood)
  }

  protected init() {
    this._width = this.canvas.width;
    this._height = this.canvas.height;
    this._foodcount = 0;
    this._foods = [];
    this._fps = 5;
    this._level.next(0);
    this._nextlvl = 10;
    this._score.next(0);
    this._timefood = 2000;
  }
  removeFromFoods(food) {
    this._foods = this._foods.filter(_food => _food !== food);
  }
  protected drawFood() {
    this._foods.forEach((food: Food) => {
      if (typeof food !== 'undefined') {
        food.draw(this.ctx, this.imgFood);
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
    this._fps = this._fps * this._level.getValue();
    if (this._width < 1000 && this._level.getValue() % 3 === 1) {
      this._width += 250;
      this._height += 125;
      this.canvas.width = this._width;
      this.canvas.height = this._height;
    }

  }
}

