import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import Message from "../../../models/Message.model";

export const PostNewMessage = () => {
    const { authState } = useOktaAuth();
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    async function submitNewQuestion() {
        const url = `${import.meta.env.VITE_API_MESSAGES_URL}/secure/add/message`;
        if (authState?.isAuthenticated === true && title !== '' && question !== '') {
            const messageRequestBody: Message = new Message(title, question);
            const reqOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageRequestBody)
            }
            const submitNewQuestionRes = await fetch(url, reqOptions);
            if (!submitNewQuestionRes.ok) {
                throw new Error("Some thing went wrong at post new message !");
            }

            setTitle('');
            setQuestion('');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return <div className='card mt-3'>
        <div className='card-header'>Ask question to Tai3 Read Admin</div>
        <div className='card-body'>
            <form method='POST'>
                {displayWarning &&
                    <div className='alert alert-danger' role='alert'>All fields must be filled out</div>}
                {displaySuccess &&
                    <div className='alert alert-success' role='alert'>Question added successfully</div>}
                <div className='mb-3'>
                    <label className='form-label'>Title</label>
                    <input type='text' className='form-control' id='exampleFormControlInput1'
                        placeholder='Title' onChange={e => setTitle(e.target.value)} value={title} />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Question</label>
                    <textarea className='form-control' id='exampleFormControlTextarea1'
                        rows={3} onChange={e => setQuestion(e.target.value)} value={question}>
                    </textarea>
                </div>
                <div>
                    <button type='button' className='btn btn-primary mt-3' onClick={submitNewQuestion}>Submit Question</button>
                </div>
            </form>
        </div>
    </div>;
}