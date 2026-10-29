import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  triangle,
  ellipse,
  square,
  logOut,
  restaurantOutline,
  peopleOutline,
  personOutline,
  person,
  lockClosed,
  informationCircleOutline,
  checkmarkCircle,
  downloadOutline,
  cashOutline,
  receiptOutline,
  searchOutline,
  cardOutline,
  documentTextOutline,
  search,
  add,
  people,
  time,
  fastFoodOutline,
  ticketOutline,
  barChartOutline,
  arrowBack,
  close,
  restaurant,
  list,
  addCircle
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {
  constructor() {
    addIcons({
      triangle,
      ellipse,
      square,
      logOut,
      restaurantOutline,
      peopleOutline,
      personOutline,
      person,
      lockClosed,
      informationCircleOutline,
      checkmarkCircle,
      downloadOutline,
      cashOutline,
      receiptOutline,
      searchOutline,
      cardOutline,
      documentTextOutline,
      search,
      add,
      people,
      time,
      fastFoodOutline,
      ticketOutline,
      barChartOutline,
      arrowBack,
      close,
      restaurant,
      list,
      addCircle
    });
  }
}
