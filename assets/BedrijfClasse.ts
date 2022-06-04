
import {Address} from './AdresClasse';

export class Bedrijf{
    referenceNumber: string;
    name : string;
    depositDate: string;
    address : Address;
    eigenVermogen : string;
    schulden: string;
    bedrijfswinst:string;
    opzoekDatum?: string;
  
    constructor(referenceNumber: string, name: string, depositDate: string, address: Address, eigenVermogen:string, schulden:string, bedrijfswinst:string ) {
      this.referenceNumber = referenceNumber;
      this.name = name;
      this.depositDate = depositDate;
      this.address = address;
      this.eigenVermogen = eigenVermogen;
      this.schulden = schulden;
      this.bedrijfswinst = bedrijfswinst;
    }
  

    
  }

  export class BedrijfProps{
    eigenVermogen : string;
    schulden: string;
    bedrijfswinst:string;
  
    constructor(eigenVermogen:string, schulden:string, bedrijfswinst:string){
      this.eigenVermogen = eigenVermogen;
      this.schulden = schulden;
      this.bedrijfswinst = bedrijfswinst;
    }
  }