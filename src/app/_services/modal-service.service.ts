import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  private static modalVisible: boolean = true;

  public getVisible(): boolean {
    return ModalService.modalVisible;
  }

  public setVisible(visible: boolean): void {
    ModalService.modalVisible = visible;
  }
}
