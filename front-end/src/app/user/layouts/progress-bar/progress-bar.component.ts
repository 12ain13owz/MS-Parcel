import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../shared/notify.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  constructor(public notify: NotifyService) {}

  ngOnInit(): void {}
}
