import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent implements OnInit {

  private horizontalDefinitions: Array<Array<string>>;
  private verticalDefinitions: Array<Array<string>>;

  constructor() {
    this.horizontalDefinitions = [["massive plantigrade carnivorous or omnivorous mammals with long shaggy coats and strong claws", 
                                   "from a particular thing or place or position"],
                                  ["bound together on one edge",
                                   "the sacred writings of the Christian religions",
                                   "engage for a performance"],
                                  ["color of the sky",
                                   "color of the sun"],
                                  ["part of an orchestra, a choir"],[],['yo boy']];
    this.verticalDefinitions = [["not so massive plantigrade carnivorous or not with long shaggy coats and strong claws", 
                                 "from a particular place or position or hell"],
                                ["bound together on three edges",
                                 "the sacred writings of the Muslim religions",
                                 "engage for ..."],
                                ["color of the sun",
                                 "color of the sky"]];
   }

  ngOnInit() {
  }

}
