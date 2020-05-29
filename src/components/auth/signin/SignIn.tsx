import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import events from './../../../lib/pubsub';
import history from './../../../lib/history';
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

    componentWillUnmount() {
        events.publish('/show/recovery', 'invisible');
    }

    componentWillMount() {
        events.publish('/show/recovery', 'visible');
    }

    render() {
        return(
            <div>
                <p className="container-title">Sign in to Internxt</p>

                <div className="menu-box">
                    <Button variant="dark" className='on' onClick={(e: any) => {
                        e.preventDefault();
                        history.push('/signin');
                    }}>Sign in</Button>

                    <Button variant="dark" className='off' onClick={(e: any) => {
                        e.preventDefault();
                        history.push('/signup');
                    }}>Create account</Button>
                </div>
                
                <Form className="form-register" onSubmit={(e: any) => {
                    e.preventDefault();
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
                            <Button variant="dark" className="on btn-block" disabled={true} type="submit">Sign in</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </div>
        );
    }
}

export default SignIn;