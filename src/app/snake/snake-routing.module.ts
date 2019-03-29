import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SnakeComponent } from './snake.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  {
    path: '',
    component: SnakeComponent,
    children: [
      {
        path: '',
        component: GameComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [SnakeComponent, GameComponent]
})
export class SnakeRoutingModule { }
