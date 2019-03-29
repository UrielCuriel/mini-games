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
  constructor(public snakeService: GameService) {
    this.snakeService.score.subscribe(
      (score) => {
        console.log(score);

      }
    );
    this.snakeService.level.subscribe(
      (level) => {
        console.log(level);

      }
    );
    this.snakeService.onDead().subscribe(
      () => {
        console.log('has muerto');

      }
    );
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    // get the context
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasEl.getContext('2d');
    canvasEl.height = window.innerHeight * .8;
    canvasEl.width = window.innerWidth * .8;

    this.snakeService.config(this.ctx, canvasEl);
  }
  @HostListener('window:keyup.ArrowUp')
  moveUp() {
    this.snakeService.snake.up();
  }
  @HostListener('window:keyup.ArrowDown')
  moveDown() {
    this.snakeService.snake.down();
  }
  @HostListener('window:keyup.ArrowLeft')
  moveLeft() {
    this.snakeService.snake.left();
  }
  @HostListener('window:keyup.ArrowRight')
  moveRight() {
    this.snakeService.snake.right();
  }
}
