class History {
    constructor(
        public id: number,
        public userEmail: string,
        public checkoutDate: string,
        public returnedDate: string,
        public title: string,
        public author: string,
        public description: string,
        public img: string
    ) {
        this.id = id;
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.title = title;
        this.author = author;
        this.description = description;
        this.img = img;
    }
}

export default History;