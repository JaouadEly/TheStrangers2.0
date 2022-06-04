export class Address{
    city:        string;
    number:      string;
    postalCode:  string;
    street:      string;
  
    constructor(city: string, postalCode:string,street:string, number : string){
      this.city = city;
      this.number = number;
      this.postalCode = postalCode;
      this.street = street;
  
    }
  }