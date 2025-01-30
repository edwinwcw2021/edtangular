export class Books {
  isbn:string;
  bookTitle:string;
  bookAuthor:string;
  yearOfPublic:string;
  publisher:string;
  moOfCopies:number;
  imageURLS:string;
  imageURLM:string;
  imageURLL:string;
}

export class Users {
  userId:number;
  userName:string;
}

export class vwAvailableBook {
  isBorrowed:boolean;
  userName:string;
  bookTitle:string;
  dateExpectedReturn:string;
  bookInventoryId:number;
  isbn:string;
  copiesNumber:number;
}

export class BorrowInput {
  userId:number;
  bookInventoryId:number;
}

export class BorrowHistory {
  borrowId:number;
  bookInventoryId:number;
  borrowByUserId:number;
  dateBorrow:string;
  dateReturn:string;
  dateExpectedReturn:string;
}

