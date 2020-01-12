import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { switchMap, map } from "rxjs/operators";
import { Board, Task } from "../kanban/board.model";
import * as firebase from "firebase";
@Injectable({
  providedIn: "root"
})
export class BoardService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  async createBoard(data: Board) {
    const user = await this.afAuth.auth.currentUser;
    return this.db.collection("boards").add({
      ...data,
      uid: user.uid,
      tasks: [{ description: "Write A Description Here", label: "yellow" }]
    });
  }

  deleteBoard(boardId: string) {
    return this.db
      .collection("boards")
      .doc(boardId)
      .delete();
  }

  updateTasks(boardId: string, tasks: Task[]) {
    return this.db
      .collection("boards")
      .doc(boardId)
      .update({ tasks });
  }

  removeTask(boardId: string, task: Task) {
    return this.db
      .collection("boards")
      .doc("boardId")
      .update({
        tasks: firebase.firestore.FieldValue.arrayRemove(task)
      });
  }

  getUserBoards() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Board>("boards", ref =>
              ref.where("uid", "==", user.uid).orderBy("priority")
            )
            .valueChanges({ idField: "id" });
        } else {
          return [];
        }
      })
    );
  }

  sortBoards(boards: Board[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = boards.map(board => db.collection("boards").doc(board.id));
    refs.forEach((ref, index) => batch.update(ref, { priority: index }));
    batch.commit();
  }
} // End of class
