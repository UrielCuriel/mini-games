import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { GameService } from './game.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})


export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  width = 0;
  height = 0;
  constructor(public snakeService: GameService) {

    this.snakeService.score.subscribe(
      (score) => {
        console.log(score);

      }
    );
    this.snakeService.level.subscribe(
      (level) => {
        this.width = this.snakeService.width;
        this.height = this.snakeService.height;
        console.log(this.width);
        console.log(this.height);
      }
    );
    this.snakeService.onDead().subscribe(
      () => {
        console.log('has muerto');

      }
    );
  }

  ngOnInit() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

  }
  ngAfterViewInit() {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');

    this.snakeService.config(this.ctx, canvasEl);
    canvasEl.onresize = this.ngAfterViewInit;
  }
  @HostListener('window:keydown.ArrowUp')
  moveUp() {
    this.snakeService.snake.up();
  }
  @HostListener('window:keydown.ArrowDown')
  moveDown() {
    this.snakeService.snake.down();
  }
  @HostListener('window:keydown.ArrowLeft')
  moveLeft() {
    this.snakeService.snake.left();
  }
  @HostListener('window:keydown.ArrowRight')
  moveRight() {
    this.snakeService.snake.right();
  }
}
