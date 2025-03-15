class AddBookReq {
    constructor(
        public title: string,
        public author: string,
        public description: string,
        public copies: number,
        public category: string,
        public img?: string
    ) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.copies = copies;
        this.category = category;
        this.img = img;
    }
}

export default AddBookReq;