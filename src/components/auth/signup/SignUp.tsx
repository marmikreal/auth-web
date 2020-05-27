import React from 'react';
import { Form, Col } from 'react-bootstrap';
import './SignUp.scss';

interface Props {}
interface State {
    firstName: string,
    lastName: string,
    email: string
}

class SignUp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: ''
        };
    }

    render() {
        return(
            <Form className="form-register" onSubmit={(e: any) => {
                e.preventDefault();
            }}>
                <Form.Row>
                    <Form.Group as={Col} controlId="name">
                        <Form.Control placeholder="First name" required autoComplete="name" onChange={() => {}} value={''} autoFocus />
                    </Form.Group>
                    <Form.Group as={Col} controlId="lastname">
                        <Form.Control placeholder="Last name" required autoComplete="lastname" onChange={() => {}} value={''} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="email">
                        <Form.Control placeholder="Email address" type="email" required autoComplete="email" onChange={() => {}} value={''} />
                    </Form.Group>
                </Form.Row>
                <Form.Row className="form-register-submit">
                    <Form.Group as={Col}>
                        <button className="on btn-block" type="submit">Continue</button>
                    </Form.Group>
                </Form.Row>
            </Form>
        );
    }
}

export default SignUp;