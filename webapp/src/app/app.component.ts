import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Sezione } from './models/Sezione'
import { Nastro } from './models/Nastro'

declare let io;
const APIEndpoint = environment.APIEndpoint;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MondoClean';
  nastri: Nastro[]
  sezioni: Sezione[]
  

  constructor(private http: HttpClient) { }

  getSezioni() {
    return this.http.get(`${APIEndpoint}/webapp/sezioni`);
  }

  getNastri(id: number) {
    return this.http.get(`${APIEndpoint}/webapp/sezioni/${id}/nastri`);
  }

  getAllNastri() {
    return this.http.get(`${APIEndpoint}/webapp/nastri`);
  }

  getNastriFromSezione(id: number) {
    let array = []
    for (let i = 0; i < this.nastri.length; i++) {
      if (this.nastri[i].sezione_id == id)
        array.push(this.nastri[i])
    }
    return array
  }

  isValidSpeed(speed) {
    if (speed > 60)
      return false
    else
      return true
  }

  isValidConsumption(consumption) {
    if (consumption > 60)
      return false
    else
      return true
  }

  ngOnInit() {
    const socket = io.connect(`${APIEndpoint}`);
    socket.on('connect', function () {
      console.log('Connected to WS server');
    });
    socket.on('warnings', (msg) => {
      console.log(msg)
      if (msg.type === 0)
        if (this.isValidSpeed(msg.value)) {
          console.log('Good speed')
          document.getElementById(msg.id_nastro).classList.remove('danger')
          document.getElementById('speed-' + msg.id_nastro).innerHTML = msg.value.toFixed(2) + " m/s"
        } else {
          console.log('Wrong speed on id', msg.id_nastro)
          document.getElementById('speed-' + msg.id_nastro).innerHTML = msg.value.toFixed(2) + " m/s"
          document.getElementById(msg.id_nastro).classList.add('danger')
        }
      else if (msg.type === 1)
        if (this.isValidConsumption(msg.value)) {
          console.log('Good cons')
          document.getElementById(msg.id_nastro).classList.remove('danger')
          document.getElementById('consumption-' + msg.id_nastro).innerHTML = msg.value.toFixed(2) + " W"
        } else {
          console.log('Wrong cons on id', msg.id_nastro)
          document.getElementById(msg.id_nastro).classList.add('danger')
          document.getElementById('consumption-' + msg.id_nastro).innerHTML = msg.value.toFixed(2) + " W"
        }
    })
    socket.on('general', (msg) => {
      if (msg.type === 0)
        if (this.isValidSpeed(msg.value)) {
          document.getElementById(msg.id_nastro).classList.remove('danger')
          document.getElementById('speed-' + msg.id_nastro).innerHTML = msg.value.toFixed(2) + " m/s"
        } else {
          document.getElementById('speed-' + msg.id_nastro).innerHTML = msg.value.toFixed(2) + " m/s"
          document.getElementById(msg.id_nastro).classList.add('danger')
        }
      else if (msg.type === 1)
        if (this.isValidConsumption(msg.value)) {
          document.getElementById(msg.id_nastro).classList.remove('danger')
          document.getElementById('consumption-' + msg.id_nastro).innerHTML = msg.value.toFixed(2) + " W"
        } else {
          document.getElementById(msg.id_nastro).classList.add('danger')
          document.getElementById('consumption-' + msg.id_nastro).innerHTML = msg.value.toFixed(2) + " W"
        }
    })
    this.getSezioni().subscribe(res => {
      this.sezioni = res as Sezione[]
    })
    this.getAllNastri().subscribe((res) => {
      this.nastri = res as Nastro[]
    })
  }

}
