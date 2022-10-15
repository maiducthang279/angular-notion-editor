import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-content-editable',
  templateUrl: './content-editable.component.html',
  styleUrls: ['./content-editable.component.scss'],
})
export class ContentEditableComponent implements OnInit, OnChanges {
  @Input() tag: string = 'p';
  @Input() html: string = '';
  @Output() change = new EventEmitter<any>();
  @Output() blur = new EventEmitter<any>();
  @Output() keyUp = new EventEmitter<any>();
  @Output() keyDown = new EventEmitter<any>();

  private _lastHtml = '';

  private currentElement: any;
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this._setContent(this.tag, this.html);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes['tag'] && !changes['html']) {
      const { tag } = changes;

      const isFocused = this.currentElement === document.activeElement;
      if (this.elementRef.nativeElement.childNodes[0]) {
        this.renderer.removeChild(
          this.elementRef.nativeElement,
          this.elementRef.nativeElement.childNodes[0]
        );
      }
      this._setContent(tag?.currentValue ?? this.tag, this.html);

      if (isFocused) {
        this.currentElement.focus();
      }
      this._replaceCaret(this.currentElement);
    }
  }

  private _setContent(tag: string, html: string) {
    this.currentElement = this.renderer.createElement(tag);
    const text = this.renderer.createText(html);
    this.renderer.setAttribute(this.currentElement, 'contentEditable', 'true');
    this.renderer.listen(this.currentElement, 'input', () =>
      this._emitChange()
    );
    this.renderer.listen(this.currentElement, 'blur', (event) =>
      this.blur.emit(event)
    );
    this.renderer.listen(this.currentElement, 'keyup', (event) =>
      this.keyUp.emit(event)
    );
    this.renderer.listen(this.currentElement, 'keydown', (event) =>
      this.keyDown.emit(event)
    );
    this.renderer.appendChild(this.currentElement, text);
    this.renderer.appendChild(
      this.elementRef.nativeElement,
      this.currentElement
    );
  }

  private _emitChange() {
    if (!this.currentElement) {
      return;
    }
    const html = this.currentElement.innerHTML;
    if (html !== this._lastHtml) {
      this.change.emit(html);
    }
    this._lastHtml = html;
  }

  private _replaceCaret(element: HTMLElement) {
    const target = document.createTextNode('');
    element.appendChild(target);
    const isTargetFocused = document.activeElement === element;
    if (target !== null && target.nodeValue !== null && isTargetFocused) {
      var sel = window.getSelection();
      if (sel !== null) {
        var range = document.createRange();
        range.setStart(target, target.nodeValue.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      if (element instanceof HTMLElement) element.focus();
    }
  }

  private _normalizeHtml(str: string) {
    return str && str.replace(/&nbsp;|\u202F|\u00A0/g, ' ');
  }
}
