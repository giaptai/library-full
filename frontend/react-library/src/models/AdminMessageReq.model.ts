class AdminMessageReq {
    constructor(public id: number, public response: string) {
        this.id = id;
        this.response = response;
    }
}

export default AdminMessageReq;