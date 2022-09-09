import {Injectable} from '@angular/core';
import {PillmanData} from '@/_model/pillman-data';
import {StorageService} from './storage.service';
import {Observable, of} from 'rxjs';
import {DialogData, DialogResult, DialogResultButton, DialogType, IDialogDef} from '@/_model/dialog-data';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from '@/components/dialog/dialog.component';
import {Log} from '@/_services/log.service';
import {ColorDialogData} from '@/controls/color-picker/color-picker.component';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public data: PillmanData;
  private dlgRef: MatDialogRef<any>;

  constructor(public ss: StorageService, private dialog: MatDialog) {
    this.load();
  }

  get mayDebug(): boolean {
    return Log.mayDebug;
  }

  load(): void {
    this.data = new PillmanData();
    const src = this.ss.read('pillman');
    this.data.fillFromString(src);
  }

  save(): void {
    this.ss.write('pillman', this.data);
  }

  info(content: string | string[], type = DialogType.info): Observable<DialogResult> {
    return this.showDialog(type, content);
  }

  onColorDataChanged(data: ColorDialogData) {
    this.data.colorImage = data.imageDataUrl;
    this.data.colorPickerMode = data.mode;
    this.data.mixColors = data.mixColors;
    this.save();
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
