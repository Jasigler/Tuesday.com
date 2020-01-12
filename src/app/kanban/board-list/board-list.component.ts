import { Component, OnDestroy, OnInit } from "@angular/core";
import { BoardService } from "../../services/board.service";
import { Subscription } from "rxjs";
import { Board } from "../board.model";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-board-list",
  templateUrl: "./board-list.component.html",
  styleUrls: ["./board-list.component.scss"]
})
export class BoardListComponent implements OnInit, OnDestroy {
  constructor(public boardService: BoardService) {}
  boards: Board[];
  sub: Subscription;

  ngOnInit() {
    this.sub = this.boardService
      .getUserBoards()
      .subscribe(boards => (this.boards = boards));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.boards, event.previousIndex, event.currentIndex);
    this.boardService.sortBoards(this.boards);
  }
}
