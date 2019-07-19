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

  sezioni: Sezione[]
  nastri: Nastro[]

  constructor(private http: HttpClient) {}

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
    for(let i=0; i < this.nastri.length; i++) {
      if(this.nastri[i].sezione_id == id)
        array.push(this.nastri[i])
    }
    return array
  }

  ngOnInit() {
    const socket = io.connect('http://localhost:3000');
    socket.on('connect', function() {
      console.log('Connected to WS server');
    });
    socket.on('locations', function(msg) {
      console.log(msg)
    })
    this.getSezioni().subscribe(res => {
      this.sezioni = res as Sezione[]
    })
    this.getAllNastri().subscribe((res: Nastro[]) => {
      this.nastri = res
      console.log(this.nastri)
    })
  }
  
}
