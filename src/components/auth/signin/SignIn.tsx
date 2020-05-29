import React from 'react';
import { Form, Button, Col, Image } from 'react-bootstrap';
import events from './../../../lib/pubsub';
import validator from './../../../lib/validator';
import history from './../../../lib/history';
import './SignIn.scss';
import logo from './../../../assets/img/inxt-logo-black.svg';

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

    handleEmailChange(e: any) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e: any) {
        this.setState({ password: e.target.value });
    }

    isValidForm(): Boolean {
        let isValid = true;
        console.log('valid signin');

        if (this.state.email.length < 5 || !validator.isValidEmail(this.state.email)) isValid = false;
        if (this.state.password.length < 1) isValid = false;
        return isValid;
    }    

    render(): JSX.Element {
        return(
            <div>
                <p className="container-title">
                    <Image
                        src={logo}
                        height={50}
                        width={150} />
                </p>

                <div className="menu-box">
                    <Button variant="dark" className='on __signin-btn' onClick={(e: any) => {
                        e.preventDefault();
                        history.push('/signin');
                    }}>Sign in</Button>

                    <Button variant="dark" className='off __signup-btn' onClick={(e: any) => {
                        e.preventDefault();
                        history.push('/signup');
                    }}>Create account</Button>
                </div>
                
                <Form className="form-register" onSubmit={(e: any) => {
                    e.preventDefault();
                }}>

                    <Form.Row>
                        <Form.Group as={Col} controlId="email">
                            <Form.Control placeholder="Email address" required type="email" name="email" autoComplete="username" value={this.state.email} autoFocus onChange={this.handleEmailChange.bind(this)} />
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId="password">
                            <Form.Control placeholder="Password" required type="password" name="password" autoComplete="current-password" value={this.state.password} onChange={this.handlePasswordChange.bind(this)}/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row className="form-register-submit">
                        <Form.Group as={Col}>
                            <Button variant="dark" className="on btn-block" disabled={!this.isValidForm()} type="submit">Sign in</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </div>
        );
    }
}

export default SignIn;