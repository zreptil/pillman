export enum DialogResultButton {
  ok,
  cancel,
  yes,
  no,
  abort
}

export enum DialogType {
  confirm,
  confirmNo,
  info,
  debug,
  error
}

export class DialogResult {
  btn: DialogResultButton | any;
  data?: any;
}

export interface IDialogButton {
  title: string;
  result: DialogResult;
  focus?: boolean;
}

export interface IDialogDef {
  title: string;
  buttons: IDialogButton[];
  mayDisableControl?: (key: string) => boolean;
}

export class DialogData {
  result: DialogResult;
  title: string | string[];
  buttons: IDialogButton[];
  private defs = new Map<DialogType, IDialogDef>([
    [DialogType.info, {
      title: $localize`Information`,
      buttons: [
        {title: $localize`Ok`, result: {btn: DialogResultButton.ok}}
      ]
    }
    ],
    [DialogType.error, {
      title: $localize`Fehler`,
      buttons: [
        {title: $localize`Ok`, result: {btn: DialogResultButton.ok}}
      ]
    }
    ],
    [DialogType.debug, {
      title: $localize`Debug Meldung`,
      buttons: [
        {title: $localize`Ok`, result: {btn: DialogResultButton.ok}}
      ]
    }
    ],
    [DialogType.confirm, {
      title: $localize`Bestätigung`,
      buttons: [
        {title: $localize`Nein`, result: {btn: DialogResultButton.no}},
        {title: $localize`Ja`, result: {btn: DialogResultButton.yes}, focus: true}
      ]
    }
    ],
    [DialogType.confirmNo, {
      title: $localize`Bestätigung`,
      buttons: [
        {title: $localize`Nein`, result: {btn: DialogResultButton.no}, focus: true},
        {title: $localize`Ja`, result: {btn: DialogResultButton.yes}}
      ]
    }
    ]
  ]);

  constructor(public type: DialogType | IDialogDef,
              public content: string | string[],
              public ownButtons?: IDialogButton[]) {
    if (typeof type === 'number') {
      this.buttons = this.defs.get(type).buttons;
      this.title = this.defs.get(type).title;
    } else {
      this.buttons = type.buttons;
      this.title = type.title;
    }
  }

  get display(): string[] {
    if (Array.isArray(this.content)) {
      if (this.content.length > 0) {
        if (typeof this.content[0] === 'string') {
          return this.content as string[];
        }
      }
      return [];
    }
    return [typeof this.content === 'string' ? this.content : null];
  }

  update(content: string | string[]): void {
    this.content = content;
  }
}
