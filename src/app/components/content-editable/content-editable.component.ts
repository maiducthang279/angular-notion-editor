import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-content-editable',
  templateUrl: './content-editable.component.html',
  styleUrls: ['./content-editable.component.css'],
})
export class ContentEditableComponent implements OnInit {
  private _contentEditable = true;

  @Input() innerRef: ElementRef = new ElementRef(null);
  @Input() html: string = 'Content Editable!';
  @Input() disabled: boolean = false;
  @Input() onChanges: Function = () => {};
  @Input() tagName: string = 'div';
  @Input() className: string = '';
  @Input() style: Object = {};

  public get contentEditable(): boolean {
    return this._contentEditable;
  }

  public set contentEditable(isContentEditable: boolean) {
    this._contentEditable = isContentEditable;
  }

  constructor(private _renderer: Renderer2, private _el: ElementRef) {}

  ngOnInit(): void {
    (this.disabled) ? this.contentEditable = false : this.contentEditable = true;
    const contentEditableElement = this._renderer.createElement(this.tagName) as ElementRef;

    this._renderer.setProperty(contentEditableElement, 'innerHTML', this.html);
    this._renderer.setProperty(contentEditableElement, 'contentEditable', this.contentEditable);
    this._renderer.listen(contentEditableElement, 'input', (e: Event) => this.onChanges(e));
    this._renderer.setProperty(contentEditableElement, 'class', this.className);
    Object.entries(this.style).forEach(([style, value]) => {
      this._renderer.setStyle(contentEditableElement, style, value);
    });

    this._renderer.appendChild(this._el.nativeElement, contentEditableElement);
  }
}
