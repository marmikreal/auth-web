import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import './SignIn.scss';

interface Props {}
interface State {
    email: string,
    password: string
}

class SignIn extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };
    }

    render() {
        return(
            <Form className="form-register" onSubmit={(e: any) => {
                e.preventDefault();
                    console.log('ieaa');
                }}>

                <Form.Row>
                    <Form.Group as={Col} controlId="email">
                    <Form.Control placeholder="Email address" required type="email" name="email" autoComplete="username" value={this.state.email} autoFocus onChange={() => {}} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="password">
                    <Form.Control placeholder="Password" required type="password" name="password" autoComplete="current-password" value={this.state.password} onChange={() => {}}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row className="form-register-submit">
                    <Form.Group as={Col}>
                    <Button className="on btn-block" disabled={true} type="submit">Sign in</Button>
                    </Form.Group>
                </Form.Row>
            </Form>
        );
    }
}

export default SignIn;