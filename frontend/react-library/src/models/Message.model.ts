class Message {
    constructor(
        public title: string,
        public question: string,
        public id?: number,
        public userEmail?: string,
        public adminEmail?: string,
        public response?: string,
        public closed?: boolean
    ) {
        this.title = title;
        this.question = question;
    }
}

export default Message;