import {Injectable} from '@angular/core';
import {PillmanData} from '@/_model/pillman-data';
import {StorageService} from './storage.service';
import {Observable, of} from 'rxjs';
import {DialogData, DialogResult, DialogResultButton, DialogType, IDialogDef} from '@/_model/dialog-data';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '@/components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public data: PillmanData;
  private dlgRef: MatDialogRef<any>;

  constructor(public ss: StorageService, private dialog: MatDialog) {
    this.load();
  }

  load(): void {
    this.data = new PillmanData();
    this.data.fillFromString(this.ss.read('pillman'));
  }

  save(): void {
    this.ss.write('pillman', this.data);
  }

  confirm(content: string | string[], type = DialogType.confirm): Observable<DialogResult> {
    return this.showDialog(type, content);
  }

  ask(content: string | string[], type: IDialogDef): Observable<DialogResult> {
    return this.showDialog(type, content);
  }

  showDialog(type: DialogType | IDialogDef, content: string | string[], disableClose = false): Observable<DialogResult> {
    // console.error(content);
    if (content == null || content === '' || content.length === 0) {
      const ret = new DialogResult();
      ret.btn = DialogResultButton.cancel;
      console.error('Es soll ein leerer Dialog angezeigt werden');
      return of(ret);
    }
    if (this.dlgRef?.componentInstance == null) {
      this.dlgRef = this.dialog.open(DialogComponent, {
        data: new DialogData(type, content),
        disableClose
      });
      this.dlgRef.keydownEvents().subscribe(event => {
        if (event.code === 'Escape') {
          this.dlgRef.close({btn: DialogResultButton.abort});
          this.dlgRef = null;
        }
      });
      if (!disableClose) {
        this.dlgRef.backdropClick().subscribe(_ => {
          this.dlgRef.close({btn: DialogResultButton.abort});
          this.dlgRef = null;
        });
      }
    } else {
      (this.dlgRef.componentInstance as DialogComponent).update(content);
    }

    return this.dlgRef.afterClosed();
  }
}
