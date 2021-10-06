import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
  selector: "app-toggle",
  templateUrl: "./toggle.component.html",
  styleUrls: ["./toggle.component.css"],
  animations: [
    trigger('toggle', [
      state('on', style({
        transform: 'translateX(0px)' 
      })),
      state('off', style({
        transform: 'translateX(-70px)' 
      })),
      transition('* => *', [
        animate('0.2s')
      ]),
    ]),
  ],
})
export class ToggleComponent implements OnInit {

  @Input() value: boolean;
  @Input() on: String;
  @Input() off: String;
  @Output() onChange = new EventEmitter<boolean>();

  ngOnInit() {
    console.log(this.on);
    console.log(this.off);
  }

  change($event) {
    this.onChange.emit(!this.value);

    $event.stopPropagation();
  }
}
